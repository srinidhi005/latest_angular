import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
} from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { DefaultModule } from './layouts/default/default.module';
import { AddCompanyComponent } from './modules/add-company/add-company.component';
import { FileUploadComponent } from './modules/file-upload/file-upload.component';
import { LoginComponent } from './modules/login/login.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { RMIAPIsService } from './shared/rmiapis.service';
import { UrlConfigService } from './shared/url-config.service';


@NgModule({
  declarations: [
    AppComponent,
    AddCompanyComponent,
    FileUploadComponent,
    LoginComponent,
    AuthLoginComponent,
    ProfileComponent,
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
    MatGridListModule,
    MatExpansionModule,
  ],
  providers: [UrlConfigService, RMIAPIsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
