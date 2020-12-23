import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';

@Component({
  selector: 'app-ratios',
  templateUrl: './ratios.component.html',
  styleUrls: ['./ratios.component.scss'],
})
export class RatiosComponent implements OnInit, OnDestroy {
  isLoading = true;
  actuals = [];
  projections = [];
  scenarioArray = [];
  selectedScenario;
  selectedCompanyName = localStorage.getItem('selectedCompanyName');
  RatioScenarionSubscription: Subscription;
  RatioActualsSubscription: Subscription;
  RatiosProjectionSubscription: Subscription;
  constructor(private rmiApiService: RMIAPIsService) {}

  ngOnInit() {
    this.getData();
  }
  getData() {
    const companySelected = localStorage.getItem('companySelected'); // 'nike-2018';
    /* $ */
    this.RatioScenarionSubscription = this.rmiApiService
      .getData(`ratios-scenarios?company=${companySelected}`)
      .subscribe((scenario: any) => {
        this.scenarioArray = scenario.scenarios;
        this.selectedScenario = this.scenarioArray[0] || 0;
        this.getActualAndProjection();
      });
  }
  getActualAndProjection() {
    const companySelected = localStorage.getItem('companySelected'); // 'nike-2018';
    /* $localStorage.getItem('companySelected') */
    this.RatioActualsSubscription = this.rmiApiService
      .getData(`ratios-actuals?company=${companySelected}`)
      .subscribe((data: any[]) => {
        this.RatiosProjectionSubscription = this.rmiApiService
          .getData(
            `ratios-projections?company=${companySelected}&scenario=${this.selectedScenario}`
          )
          .subscribe((projection: any) => {
            this.projections = projection;
            this.actuals = data;
            this.isLoading = false;
          });
      });
  }
  changeScenario(scenario) {
    this.selectedScenario = scenario;
    this.isLoading = true;
    this.getActualAndProjection();
  }
  ngOnDestroy() {
    if (this.RatioActualsSubscription) {
      this.RatioActualsSubscription.unsubscribe();
    }
    if (this.RatiosProjectionSubscription) {
      this.RatiosProjectionSubscription.unsubscribe();
    }
    if (this.RatioScenarionSubscription) {
      this.RatioActualsSubscription.unsubscribe();
    }
  }
}
