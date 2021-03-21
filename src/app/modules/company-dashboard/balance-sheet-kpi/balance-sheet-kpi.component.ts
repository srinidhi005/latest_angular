import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { PeriodicElement } from '../../kpi-is/kpi-is.component';

@Component({
  selector: 'app-balance-sheet-kpi',
  templateUrl: './balance-sheet-kpi.component.html',
  styleUrls: ['./balance-sheet-kpi.component.scss'],
})
export class BalanceSheetKpiComponent implements OnInit, OnDestroy {
  @Input() companyName: string;
  @Input() scenario: string | number;
  loadingHistory = true;
  loadingProjection = true;
  displayedColumns: string[] = [
    'position',
    'name',
    'fromyear',
    'toyear',
    'KPIValue',
  ];
  dataValuesActuals: any;
  dataValuesProjections: any;
  dataColumns: string[] = [
    'Avg. Days Sales Outstanding (DSO)',
    'Avg. Inventory Days',
    'Avg. Other Current Assets as % of Revenue',
    'Avg. Days Payable Outstanding (DPO)',
    'Avg. Accrued Liabilities as % of COGS',
    'Avg. Other Current Liabilties as % of COGS',
  ];
  percentageValues = [
    this.dataColumns[2],
    this.dataColumns[4],
    this.dataColumns[5],
  ];
  ELEMENT_KPI_ACTUALS: PeriodicElement[] = [];
  dataSourceActuals = new MatTableDataSource<PeriodicElement>(
    this.ELEMENT_KPI_ACTUALS
  );
  ELEMENT_KPI_PROJECTIONS: PeriodicElement[] = [];
  dataSourceProjections = new MatTableDataSource<PeriodicElement>(
    this.ELEMENT_KPI_PROJECTIONS
  );
  ActualDataSubscription: Subscription;
  constructor(
    private urlConfig: UrlConfigService,
    private apiService: RMIAPIsService
  ) {}

  ngOnInit() {
    this.getActualData();
    this.getProjectData();
  }
  /**
   * Get Actual data for KPI
   */
  getActualData = (): void => {
    this.loadingHistory = true;
    this.ActualDataSubscription = this.apiService
      .getData(`${this.urlConfig.getBsKPIActuals()}${this.companyName}`)
      .subscribe((res: any) => {
        this.dataValuesActuals = [
          res[0].dso,
          res[0].inventorydays,
          res[0].othercurrentassetspercent,
          res[0].dpo,
          res[0].accruedliabilitiespercent,
          res[0].othercurrentliabilitiespercent,
        ];

        for (let index = 0; index <= this.dataColumns.length - 1; index++) {
          this.ELEMENT_KPI_ACTUALS.push({
            position: index + 1,
            name: this.dataColumns[index],
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
   * Get projected data
   */
  getProjectData = () => {
    this.loadingProjection = true;
    this.apiService
      .getData(
        this.urlConfig.getBsKPIProjections() +
          this.companyName +
          '&scenario=' +
          this.scenario
      )
      .subscribe((res: any) => {
        this.dataValuesProjections = [
          res[0].dso,
          res[0].inventorydays,
          res[0].othercurrentassetspercent,
          res[0].dpo,
          res[0].accruedliabilitiespercent,
          res[0].othercurrentliabilitiespercent,
        ];
        for (let index = 0; index <= this.dataColumns.length - 1; index++) {
          this.ELEMENT_KPI_PROJECTIONS.push({
            position: index + 1,
            name: this.dataColumns[index],
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
    if (this.ActualDataSubscription) {
      this.ActualDataSubscription.unsubscribe();
    }
  }
}
