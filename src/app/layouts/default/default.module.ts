import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatFormFieldModule,
  MatGridListModule,
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
import {
  DialogElementsExampleDialog,
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

@NgModule({
  declarations: [
    DefaultComponent,
    StatementComponent,
    DialogElementsExampleDialog,
    uploadSnackBarStatementComponent,
    uploadFailureSnackBarStatementComponent,
    uploadSnackBarISComponent,
    uploadFailureSnackBarISComponent,
    uploadSnackBarBSComponent,
    VisualCFInputDialogComponent,
    uploadFailureSnackBarBSComponent,
    uploadSnackBarISAddComponent,
    uploadFailureSnackBarISAddComponent,
    uploadSnackBarBSAddComponent,
    uploadFailureSnackBarBSAddComponent,
    VisualsISComponent,
    PLMetricsComponent,
    BsmetricsComponent,
    VisualsBsComponent,
    KpiIsComponent,
    KpiBsComponent,
	KpiCashflowComponent,
    VisualsCfComponent,
    CashmetricsComponent,
    CompanyMatricsComponent,
    IncomeStatementKpiComponent,
    BalanceSheetKpiComponent,
    CompanyDashboardComponent,
    UserDetailsComponent,
    VisualBSInputDialogComponent,
    uploadFailureSnackBarCFAddComponent,
    uploadFailureSnackBarCFComponent,
    uploadSnackBarCFAddComponent,
    uploadSnackBarCFComponent,
    RatiosComponent,
    ProfitabilityRatiosComponent,
    ReturnRatiosComponent,
    LiquidityRatiosComponent,
    SolvencyRatiosComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    Ng2TelInputModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    FlexLayoutModule,
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
    DialogElementsExampleDialog,
    VisualCFInputDialogComponent,
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
  ],
  providers: [RMIAPIsService],
})
export class DefaultModule {}
