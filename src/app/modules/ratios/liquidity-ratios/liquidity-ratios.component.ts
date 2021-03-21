import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/shared/excel.service';

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
      const currentratio: any = {
        name: this.dataColumns[0],
      };
      actualColumns.forEach((d: any) => {
        currentratio[d.value] = this.actuals[d.index].currentratio || 0;
      });
      projectionColumn.forEach((d: any) => {
     	currentratio[d.value] = this.projections[d.index].currentratio || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          currentratio[a.value] = this.actuals[a.index].currentratio || 0.0;
        } else {
          currentratio[a.value] = this.projections[a.index].currentratio || 0.0;
        }
      });
      this.data.push(currentratio);
      const quickratio: any = {
        name: this.dataColumns[1],
      };
      actualColumns.forEach((d: any) => {
        quickratio[d.value] = this.actuals[d.index].quickratio || 0;
      });
      projectionColumn.forEach((d: any) => {
        quickratio[d.value] = this.projections[d.index].quickratio || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          quickratio[a.value] = this.actuals[a.index].quickratio || 0.0;
        } else {
          quickratio[a.value] = this.projections[a.index].quickratio || 0.0;
        }
      });
      this.data.push(quickratio);
      const cashratio: any = {
        name: this.dataColumns[2],
      };
      actualColumns.forEach((d: any) => {
        cashratio[d.value] = this.actuals[d.index].cashratio || 0;
      });
      projectionColumn.forEach((d: any) => {
        cashratio[d.value] = this.projections[d.index].cashratio || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          cashratio[a.value] = this.actuals[a.index].cashratio || 0.0;
        } else {
          cashratio[a.value] = this.projections[a.index].cashratio || 0.0;
        }
      });
      this.data.push(cashratio);
      this.columnFields.push(
        ...actualColumns.map((a) => a.value),
        ...projectionColumn.map((a) => a.value),
        ...averages.map((a) => a.value)
      );
      // console.log('Loaded!', this.loading, this.actuals, this.projections);
      this.excelService.liquidityRatiosData = this.data;
      console.log("LIQUIDTY RATIOS", this.excelService.liquidityRatiosData)

    }
  }
  isAverage(name) {
    return this.averageColumns.indexOf(name) > -1;
  }
}
