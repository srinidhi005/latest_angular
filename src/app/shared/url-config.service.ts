import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class UrlConfigService {
  private statementAPI="http://34.67.197.111:8000/statements";
  private deleteStatementAPI="http://34.67.197.111:8000/deletestatement?companyname=";
  private downloadStatementAPI="http://34.67.197.111:8000/download_file?companyname=";
  private uploadStatementAPI="http://34.67.197.111:8000/upload_file";
  private isActualsAPI="http://34.67.197.111:8000/actuals?company=";
  private scenarioAPI="http://34.67.197.111:8000/scenarios?company=";
  private isProjectionsAPIGET="http://34.67.197.111:8000/projections?company=";
  private bsActualsAPI="http://34.67.197.111:8000/balance-actuals?company=";
  private bsProjectionsAPIGET="http://34.67.197.111:8000/balance-projections?company=";
  private isKPIActuals="http://34.67.197.111:8000/kpi-pnl-actuals?company=";
  private isKPIProjections="http://34.67.197.111:8000/kpi-pnl-projections?company=";
  private bsKPIActuals="http://34.67.197.111:8000/kpi-bs-actuals?company=";
  private bsKPIProjections="http://34.67.197.111:8000/kpi-bs-projections?company=";

  constructor(private http:HttpClient) { }
  
getStatementAPI(){
  return this.statementAPI;
}
getDeleteStatementAPI(){
  return this.deleteStatementAPI;
}
getDownloadStatementAPI(){
  return this.downloadStatementAPI;
}
getuploadStatementAPI(){
  return this.uploadStatementAPI;
}
getIsActualsAPI(){
  return this.isActualsAPI;
}
getIsProjectionsAPIGET(){
  return this.isProjectionsAPIGET;
}
getIsProjectionsAPIPOST(){
  return this.isProjectionsAPIGET;
}
getScenarioAPI(){
  return this.scenarioAPI;
}
getBsActualsAPI(){
  return this.bsActualsAPI;
}
getBsProjectionsAPIGET(){
  return this.bsProjectionsAPIGET;
}
getBsProjectionsAPIPOST(){
  return this.bsProjectionsAPIGET;
}
getIsKPIActuals(){
  return this.isKPIActuals;
}
getIsKPIProjections(){
  return this.isKPIProjections;
}
getBsKPIActuals(){
  return this.bsKPIActuals;
}
getBsKPIProjections(){
  return this.bsKPIProjections;
}
}
