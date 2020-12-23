import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
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
  constructor() {}

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
      this.actuals.forEach((d: any, index: number) => {
        if (typeof d.asof === 'number') {
          actualColumns.push({ value: String(d.asof), index });
        } else {
          averages.push({ value: d.asof, isActual: true, index });
        }
      });
      this.projections.forEach((d: any, index: number) => {
        if (typeof d.asof === 'number') {
          projectionColumn.push({ value: String(d.asof), index });
        } else {
          averages.push({ value: d.asof, isActual: false, index });
        }
      });
      this.actualSpan = actualColumns.length;
      this.projectionSpan = projectionColumn.length;
      const operatingreturnassets: any = {
        name: this.dataColumns[0],
      };
      actualColumns.forEach((d: any) => {
        operatingreturnassets[d.value] = this.actuals[
          d.index
        ].operating_return_on_assets;
      });
      projectionColumn.forEach((d: any) => {
        operatingreturnassets[d.value] = this.projections[
          d.index
        ].operating_return_on_assets;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          operatingreturnassets[a.value] = (
            this.actuals[a.index].operating_return_on_assets || 0.0
          ).toFixed(2);
        } else {
          operatingreturnassets[a.value] = (
            this.projections[a.index].operating_return_on_assets || 0.0
          ).toFixed(2);
        }
      });
      this.data.push(operatingreturnassets);
      const cashreturnassets: any = {
        name: this.dataColumns[1],
      };
      actualColumns.forEach((d: any) => {
        cashreturnassets[d.value] = this.actuals[d.index].cash_return_on_assets;
      });
      projectionColumn.forEach((d: any) => {
        cashreturnassets[d.value] = this.projections[
          d.index
        ].cash_return_on_assets;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          cashreturnassets[a.value] = (
            this.actuals[a.index].cash_return_on_assets || 0.0
          ).toFixed(2);
        } else {
          cashreturnassets[a.value] = (
            this.projections[a.index].cash_return_on_assets || 0
          ).toFixed(2);
        }
      });
      this.data.push(cashreturnassets);
      const returnassets: any = {
        name: this.dataColumns[2],
      };
      actualColumns.forEach((d: any) => {
        returnassets[d.value] = this.actuals[d.index].return_on_assets;
      });
      projectionColumn.forEach((d: any) => {
        returnassets[d.value] = this.projections[d.index].return_on_assets;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          returnassets[a.value] = (
            this.actuals[a.index].return_on_assets || 0
          ).toFixed(2);
        } else {
          returnassets[a.value] = (
            this.projections[a.index].return_on_assets || 0
          ).toFixed(2);
        }
      });
      this.data.push(returnassets);
      const returntotalcapital: any = {
        name: this.dataColumns[3],
      };
      actualColumns.forEach((d: any) => {
        returntotalcapital[d.value] = this.actuals[
          d.index
        ].return_on_total_capital;
      });
      projectionColumn.forEach((d: any) => {
        returntotalcapital[d.value] = this.projections[
          d.index
        ].return_on_total_capital;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          returntotalcapital[a.value] = (
            this.actuals[a.index].return_on_total_capital || 0
          ).toFixed(2);
        } else {
          returntotalcapital[a.value] = (
            this.projections[a.index].return_on_total_capital || 0
          ).toFixed(2);
        }
      });
      this.data.push(returntotalcapital);
      const returnequity: any = {
        name: this.dataColumns[3],
      };
      actualColumns.forEach((d: any) => {
        returnequity[d.value] = this.actuals[d.index].return_on_equity;
      });
      projectionColumn.forEach((d: any) => {
        returnequity[d.value] = this.projections[d.index].return_on_equity;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          returnequity[a.value] = (
            this.actuals[a.index].return_on_equity || 0
          ).toFixed(2);
        } else {
          returnequity[a.value] = (
            this.projections[a.index].return_on_equity || 0
          ).toFixed(2);
        }
      });
      this.data.push(returnequity);

      this.columnFields.push(
        ...actualColumns.map((a) => a.value),
        ...projectionColumn.map((a) => a.value),
        ...averages.map((a) => a.value)
      );
      console.log('Loaded!', this.loading, this.actuals, this.projections);
    }
  }
}
