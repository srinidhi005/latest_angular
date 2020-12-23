import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
interface TableItem {
  name: string;
  [key: string]: string;
}
@Component({
  selector: 'app-liquidity-ratios',
  templateUrl: './liquidity-ratios.component.html',
  styleUrls: ['./liquidity-ratios.component.scss'],
})
export class LiquidityRatiosComponent implements OnInit, OnChanges {
  @Input() loading: boolean;
  @Input() actuals: any[];
  @Input() projections: any[];

  dataColumns = [
    'Current Ratio (Current Assets / Current Liabilities)',
    'Quick Ratio (Cash + Accounts Receivables / Current Liabilities)',
    'Cash Ratio (Cash / Current Liabilities)',
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
      const currentRatio: any = {
        name: this.dataColumns[0],
      };
      actualColumns.forEach((d: any) => {
        currentRatio[d.value] = this.actuals[d.index].currentratio;
      });
      projectionColumn.forEach((d: any) => {
        currentRatio[d.value] = this.projections[d.index].currentratio;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          currentRatio[a.value] = (
            this.actuals[a.index].currentratio || 0.0
          ).toFixed(2);
        } else {
          currentRatio[a.value] = (
            this.projections[a.index].currentratio || 0.0
          ).toFixed(2);
        }
      });
      this.data.push(currentRatio);
      const quickratio: any = {
        name: this.dataColumns[1],
      };
      actualColumns.forEach((d: any) => {
        quickratio[d.value] = this.actuals[d.index].quickratio;
      });
      projectionColumn.forEach((d: any) => {
        quickratio[d.value] = this.projections[d.index].quickratio;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          quickratio[a.value] = (
            this.actuals[a.index].quickratio || 0.0
          ).toFixed(2);
        } else {
          quickratio[a.value] = (
            this.projections[a.index].quickratio || 0.0
          ).toFixed(2);
        }
      });
      this.data.push(quickratio);
      const cashratio: any = {
        name: this.dataColumns[2],
      };
      actualColumns.forEach((d: any) => {
        cashratio[d.value] = this.actuals[d.index].cashratio;
      });
      projectionColumn.forEach((d: any) => {
        cashratio[d.value] = this.projections[d.index].cashratio;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          cashratio[a.value] = (this.actuals[a.index].cashratio || 0.0).toFixed(
            2
          );
        } else {
          cashratio[a.value] = (
            this.projections[a.index].cashratio || 0.0
          ).toFixed(2);
        }
      });
      this.data.push(cashratio);
      this.columnFields.push(
        ...actualColumns.map((a) => a.value),
        ...projectionColumn.map((a) => a.value),
        ...averages.map((a) => a.value)
      );
      console.log('Loaded!', this.loading, this.actuals, this.projections);
    }
  }
}
