import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DefaultModule } from './layouts/default/default.module';
import { HttpClientModule } from '@angular/common/http';
import { UrlConfigService } from './shared/url-config.service';
import { RMIAPIsService } from './shared/rmiapis.service';
import { AddCompanyComponent } from './modules/add-company/add-company.component';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatIconModule } from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from './modules/file-upload/file-upload.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [
    AppComponent,
    AddCompanyComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DefaultModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatExpansionModule,
  ],
  providers: [
    UrlConfigService,
    RMIAPIsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
