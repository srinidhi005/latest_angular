import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { DefaultComponent } from './default.component';

import { RouterModule } from '@angular/router';
import { StatementComponent, DialogElementsExampleDialog } from 'src/app/modules/statement/statement.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSidenavModule, MatDividerModule, MatCardModule, MatPaginatorModule, MatTableModule, MatInputModule, MatSelectModule, MatOptionModule, MatIconModule, MatButtonModule, MatGridListModule, MatProgressSpinnerModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSliderModule} from '@angular/material/slider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import { uploadSnackBarStatementComponent, uploadFailureSnackBarStatementComponent } from 'src/app/modules/add-company/add-company.component';
import { VisualsISComponent, uploadSnackBarISComponent, uploadFailureSnackBarISComponent, uploadSnackBarISAddComponent, uploadFailureSnackBarISAddComponent } from 'src/app/modules/visuals-is/visuals-is.component';
import { HighchartsChartModule } from 'highcharts-angular';
import {MatMenuModule} from '@angular/material/menu';
import { PLMetricsComponent } from 'src/app/modules/plmetrics/plmetrics.component';
import {VisualsBsComponent, uploadSnackBarBSComponent, uploadFailureSnackBarBSComponent, uploadSnackBarBSAddComponent, uploadFailureSnackBarBSAddComponent} from 'src/app/modules/visuals-bs/visuals-bs.component';
import { BsmetricsComponent } from 'src/app/modules/bsmetrics/bsmetrics.component';
import { KpiIsComponent } from 'src/app/modules/kpi-is/kpi-is.component';
import { KpiBsComponent } from 'src/app/modules/kpi-bs/kpi-bs.component';
import { UserDetailsComponent } from 'src/app/modules/user-details/user-details.component';

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
    UserDetailsComponent
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

  ],
  exports:[MatDialogModule,MatExpansionModule],
  entryComponents: [StatementComponent,VisualsISComponent,
     DialogElementsExampleDialog,
     uploadSnackBarISComponent,
     uploadFailureSnackBarISComponent,
     uploadSnackBarISAddComponent,
     uploadFailureSnackBarISAddComponent,
     uploadSnackBarBSComponent,
     uploadFailureSnackBarBSComponent,
     uploadSnackBarBSAddComponent,
    uploadFailureSnackBarBSAddComponent,
    uploadFailureSnackBarStatementComponent,
    uploadSnackBarStatementComponent],
  providers: [
        RMIAPIsService,
  ],
})
export class DefaultModule { }
