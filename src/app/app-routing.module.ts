import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { StatementComponent } from './modules/statement/statement.component';
import {AddCompanyComponent} from './modules/add-company/add-company.component';
import { VisualsISComponent } from './modules/visuals-is/visuals-is.component';
import { PLMetricsComponent } from './modules/plmetrics/plmetrics.component';
import { VisualsBsComponent } from './modules/visuals-bs/visuals-bs.component';
import { BsmetricsComponent } from './modules/bsmetrics/bsmetrics.component';
import { KpiIsComponent } from './modules/kpi-is/kpi-is.component';
import { KpiBsComponent } from './modules/kpi-bs/kpi-bs.component';
import { LoginComponent } from './modules/login/login.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
      path: '',
      redirectTo: "/login",
      pathMatch:"full"
    },
    {
      path: 'login',
      component:LoginComponent
    },
  {
    path: '',
    component:DefaultComponent,
  children: [
   {
    path: 'statement',
    component: StatementComponent
  },
  {
    path: 'addcompany',
    component: AddCompanyComponent  
  }, {
    path: 'visualsIS',
    component: VisualsISComponent
  },
  {
    path: 'visualsBS',
    component: VisualsBsComponent
  },
  {
    path:'IncomeStatementMetrics',
    component:PLMetricsComponent
  },
  {
    path:'BalanceSheetMetrics',
    component:BsmetricsComponent
  },
  {
    path:'KPIIncomeStatement',
    component:KpiIsComponent
  },
  {
    path:'KPIBalanceSheet',
    component:KpiBsComponent
  }
]
  

}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }




