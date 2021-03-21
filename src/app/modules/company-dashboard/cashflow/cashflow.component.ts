import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { PeriodicElement } from '../../kpi-is/kpi-is.component';

@Component({
  selector: 'app-cashflow',
  templateUrl: './cashflow.component.html',
  styleUrls: ['./cashflow.component.scss'],
})
export class CashflowKPIComponent implements OnInit, OnDestroy {
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
    'Avg. Capex as % of Revenue',
    'Avg. Asset Sales as % of Revenue',
    'Avg. Other Investing Activites as % of Revenue',
    'Avg. Dividends Paid as % of Net Income',
    'Avg. FFO as % of Revenue',
  ];
  ELEMENT_KPI_ACTUALS: PeriodicElement[] = [];
  dataSourceActuals = new MatTableDataSource<PeriodicElement>(
    this.ELEMENT_KPI_ACTUALS
  );
  dataValuesProjections: any;
  dataColumnsProjections: string[] = [
    'Avg. Capex as % of Revenue',
    'Avg. Asset Sales as % of Revenue',
    'Avg. Other Investing Activites as % of Revenue',
    'Avg. Dividends Paid as % of Net Income',
    'Avg. FFO as % of Revenue',
	'Avg. CFO as % of Revenue',
	'Avg. CFO as % of EBITDA',
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
      .getData(`${this.urlConfig.getKPICashActuals()}${this.companyName}`)
      .subscribe((res: any) => {
        this.dataValuesActuals = [
          res[0].capexpercentrevenue,
          res[0].assetsalespercentrevenue,
          res[0].investingpercentrevenue,
          res[0].dividendspaidpercentincome,
          res[0].ffopercentrevenue,
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
            KPIValue: this.dataValuesActuals[index].toFixed(1),
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
        this.urlConfig.getKPICashProjections() +
          this.companyName +
          '&scenario=' +
          this.scenario
      )
      .subscribe((res: any) => {
        this.dataValuesProjections = [
              res[0].capexpercentrevenue,
              res[0].assetsalespercentrevenue,
              res[0].investingpercentrevenue,
              res[0].dividendspaidpercentincome,
              res[0].ffopercentrevenue,
			  res[0].cfopercentrevenue,
			  res[0].cfopercentebitda
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