import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';

import { StatementComponent } from './modules/statement/statement.component';
import {AddCompanyComponent} from './modules/add-company/add-company.component';
import { VisualsISComponent } from './modules/visuals-is/visuals-is.component';
import { PLMetricsComponent } from './modules/plmetrics/plmetrics.component';
import { VisualsBsComponent } from './modules/visuals-bs/visuals-bs.component';
import { BsmetricsComponent } from './modules/bsmetrics/bsmetrics.component';
import { KpiIsComponent } from './modules/kpi-is/kpi-is.component';
import { KpiBsComponent } from './modules/kpi-bs/kpi-bs.component';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { AppComponent } from './app.component';
import {AuthGuard} from './auth.guard';
import { ProfileComponent } from './modules/profile/profile.component';
import { UserDetailsComponent } from './modules/user-details/user-details.component';

const routes: Routes = [
  {
      path: '',
      redirectTo: "/login",
      pathMatch:"full"
    },
    {
      path: 'login',
      component:AuthLoginComponent
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
  },
  {
    path:'profile',
    component:ProfileComponent
  },
{
  path:'user',
  component:UserDetailsComponent
}
]
}];
  

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }




