import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { PeriodicElement } from '../../kpi-is/kpi-is.component';

@Component({
  selector: 'app-income-statement-kpi',
  templateUrl: './income-statement-kpi.component.html',
  styleUrls: ['./income-statement-kpi.component.scss'],
})
export class IncomeStatementKpiComponent implements OnInit, OnDestroy {
  @Input() companyName: string;
  @Input() scenario: string | number;
  loadingHistory = true;
  loadingProjection = true;
  dataValuesActuals;
  displayedColumns: string[] = [
    'position',
    'name',
    'fromyear',
    'toyear',
    'KPIValue',
  ];
  dataColumnsActuals: string[] = [
    'Revenue CAGR',
    'COGS CAGR',
    'Gross Profit CAGR',
    'EBITDA CAGR',
    'Avg. Gross Margin',
    'Avg. SG&A as % of Revenue',
    'Avg. EBIT Margin',
    'Avg. D&A as % of Revenue',
    'Avg. EBITDA Margin',
    'Avg. EBT Margin',
    'Avg. Net Income Margin',
  ];
  ELEMENT_KPI_ACTUALS: PeriodicElement[] = [];
  dataSourceActuals = new MatTableDataSource<PeriodicElement>(
    this.ELEMENT_KPI_ACTUALS
  );
  dataValuesProjections: any;
  dataColumnsProjections: string[] = [
    'Revenue CAGR',
    'COGS CAGR',
    'Gross Profit CAGR',
    'EBITDA CAGR',
    'Avg. Gross Margin',
    'Avg. SG&A as % of Revenue',
    'Avg. EBIT Margin',
    'Avg. D&A as % of Revenue',
    'Avg. EBITDA Margin',
    'Avg. EBT Margin',
    'Avg. Net Income Margin',
  ];
  ELEMENT_KPI_PROJECTIONS: PeriodicElement[] = [];
  dataSourceProjections = new MatTableDataSource<PeriodicElement>(
    this.ELEMENT_KPI_PROJECTIONS
  );
  HistorySubscription: Subscription;
  ProjectionSubscription: Subscription;
  constructor(
    private apiService: RMIAPIsService,
    private urlConfig: UrlConfigService
  ) {}

  ngOnInit() {
    console.log(this.companyName, this.scenario);
    this.getHistoryRecords();
    this.getProjections();
  }
  /**
   * Get Actual records
   */
  getHistoryRecords = (): void => {
    this.loadingHistory = true;
    this.HistorySubscription = this.apiService
      .getData(`${this.urlConfig.getIsKPIActuals()}${this.companyName}`)
      .subscribe((res: any) => {
        this.dataValuesActuals = [
          res[0].revenuecagr,
          res[0].cogscagr,
          res[0].grossprofitcagr,
          res[0].ebitdacagr,
          res[0].avggrossmargin,
          res[0].avgsgaasrevenue,
          res[0].avgebitmargin,
          res[0].avgdnaasrevenue,
          res[0].avgebitdamargin,
          res[0].avgebtmargin,
          res[0].avgnetincomemargin,
        ];
        for (
          let index = 0;
          index <= this.dataColumnsActuals.length - 1;
          index++
        ) {
          this.ELEMENT_KPI_ACTUALS.push({
            position: index + 1,
            name: this.dataColumnsActuals[index],
            fromyear: res[0].fromyear,
            toyear: res[0].toyear,
            KPIValue: this.dataValuesActuals[index],
          });
        }
        this.dataSourceActuals._updateChangeSubscription();
        this.loadingHistory = false;
      });
  };
  /**
   * get projection data
   */
  getProjections = () => {
    this.loadingProjection = true;
    this.ProjectionSubscription = this.apiService
      .getData(
        this.urlConfig.getIsKPIProjections() +
          this.companyName +
          '&scenario=' +
          this.scenario
      )
      .subscribe((res: any) => {
        this.dataValuesProjections = [
          res[0].revenuecagr,
          res[0].cogscagr,
          res[0].grossprofitcagr,
          res[0].ebitdacagr,
          res[0].avggrossmargin,
          res[0].avgsgaasrevenue,
          res[0].avgebitmargin,
          res[0].avgdnaasrevenue,
          res[0].avgebitdamargin,
          res[0].avgebtmargin,
          res[0].avgnetincomemargin,
        ];
        for (
          let index = 0;
          index <= this.dataColumnsProjections.length - 1;
          index++
        ) {
          this.ELEMENT_KPI_PROJECTIONS.push({
            position: index + 1,
            name: this.dataColumnsProjections[index],
            fromyear: res[0].fromyear,
            toyear: res[0].toyear,
            KPIValue: this.dataValuesProjections[index],
          });
        }
        this.dataSourceProjections._updateChangeSubscription();
        this.loadingProjection = false;
      });
  };
  ngOnDestroy() {
    if (this.HistorySubscription) {
      this.HistorySubscription.unsubscribe();
    }
    if (this.ProjectionSubscription) {
      this.ProjectionSubscription.unsubscribe();
    }
  }
}
