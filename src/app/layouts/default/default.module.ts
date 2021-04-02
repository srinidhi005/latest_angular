import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessagePopupComponent } from 'src/app/modules/message-popup/message-popup.component';
import { CompanyDetailsComponent } from 'src/app/modules/company-details/company-details.component';
import { ProfileComponent } from 'src/app/modules/profile/profile.component';
import { TutorialComponent } from 'src/app/modules/tutorial/tutorial.component';
import { LoadingPopupComponent } from 'src/app/modules/loading-popup/loading-popup.component';
import { ReportBuilderComponent } from 'src/app/modules/report-builder/report-builder.component';
import { SortableModule } from 'ngx-bootstrap/sortable';
import {
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatFormFieldModule,
  MatGridListModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatTableModule,
  MatTabsModule,
} from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import { Ng2TelInputModule } from 'ng2-tel-input';
import {
  uploadFailureSnackBarStatementComponent,
  uploadSnackBarStatementComponent,
} from 'src/app/modules/add-company/add-company.component';
import { BsmetricsComponent } from 'src/app/modules/bsmetrics/bsmetrics.component';
import { BalanceSheetKpiComponent } from 'src/app/modules/company-dashboard/balance-sheet-kpi/balance-sheet-kpi.component';
import { CompanyDashboardComponent } from 'src/app/modules/company-dashboard/company-dashboard.component';
import { CompanyMatricsComponent } from 'src/app/modules/company-dashboard/company-matrics/company-matrics.component';
import { IncomeStatementKpiComponent } from 'src/app/modules/company-dashboard/income-statement-kpi/income-statement-kpi.component';
import { KpiBsComponent } from 'src/app/modules/kpi-bs/kpi-bs.component';
import { KpiIsComponent } from 'src/app/modules/kpi-is/kpi-is.component';
import { PLMetricsComponent } from 'src/app/modules/plmetrics/plmetrics.component';
import { KpiCashflowComponent } from 'src/app/modules/kpi-cashflow/kpi-cashflow.component';
import { CashmetricsComponent } from 'src/app/modules/cashmetrics/cashmetrics.component';
import { CreditScorecardComponent } from 'src/app/modules/credit-scorecard/credit-scorecard.component';
import {
  DialogElementsExampleDialog,
  snackBarStatementFailure,
  StatementComponent,
} from 'src/app/modules/statement/statement.component';
import { UserDetailsComponent } from 'src/app/modules/user-details/user-details.component';
import {
  uploadFailureSnackBarBSAddComponent,
  uploadFailureSnackBarBSComponent,
  uploadSnackBarBSAddComponent,
  uploadSnackBarBSComponent,
  VisualsBsComponent,
} from 'src/app/modules/visuals-bs/visuals-bs.component';
import {
  uploadFailureSnackBarDCFAddComponent,
  uploadFailureSnackBarDCFComponent,
  uploadSnackBarDCFAddComponent,
  uploadSnackBarDCFComponent,
 DcfComponent,
} from 'src/app/modules/dcf/dcf.component';
import { VisualBSInputDialogComponent } from 'src/app/modules/visuals-is/input-value-dialog.component';
import { VisualCFInputDialogComponent } from 'src/app/modules/visuals-cf/input-value-dialog.component';
import {
  uploadFailureSnackBarISAddComponent,
  uploadFailureSnackBarISComponent,
  uploadSnackBarISAddComponent,
  uploadSnackBarISComponent,
  VisualsISComponent,
} from 'src/app/modules/visuals-is/visuals-is.component';
import {
  uploadFailureSnackBarCFAddComponent,
  uploadFailureSnackBarCFComponent,
  uploadSnackBarCFAddComponent,
  uploadSnackBarCFComponent,
  VisualsCfComponent,
} from 'src/app/modules/visuals-cf/visuals-cf.component';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DefaultComponent } from './default.component';
import { RatiosComponent } from 'src/app/modules/ratios/ratios.component';
import { ProfitabilityRatiosComponent } from 'src/app/modules/ratios/profitability-ratios/profitability-ratios.component';
import { ReturnRatiosComponent } from 'src/app/modules/ratios/return-ratios/return-ratios.component';
import { LiquidityRatiosComponent } from 'src/app/modules/ratios/liquidity-ratios/liquidity-ratios.component';
import { SolvencyRatiosComponent } from 'src/app/modules/ratios/solvency-ratios/solvency-ratios.component';
import { ParseNumberPipe } from 'src/app/pipes/parse-number.pipe';
import { CashflowKPIComponent } from 'src/app/modules/company-dashboard/cashflow/cashflow.component';
import { ComparatorComponent } from 'src/app/modules/comparator/comparator.component';
import { SubscriptionComponent } from 'src/app/modules/subscription/subscription.component';

