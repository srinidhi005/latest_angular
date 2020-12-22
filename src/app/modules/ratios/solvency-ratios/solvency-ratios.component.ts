import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
interface TableItem {
  name: string;
  [key: string]: string;
}
@Component({
  selector: 'app-solvency-ratios',
  templateUrl: './solvency-ratios.component.html',
  styleUrls: ['./solvency-ratios.component.scss'],
})
export class SolvencyRatiosComponent implements OnInit, OnChanges {
  @Input() loading: boolean;
  @Input() actuals: any[];
  @Input() projections: any[];

  dataColumns = [
    'Solvency Ratio (Net Income + D&A / Total Liabilities)',
    'Debt-to-Equity (Total Debt / Total Equity)',
    'Debt-to-Assets (Total Debt / Total Assets)',
    'Equity-to-Assets (Total Equity / Total Assets)',
    'Net Debt-to-EBITDA (Net Debt / EBITDA)',
    'Total Debt-to-EBITDA (Total Debt / EBITDA)',
    'Interest Coverage Ratio (EBIT / Interest Expense)',
    'Debt Service Coverage Ratio (NOI / Total Debt Service)',
  ];
  columnFields = ['name'];
  data = [];

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
      // solvency ratio
      const solvencyratio: any = {
        name: this.dataColumns[0],
      };
      actualColumns.forEach((d: any) => {
        solvencyratio[d.value] = this.actuals[d.index].solvencyratio;
      });
      projectionColumn.forEach((d: any) => {
        solvencyratio[d.value] = this.projections[d.index].solvencyratio;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          solvencyratio[a.value] = (
            this.actuals[a.index].solvencyratio || 0
          ).toFixed(2);
        } else {
          solvencyratio[a.value] = (
            this.projections[a.index].solvencyratio || 0
          ).toFixed(2);
        }
      });
      this.data.push(solvencyratio);
      // debtequity
      const debtequity: any = {
        name: this.dataColumns[1],
      };
      actualColumns.forEach((d: any) => {
        debtequity[d.value] = this.actuals[d.index].debtequity;
      });
      projectionColumn.forEach((d: any) => {
        debtequity[d.value] = this.projections[d.index].debtequity;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          debtequity[a.value] = (this.actuals[a.index].debtequity || 0).toFixed(
            2
          );
        } else {
          debtequity[a.value] = (
            this.projections[a.index].debtequity || 0
          ).toFixed(2);
        }
      });
      this.data.push(debtequity);
      // debtassets
      const debtassets: any = {
        name: this.dataColumns[2],
      };
      actualColumns.forEach((d: any) => {
        debtassets[d.value] = this.actuals[d.index].debtassets;
      });
      projectionColumn.forEach((d: any) => {
        debtassets[d.value] = this.projections[d.index].debtassets;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          debtassets[a.value] = (this.actuals[a.index].debtassets || 0).toFixed(
            2
          );
        } else {
          debtassets[a.value] = (
            this.projections[a.index].debtassets || 0
          ).toFixed(2);
        }
      });
      this.data.push(debtassets);
      // equity assets
      const equityassets: any = {
        name: this.dataColumns[3],
      };
      actualColumns.forEach((d: any) => {
        equityassets[d.value] = this.actuals[d.index].equityassets;
      });
      projectionColumn.forEach((d: any) => {
        equityassets[d.value] = this.projections[d.index].equityassets;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          equityassets[a.value] = (
            this.actuals[a.index].equityassets || 0
          ).toFixed(2);
        } else {
          equityassets[a.value] = (
            this.projections[a.index].equityassets || 0
          ).toFixed(2);
        }
      });
      this.data.push(equityassets);
      // net detebitda
      const netdebtebitda: any = {
        name: this.dataColumns[4],
      };
      actualColumns.forEach((d: any) => {
        netdebtebitda[d.value] = this.actuals[d.index].netdebtebitda;
      });
      projectionColumn.forEach((d: any) => {
        netdebtebitda[d.value] = this.projections[d.index].netdebtebitda;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          netdebtebitda[a.value] = (
            this.actuals[a.index].netdebtebitda || 0
          ).toFixed(2);
        } else {
          netdebtebitda[a.value] = (
            this.projections[a.index].netdebtebitda || 0
          ).toFixed(2);
        }
      });
      this.data.push(netdebtebitda);
      // total debt ebitda
      const totaldebtebitda: any = {
        name: this.dataColumns[5],
      };
      actualColumns.forEach((d: any) => {
        totaldebtebitda[d.value] = this.actuals[d.index].totaldebtebitda;
      });
      projectionColumn.forEach((d: any) => {
        totaldebtebitda[d.value] = this.projections[d.index].totaldebtebitda;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          totaldebtebitda[a.value] = (
            this.actuals[a.index].totaldebtebitda || 0
          ).toFixed(2);
        } else {
          totaldebtebitda[a.value] = (
            this.projections[a.index].totaldebtebitda || 0
          ).toFixed(2);
        }
      });
      this.data.push(totaldebtebitda);
      // interest coverage ration
      const interestcoverageratio: any = {
        name: this.dataColumns[6],
      };
      actualColumns.forEach((d: any) => {
        interestcoverageratio[d.value] = this.actuals[
          d.index
        ].interestcoverageratio;
      });
      projectionColumn.forEach((d: any) => {
        interestcoverageratio[d.value] = this.projections[
          d.index
        ].interestcoverageratio;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          interestcoverageratio[a.value] = (
            this.actuals[a.index].interestcoverageratio || 0
          ).toFixed(2);
        } else {
          interestcoverageratio[a.value] = (
            this.projections[a.index].interestcoverageratio || 0
          ).toFixed(2);
        }
      });
      this.data.push(interestcoverageratio);
      // debt coverage ratio
      const debtcoverageratio: any = {
        name: this.dataColumns[7],
      };
      actualColumns.forEach((d: any) => {
        debtcoverageratio[d.value] = this.actuals[d.index].debtcoverageratio;
      });
      projectionColumn.forEach((d: any) => {
        debtcoverageratio[d.value] = this.projections[
          d.index
        ].debtcoverageratio;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          debtcoverageratio[a.value] = (
            this.actuals[a.index].debtcoverageratio || 0
          ).toFixed(2);
        } else {
          debtcoverageratio[a.value] = (
            this.projections[a.index].debtcoverageratio || 0
          ).toFixed(2);
        }
      });
      this.data.push(debtcoverageratio);

      this.columnFields.push(
        ...actualColumns.map((a) => a.value),
        ...projectionColumn.map((a) => a.value),
        ...averages.map((a) => a.value)
      );
      console.log('Loaded!', this.loading, this.actuals, this.projections);
    }
  }
}
