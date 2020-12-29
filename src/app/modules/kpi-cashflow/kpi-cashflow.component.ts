import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import { UserDetailModelService } from 'src/app/shared/user-detail-model.service';

export interface PeriodicElement {
  position: number;
  name: string;
  fromyear: number;
  toyear: number;
  KPIValue: any;
}


@Component({
  selector: 'app-kpi-cashflow',
  templateUrl: './kpi-cashflow.component.html',
  styleUrls: ['./kpi-cashflow.component.scss']
})
export class KpiCashflowComponent implements OnInit {
	scenario = this.UserDetailModelService.getSelectedScenario();
  companyName = this.UserDetailModelService.getSelectedCompany();
  loadedScenario = 'Scenario 0';
  scenarioArray = [];
  progressBar: boolean;
  dataValuesActuals: any;
  dataValuesProjections: any;
  dataColumnsActuals: string[] = [
    'Avg. Capex as % of Revenue',
    'Avg. Asset Sales as % of Revenue',
    'Avg. Other Investing Activites as % of Revenue',
    'Avg. Dividends Paid as % of Net Income',
    'Avg. FFO as % of Revenue',
  ];
  dataColumnsProjections: string[] = [
    'Avg. Capex as % of Revenue',
    'Avg. Asset Sales as % of Revenue',
    'Avg. Other Investing Activites as % of Revenue',
    'Avg. Dividends Paid as % of Net Income',
    'Avg. FFO as % of Revenue',
    
  ];
  displayedColumns: string[] = [
    'position',
    'name',
    'fromyear',
    'toyear',
    'KPIValue',
  ];
  ELEMENT_KPI_ACTUALS: PeriodicElement[] = [];
  ELEMENT_KPI_PROJECTIONS: PeriodicElement[] = [];
  dataSourceActuals = new MatTableDataSource<PeriodicElement>(
    this.ELEMENT_KPI_ACTUALS
  );
  dataSourceProjections = new MatTableDataSource<PeriodicElement>(
    this.ELEMENT_KPI_PROJECTIONS
  );
  companySelected = localStorage.getItem('companySelected');

  constructor( private urlConfig: UrlConfigService,
    private apiService: RMIAPIsService,
    // tslint:disable-next-line:no-shadowed-variable
    private UserDetailModelService: UserDetailModelService) { }

  
  ngOnInit() {
    this.progressBar = true;
    this.apiService
      .getData(this.urlConfig.getKPICashActuals() + this.companySelected)
      .subscribe((res: any) => {
        this.ELEMENT_KPI_ACTUALS = [];
        this.ELEMENT_KPI_PROJECTIONS = [];
        this.dataSourceActuals = new MatTableDataSource<PeriodicElement>(
          this.ELEMENT_KPI_ACTUALS
        );
        this.dataSourceProjections = new MatTableDataSource<PeriodicElement>(
          this.ELEMENT_KPI_PROJECTIONS
        );
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
          const pushData = {
            position: index + 1,
            name: this.dataColumnsActuals[index],
            fromyear: res[0].fromyear,
            toyear: res[0].toyear,
            KPIValue: this.dataValuesActuals[index],
          };
          this.ELEMENT_KPI_ACTUALS.push(pushData);
          this.dataSourceActuals._updateChangeSubscription();
        }
        this.progressBar = false;
      });
    this.apiService
      .getData(this.urlConfig.getCashScenarioAPI() + this.companySelected)
      .subscribe((res: any) => {
        this.progressBar = true;
        this.scenarioArray = res.scenarios;
        this.UserDetailModelService.setScenarioNumber(this.scenarioArray);
        let scenarioNumber = 0;
        if (res.scenarios.includes(this.scenario)) {
          scenarioNumber = this.scenario;
        }
        this.apiService
          .getData(
            this.urlConfig.getKPICashProjections() +
              this.companySelected +
              '&scenario=' +
              scenarioNumber
          )
          // tslint:disable-next-line:no-shadowed-variable
          .subscribe((res: any) => {
            this.progressBar = true;
            this.dataValuesProjections = [
              res[0].capexpercentrevenue,
              res[0].assetsalespercentrevenue,
              res[0].investingpercentrevenue,
              res[0].dividendspaidpercentincome,
              res[0].ffopercentrevenue,
            ];
            for (
              let index = 0;
              index <= this.dataColumnsProjections.length - 1;
              index++
            ) {
              const pushData = {
                position: index + 1,
                name: this.dataColumnsProjections[index],
                fromyear: res[0].fromyear,
                toyear: res[0].toyear,
                KPIValue: this.dataValuesProjections[index],
              };
              this.ELEMENT_KPI_PROJECTIONS.push(pushData);
              this.dataSourceProjections._updateChangeSubscription();
            }
            this.progressBar = false;
          });
      });
  }
  loadScenario(index: number) {
    this.scenario = index;

    this.loadedScenario = 'Scenario ' + index;

    this.ngOnInit();
  }
}
