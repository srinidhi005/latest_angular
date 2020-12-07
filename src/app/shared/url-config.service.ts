import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UrlConfigService {
  private statementAPI = `${environment.APIHost}statements?user=`;
  private deleteStatementAPI = `${environment.APIHost}deletestatement?companyname=`;
  private downloadStatementAPI = `${environment.APIHost}download_file?companyname=`;
  private uploadStatementAPI = `${environment.APIHost}upload_file`;
  private isActualsAPI = `${environment.APIHost}actuals?company=`;
  private scenarioAPI = `${environment.APIHost}scenarios?company=`;
  private cashscenarioAPI = `${environment.APIHost}cashflow-scenarios?company=`;
  private isProjectionsAPIGET = `${environment.APIHost}projections?company=`;
  private bsActualsAPI = `${environment.APIHost}balance-actuals?company=`;
  private bsProjectionsAPIGET = `${environment.APIHost}balance-projections?company=`;
  private isKPIActuals = `${environment.APIHost}kpi-pnl-actuals?company=`;
  private isKPIProjections = `${environment.APIHost}kpi-pnl-projections?company=`;
  private bsKPIActuals = `${environment.APIHost}kpi-bs-actuals?company=`;
  private cashActualsAPI = `${environment.APIHost}cashflow-actuals?company=`;
  private cashProjectionsAPI = `${environment.APIHost}cashflow-projections?company=`;
  private bsKPIProjections = `${environment.APIHost}kpi-bs-projections?company=`;
  private userDetailAPI = `${environment.APIHost}updateprofile`;
  private userProfileDetailAPI = `${environment.APIHost}userprofiledetails?userid=`;
  private getTopCompanies = `${environment.APIHost}dashboard`;
  constructor(private http: HttpClient) {}

  getStatementAPI() {
    return this.statementAPI;
  }
  getDeleteStatementAPI() {
    return this.deleteStatementAPI;
  }
  getDownloadStatementAPI() {
    return this.downloadStatementAPI;
  }
  getuploadStatementAPI() {
    return this.uploadStatementAPI;
  }
  getIsActualsAPI() {
    return this.isActualsAPI;
  }
  getIsProjectionsAPIGET() {
    return this.isProjectionsAPIGET;
  }
  getIsProjectionsAPIPOST() {
    return this.isProjectionsAPIGET;
  }
  getScenarioAPI() {
    return this.scenarioAPI;
  }
  getBsActualsAPI() {
    return this.bsActualsAPI;
  }
  getBsProjectionsAPIGET() {
    return this.bsProjectionsAPIGET;
  }
  getBsProjectionsAPIPOST() {
    return this.bsProjectionsAPIGET;
  }
  getIsKPIActuals() {
    return this.isKPIActuals;
  }
  getIsKPIProjections() {
    return this.isKPIProjections;
  }
  getBsKPIActuals() {
    return this.bsKPIActuals;
  }
  getBsKPIProjections() {
    return this.bsKPIProjections;
  }
  getuserDetailAPI() {
    return this.userDetailAPI;
  }
  getCashActualsAPI(){
	return this.cashActualsAPI;
  }
  getCashProjectionsAPIGET(){
	return this.cashProjectionsAPI;
  }
   getCashProjectionsAPIPOST() {
    return this.cashProjectionsAPI;
  }
  getCashScenarioAPI(){
	  return this.cashscenarioAPI;
  }
  getuserProfileDetail() {
    return this.userProfileDetailAPI;
  }
  getTopCompaniesAPI() {
    return this.getTopCompanies;
  }
}
