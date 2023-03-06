
import { Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';

import * as XLSX from 'xlsx';
import { MatPaginator, MatTableDataSource } from '@angular/material';


type AOA = any[][];

@Component({
  selector: 'app-import-xlsx-2',
  templateUrl: './import-xlsx-2.component.html',
  styleUrls: ['./import-xlsx-2.component.css']
})
export class ImportXlsx2Component  implements OnInit, AfterViewInit {
  @Input() showTable = false;
  @Output() private importar = new EventEmitter<string[]>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  public dataSource = new MatTableDataSource();
  displayedColumns = [];

  data: AOA = [[], []];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName = 'SheetJS.xlsx';
  fileUploaded = false;
  codigosPostales: string[];

 

  constructor() {}

  ngOnInit() {
    console.log('history.state: ', history.state);
  }

  ngAfterViewInit(): void {
    //this.dataSource.paginator = this.paginator;
  }

  onFileChange(evt: FileList) {
    /* wire up file reader */
    // const target: DataTransfer = evt.target as DataTransfer;
    if (evt.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as AOA;
      this.loadTable();
      console.log('Datos de la tabla', this.data);
    };
    reader.readAsBinaryString(evt[0]);
  }

  loadTable() {
    this.displayedColumns = this.data.shift();

    if (this.showTable) {
      this.fileUploaded = true;
      this.dataSource.data = this.data;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 100);
    }

    this.extraerCodigosPostales();
    this.importar.emit(this.codigosPostales);
    console.log('CodigosPostales', this.codigosPostales);
  }

  extraerCodigosPostales() {
    this.codigosPostales = this.data
      .map(value => {
        if (!!value && value.length > 0) {
          return value[0].toString();
        }
      })
      .filter(value => value != undefined);
  }

  export(): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  editarRegistro(row) {
    console.log('Row', row);
  }
}