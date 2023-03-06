import { Component, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';

import { MatPaginator, MatTableDataSource } from '@angular/material';

type AOA = any[][];

@Component({
  selector: 'app-import-xlsx',
  templateUrl: './import-xlsx.component.html',
  styleUrls: ['./import-xlsx.component.css'],
})
export class ImportXlsxComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  public dataSource = new MatTableDataSource();
  displayedColumns = [];

  fileUploaded = false;
  codigosPostales: string[];

  data: AOA = [
    [1, 2],
    [3, 4],
  ];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName = 'SheetJS.xlsx';
  constructor() {}

  ngOnInit() {}

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
      //console.log(this.data);
      this.bullkVerification();
    };
    reader.readAsBinaryString(evt[0]);
  }

  bullkVerification() {
    const pattern: RegExp = /@Gmail\.com$/i;
    var channelArray: Array<string> = ['one', 'two', 'three'];

    for (let i = 0; i < this.data.length; i++) {
      const secTenantsSelected = this.data[i][5];
      // if the required fields are present we will continue to verify further
      if (this.rowRequired(this.data[i])) {
        if (!pattern.test(this.data[i][0])) {
          this.data[i][6] = 'tito';
        } else if (!this.stringInArray(channelArray, this.data[i][4])) {
          this.data[i][6] = 'pito';
        } else if (
          secTenantsSelected != null &&
          secTenantsSelected != undefined &&
          secTenantsSelected != ''
        ) {
          const secTenantsList = secTenantsSelected.split(',');

          for (let j = 0; j < secTenantsList.length; j++) {
            if (!this.stringInArray(channelArray, secTenantsList[j])) {
              this.data[i][6] = secTenantsList[j].concat(
                '- Invalid Secondary Tenant'
              );
            }
          }
        } else {
          this.data[i][6] = 'Success';
        }
      }
    }
  }

  stringInArray(arr: string[], str: string): boolean {
    return arr.some((item) => item.toUpperCase() === str.toUpperCase());
  }

  rowRequired(row) {
    if (!row[0]) {
      row[6] = 'Email is a required field';
      return false;
    } else if (!row[3]) {
      row[6] = 'DisplayName is a required field';
      return false;
    }
    if (!row[4]) {
      row[6] = 'PrimaryTenant is a required field';
      return false;
    } else {
      return true;
    }
  }
}
