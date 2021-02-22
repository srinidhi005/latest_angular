import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ExcelService } from 'src/app/shared/excel.service';
interface TableItem {
  name: string;
  [key: string]: string;
}
@Component({
  selector: 'app-profitability-ratios',
  templateUrl: './profitability-ratios.component.html',
  styleUrls: ['./profitability-ratios.component.scss'],
})
export class ProfitabilityRatiosComponent implements OnInit, OnChanges {
  @Input() loading: boolean;
  @Input() actuals: any[];
  @Input() projections: any[];

  dataColumns = [
    'Gross Margin: Gross Profit / Revenue',
    'EBITDA Margin: EBITDA / Revenue',
    'Operating Profit Margin: EBIT / Revenue',
    'Pre-Tax Margin: EBT / Revenue',
    'Net Income Margin: Net Income / Revenue',
  ];
  columnFields = ['name'];
  data = [];
  actualSpan = 0;
  projectionSpan = 0;

  averageColumns = [];
  constructor(private excelService: ExcelService) {}

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
      const grossmargin: any = {
        name: this.dataColumns[0],
      };
      actualColumns.forEach((d: any) => {
        grossmargin[d.value] = (this.actuals[d.index] || {}).grossmargin || 0;
      });
      projectionColumn.forEach((d: any) => {
        grossmargin[d.value] =
          (this.projections[d.index] || {}).grossmargin || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          grossmargin[a.value] =
            (this.actuals[a.index] || {}).grossmargin || 0.0;
        } else {
          grossmargin[a.value] =
            (this.projections[a.index] || {}).grossmargin || 0.0;
        }
      });
      this.data.push(grossmargin);
      const ebitdamargin: any = {
        name: this.dataColumns[1],
      };
      actualColumns.forEach((d: any) => {
        ebitdamargin[d.value] = (this.actuals[d.index] || {}).ebitdamargin || 0;
      });
      projectionColumn.forEach((d: any) => {
        ebitdamargin[d.value] =
          (this.projections[d.index] || {}).ebitdamargin || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          ebitdamargin[a.value] =
            (this.actuals[a.index] || {}).ebitdamargin || 0.0;
        } else {
          ebitdamargin[a.value] =
            (this.projections[a.index] || {}).ebitdamargin || 0.0;
        }
      });
      this.data.push(ebitdamargin);
      const operatingprofitmargin: any = {
        name: this.dataColumns[2],
      };
      actualColumns.forEach((d: any) => {
        operatingprofitmargin[d.value] =
          (this.actuals[d.index] || {}).operatingprofitmargin || 0;
      });
      projectionColumn.forEach((d: any) => {
        operatingprofitmargin[d.value] =
          (this.projections[d.index] || {}).operatingprofitmargin || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          operatingprofitmargin[a.value] =
            (this.actuals[a.index] || {}).operatingprofitmargin || 0.0;
        } else {
          operatingprofitmargin[a.value] =
            (this.projections[a.index] || {}).operatingprofitmargin || 0.0;
        }
      });
      this.data.push(operatingprofitmargin);
      const pretaxmargin: any = {
        name: this.dataColumns[3],
      };
      actualColumns.forEach((d: any) => {
        pretaxmargin[d.value] = (this.actuals[d.index] || {}).pretaxmargin || 0;
      });
      projectionColumn.forEach((d: any) => {
        pretaxmargin[d.value] =
          (this.projections[d.index] || {}).pretaxmargin || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          pretaxmargin[a.value] =
            (this.actuals[a.index] || {}).pretaxmargin || 0.0;
        } else {
          pretaxmargin[a.value] =
            (this.projections[a.index] || {}).pretaxmargin || 0.0;
        }
      });
      this.data.push(pretaxmargin);
      const netincomemargin: any = {
        name: this.dataColumns[4],
      };
      actualColumns.forEach((d: any) => {
        netincomemargin[d.value] =
          (this.actuals[d.index] || {}).netincomemargin || 0;
      });
      projectionColumn.forEach((d: any) => {
        netincomemargin[d.value] =
          (this.projections[d.index] || {}).netincomemargin || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          netincomemargin[a.value] =
            (this.actuals[a.index] || {}).netincomemargin || 0.0;
        } else {
          netincomemargin[a.value] =
            (this.projections[a.index] || {}).netincomemargin || 0.0;
        }
      });
      this.data.push(netincomemargin);
      this.columnFields.push(
        ...actualColumns.map((a) => a.value),
        ...projectionColumn.map((a) => a.value),
        ...averages.map((a) => a.value)
      );
      // console.log('Loaded!', this.loading, this.actuals, this.projections);
        this.excelService.profitabilityRatiosData = this.data;
        console.log("PROFITABILITY RATIOS", this.excelService.profitabilityRatiosData)
    }
  }
  isAverage(name) {
    return this.averageColumns.indexOf(name) > -1;
  }
}
