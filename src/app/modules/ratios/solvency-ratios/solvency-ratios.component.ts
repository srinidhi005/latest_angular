import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ExcelService } from 'src/app/shared/excel.service';
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
      // solvency ratio
      const solvencyratio: any = {
        name: this.dataColumns[0],
      };
      actualColumns.forEach((d: any) => {
        solvencyratio[d.value] = this.actuals[d.index].solvencyratio || 0;
      });
      projectionColumn.forEach((d: any) => {
        solvencyratio[d.value] = this.projections[d.index].solvencyratio || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          solvencyratio[a.value] = this.actuals[a.index].solvencyratio || 0;
        } else {
          solvencyratio[a.value] = this.projections[a.index].solvencyratio || 0;
        }
      });
      this.data.push(solvencyratio);
      // debtequity
      const debtequity: any = {
        name: this.dataColumns[1],
      };
      actualColumns.forEach((d: any) => {
        debtequity[d.value] = this.actuals[d.index].debtequity || 0;
      });
      projectionColumn.forEach((d: any) => {
        debtequity[d.value] = this.projections[d.index].debtequity || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          debtequity[a.value] = this.actuals[a.index].debtequity || 0;
        } else {
          debtequity[a.value] = this.projections[a.index].debtequity || 0;
        }
      });
      this.data.push(debtequity);
      // debtassets
      const debtassets: any = {
        name: this.dataColumns[2],
      };
      actualColumns.forEach((d: any) => {
        debtassets[d.value] = this.actuals[d.index].debtassets || 0;
      });
      projectionColumn.forEach((d: any) => {
        debtassets[d.value] = this.projections[d.index].debtassets || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          debtassets[a.value] = this.actuals[a.index].debtassets || 0;
        } else {
          debtassets[a.value] = this.projections[a.index].debtassets || 0;
        }
      });
      this.data.push(debtassets);
      // equity assets
      const equityassets: any = {
        name: this.dataColumns[3],
      };
      actualColumns.forEach((d: any) => {
        equityassets[d.value] = this.actuals[d.index].equityassets || 0;
      });
      projectionColumn.forEach((d: any) => {
        equityassets[d.value] = this.projections[d.index].equityassets || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          equityassets[a.value] = this.actuals[a.index].equityassets || 0;
        } else {
          equityassets[a.value] = this.projections[a.index].equityassets || 0;
        }
      });
      this.data.push(equityassets);
      // net detebitda
      const netdebtebitda: any = {
        name: this.dataColumns[4],
      };
      actualColumns.forEach((d: any) => {
        netdebtebitda[d.value] = this.actuals[d.index].netdebtebitda || 0;
      });
      projectionColumn.forEach((d: any) => {
        netdebtebitda[d.value] = this.projections[d.index].netdebtebitda || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          netdebtebitda[a.value] = this.actuals[a.index].netdebtebitda || 0;
        } else {
          netdebtebitda[a.value] = this.projections[a.index].netdebtebitda || 0;
        }
      });
      this.data.push(netdebtebitda);
      // total debt ebitda
      const totaldebtebitda: any = {
        name: this.dataColumns[5],
      };
      actualColumns.forEach((d: any) => {
        totaldebtebitda[d.value] = this.actuals[d.index].totaldebtebitda || 0;
      });
      projectionColumn.forEach((d: any) => {
        totaldebtebitda[d.value] =
          this.projections[d.index].totaldebtebitda || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          totaldebtebitda[a.value] = this.actuals[a.index].totaldebtebitda || 0;
        } else {
          totaldebtebitda[a.value] =
            this.projections[a.index].totaldebtebitda || 0;
        }
      });
      this.data.push(totaldebtebitda);
      // interest coverage ration
      const interestcoverageratio: any = {
        name: this.dataColumns[6],
      };
      actualColumns.forEach((d: any) => {
        interestcoverageratio[d.value] =
          this.actuals[d.index].interestcoverageratio || 0;
      });
      projectionColumn.forEach((d: any) => {
        interestcoverageratio[d.value] =
          this.projections[d.index].interestcoverageratio || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          interestcoverageratio[a.value] =
            this.actuals[a.index].interestcoverageratio || 0;
        } else {
          interestcoverageratio[a.value] =
            this.projections[a.index].interestcoverageratio || 0;
        }
      });
      this.data.push(interestcoverageratio);
      // debt coverage ratio
      const debtcoverageratio: any = {
        name: this.dataColumns[7],
      };
      actualColumns.forEach((d: any) => {
        debtcoverageratio[d.value] =
          this.actuals[d.index].debtcoverageratio || 0;
      });
      projectionColumn.forEach((d: any) => {
        debtcoverageratio[d.value] =
          this.projections[d.index].debtcoverageratio || 0;
      });
      averages.forEach((a) => {
        if (a.isActual) {
          debtcoverageratio[a.value] =
            this.actuals[a.index].debtcoverageratio || 0;
        } else {
          debtcoverageratio[a.value] =
            this.projections[a.index].debtcoverageratio || 0;
        }
      });
      this.data.push(debtcoverageratio);

      this.columnFields.push(
        ...actualColumns.map((a) => a.value),
        ...projectionColumn.map((a) => a.value),
        ...averages.map((a) => a.value)
      );
      // console.log('Loaded!', this.loading, this.actuals, this.projections);
      this.excelService.solvencyRatiosData = this.data;
      console.log("SOLVENCY RATIOS", this.excelService.solvencyRatiosData)
    }
  }
  isAverage(name) {
    return this.averageColumns.indexOf(name) > -1;
  }
}