@NgModule({
  declarations: [
    DefaultComponent,
    MessagePopupComponent,
    StatementComponent,
    TutorialComponent, 
    DialogElementsExampleDialog,
    snackBarStatementFailure,
    uploadSnackBarStatementComponent,
    uploadFailureSnackBarStatementComponent,
    uploadSnackBarISComponent,
    LoadingPopupComponent,
    ReportBuilderComponent,
    uploadFailureSnackBarISComponent,
    uploadSnackBarBSComponent,
    SubscriptionComponent,
    VisualCFInputDialogComponent,
    uploadFailureSnackBarBSComponent,
    uploadSnackBarISAddComponent,
    uploadFailureSnackBarISAddComponent,
    uploadSnackBarBSAddComponent,
    uploadFailureSnackBarBSAddComponent,
	uploadFailureSnackBarDCFAddComponent,
  uploadFailureSnackBarDCFComponent,
  uploadSnackBarDCFAddComponent,
  uploadSnackBarDCFComponent,
    VisualsISComponent,
    PLMetricsComponent,
    BsmetricsComponent,
    CompanyDetailsComponent,
	ProfileComponent,
    VisualsBsComponent,
    KpiIsComponent,
    KpiBsComponent,
    KpiCashflowComponent,
    VisualsCfComponent,
    CashmetricsComponent,
    CompanyMatricsComponent,
    CreditScorecardComponent,
    IncomeStatementKpiComponent,
    BalanceSheetKpiComponent,
    CompanyDashboardComponent,
    UserDetailsComponent,
    VisualBSInputDialogComponent,
	 DcfComponent,
    uploadFailureSnackBarCFAddComponent,
    uploadFailureSnackBarCFComponent,
    uploadSnackBarCFAddComponent,
    uploadSnackBarCFComponent,
    RatiosComponent,
	ComparatorComponent,
    ProfitabilityRatiosComponent,
    ReturnRatiosComponent,
    LiquidityRatiosComponent,
    SolvencyRatiosComponent,
    ParseNumberPipe,
    CashflowKPIComponent,
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    RouterModule,
    Ng2TelInputModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    MatCheckboxModule,
    FlexLayoutModule,
    SortableModule.forRoot(),
    MatProgressSpinnerModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSliderModule,
    MatTooltipModule,
    MatExpansionModule,
    HighchartsChartModule,
    MatMenuModule,
    MatGridListModule,
    MatTabsModule,
  ],
  exports: [MatDialogModule, MatExpansionModule],
  entryComponents: [
    StatementComponent,
    VisualsISComponent,
    MessagePopupComponent,
    DialogElementsExampleDialog,
    VisualCFInputDialogComponent,
	LoadingPopupComponent,
    uploadSnackBarISComponent,
    uploadFailureSnackBarISComponent,
    uploadSnackBarISAddComponent,
    uploadFailureSnackBarISAddComponent,
    uploadSnackBarBSComponent,
    uploadFailureSnackBarBSComponent,
    uploadSnackBarBSAddComponent,
    uploadFailureSnackBarBSAddComponent,
    uploadFailureSnackBarStatementComponent,
    uploadSnackBarStatementComponent,
    VisualBSInputDialogComponent,
    uploadSnackBarCFComponent,
    uploadFailureSnackBarCFComponent,
    uploadSnackBarCFAddComponent,
    uploadFailureSnackBarCFAddComponent,
	uploadFailureSnackBarDCFAddComponent,
  uploadFailureSnackBarDCFComponent,
  uploadSnackBarDCFAddComponent,
  uploadSnackBarDCFComponent,
  ],
  providers: [RMIAPIsService, ParseNumberPipe],
})
export class DefaultModule {}
