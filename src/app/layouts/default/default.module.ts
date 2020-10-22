import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { StatementComponent, DialogElementsExampleDialog } from 'src/app/modules/statement/statement.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSidenavModule, MatDividerModule, MatCardModule, MatPaginatorModule, MatTableModule,MatGridListModule, MatInputModule, MatSelectModule, MatOptionModule, MatIconModule, MatButtonModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardService } from 'src/app/modules/dashboard.service';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSliderModule} from '@angular/material/slider';
import {MatExpansionModule} from '@angular/material/expansion';
import { uploadSnackBarComponent, uploadFailureSnackBarComponent } from 'src/app/modules/add-company/add-company.component';
import { VisualsISComponent } from 'src/app/modules/visuals-is/visuals-is.component';
import { HighchartsChartModule } from 'highcharts-angular';
import {MatMenuModule} from '@angular/material/menu';
import { PLMetricsComponent } from 'src/app/modules/plmetrics/plmetrics.component';
import {VisualsBsComponent} from 'src/app/modules/visuals-bs/visuals-bs.component';
import { BsmetricsComponent } from 'src/app/modules/bsmetrics/bsmetrics.component';
import { KpiIsComponent } from 'src/app/modules/kpi-is/kpi-is.component';
import { KpiBsComponent } from 'src/app/modules/kpi-bs/kpi-bs.component';
@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    StatementComponent,
    DialogElementsExampleDialog,
    uploadSnackBarComponent,
    uploadFailureSnackBarComponent,
    VisualsISComponent,
    PLMetricsComponent,
    BsmetricsComponent,
    VisualsBsComponent,
    KpiIsComponent,
    KpiBsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    FlexLayoutModule,
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
    MatExpansionModule,
    MatGridListModule,
    HighchartsChartModule,
    MatMenuModule
  ],
  exports:[MatDialogModule,MatExpansionModule],
  entryComponents: [StatementComponent,
     DialogElementsExampleDialog,
    uploadFailureSnackBarComponent,
    uploadSnackBarComponent],
  providers: [
    DashboardService,
    RMIAPIsService,
  ],
})
export class DefaultModule { }
