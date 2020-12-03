import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss'],
})
export class CompanyDashboardComponent implements OnInit, OnDestroy {
  loading = true;
  companyName;
  scenario;
  activateRouteSubscription: Subscription;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activateRouteSubscription = this.activatedRoute.params.subscribe(
      (params: any) => {
        this.companyName = params.companyName;
        this.scenario = params.scenario;
        this.reloadPage();
      }
    );
  }
  reloadPage = (): void => {
    this.loading = true;
    setTimeout(() => (this.loading = false), 500);
  };
  ngOnDestroy() {
    if (this.activateRouteSubscription) {
      this.activateRouteSubscription.unsubscribe();
    }
  }
}
