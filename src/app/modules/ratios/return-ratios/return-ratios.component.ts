import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ExcelService } from 'src/app/shared/excel.service';
interface TableItem {
  name: string;
  [key: string]: string;
}
@Component({
  selector: 'app-return-ratios',
  templateUrl: './return-ratios.component.html',
  styleUrls: ['./return-ratios.component.scss'],
})
export class ReturnRatiosComponent implements OnInit, OnChanges {
  @Input() loading: boolean;
  @Input() actuals: any[];
  @Input() projections: any[];

  dataColumns = [
    'Operating Return on Assets (ROA): EBIT / Average Total Assets',
    'Cash Return on Assets (ROA): CFO / Average Total Assets',
    'Return on Assets (ROA): Net Income / Average Total Assets',
    'Return on Total Capital: EBIT / Total Debt and Equity',
    `Return on Equity (ROE): Net Income / Average Shareholder's Equity`,
  ];
  columnFields = ['name'];
  data = [];
  actualSpan = 0;
  projectionSpan = 0;
  averageColumns = [];
  constructor(private excelService : ExcelService) {}

  ngOnInit() {
    console.log('Loading...', this.loading);
  }
  ngOnChanges() {
    if (!this.loading) {
      this.data = [];
      this.columnFields = ['name'];
      const actualColumns = [];
      const projectionColumn = [];
      const averages = [];
      this.averageColumns = [];
      this.actuals.forEach((d: any, index: number) => {
        if (typeof d.asof === 'number') {
          actualColumns.push({ value: String(d.asof), index });
        } else {
          averages.push({ value: d.asof, isActual: true, index });
          this.averageColumns.push(d.asof);
        }
      });
      this.projections.forEach((d: any, index: number) => {
        if (typeof d.asof === 'number') {
          projectionColumn.push({ value: String(d.asof), index });
        } else {
          averages.push({ value: d.asof, isActual: false, index });
          this.averageColumns.push(d.asof);
        }
      });
      this.actualSpan = actualColumns.length;
      this.projectionSpan = projectionColumn.length;
      const operatingreturnassets: any = {
        name: this.dataColumns[0],
      };
      actualColumns.forEach((d: any) => {
        operatingreturnassets[d.value] =
          this.actuals[d.index].operatingreturnassets || 0;
      });
      projectionColumn.forEach((d: any) => {
        operatingreturnassets[d.value] =
          this.projections[d.index].operatingreturnassets || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          operatingreturnassets[a.value] =
            this.actuals[a.index].operatingreturnassets || 0.0;
        } else {
          operatingreturnassets[a.value] =
            this.projections[a.index].operatingreturnassets || 0.0;
        }
      });
      this.data.push(operatingreturnassets);
      const cashreturnassets: any = {
        name: this.dataColumns[1],
      };
      actualColumns.forEach((d: any) => {
        cashreturnassets[d.value] = this.actuals[d.index].cashreturnassets || 0;
      });
      projectionColumn.forEach((d: any) => {
        cashreturnassets[d.value] =
          this.projections[d.index].cashreturnassets || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          cashreturnassets[a.value] =
            this.actuals[a.index].cashreturnassets || 0.0;
        } else {
          cashreturnassets[a.value] =
            this.projections[a.index].cashreturnassets || 0;
        }
      });
      this.data.push(cashreturnassets);
      const returnassets: any = {
        name: this.dataColumns[2],
      };
      actualColumns.forEach((d: any) => {
        returnassets[d.value] = this.actuals[d.index].returnassets || 0;
      });
      projectionColumn.forEach((d: any) => {
        returnassets[d.value] = this.projections[d.index].returnassets || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          returnassets[a.value] = this.actuals[a.index].returnassets || 0;
        } else {
          returnassets[a.value] = this.projections[a.index].returnassets || 0;
        }
      });
      this.data.push(returnassets);
      const returntotalcapital: any = {
        name: this.dataColumns[3],
      };
      actualColumns.forEach((d: any) => {
        returntotalcapital[d.value] =
          this.actuals[d.index].returntotalcapital || 0;
      });
      projectionColumn.forEach((d: any) => {
        returntotalcapital[d.value] =
          this.projections[d.index].returntotalcapital || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          returntotalcapital[a.value] =
            this.actuals[a.index].returntotalcapital || 0;
        } else {
          returntotalcapital[a.value] =
            this.projections[a.index].returntotalcapital || 0;
        }
      });
      this.data.push(returntotalcapital);
      const returnequity: any = {
        name: this.dataColumns[4],
      };
      actualColumns.forEach((d: any) => {
        returnequity[d.value] = this.actuals[d.index].returnequity || 0;
      });
      projectionColumn.forEach((d: any) => {
        returnequity[d.value] = this.projections[d.index].returnequity || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          returnequity[a.value] = this.actuals[a.index].returnequity || 0;
        } else {
          returnequity[a.value] = this.projections[a.index].returnequity || 0;
        }
      });
      this.data.push(returnequity);

      this.columnFields.push(
        ...actualColumns.map((a) => a.value),
        ...projectionColumn.map((a) => a.value),
        ...averages.map((a) => a.value)
      );
      // console.log('Loaded!', this.loading, this.actuals, this.projections);
      this.excelService.returnRatiosData = this.data
      console.log("RETURN RATIOS", this.excelService.returnRatiosData);

    }
  }

  isAverage(name) {
    return this.averageColumns.indexOf(name) > -1;
  }
}
