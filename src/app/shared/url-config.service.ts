import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class UrlConfigService {
  private statementAPI="https://app.rmiinsights.com:8001/statements";
  private deleteStatementAPI="https://app.rmiinsights.com:8001/deletestatement?companyname=";
  private downloadStatementAPI="https://app.rmiinsights.com:8001/download_file?companyname=";
  private uploadStatementAPI="https://app.rmiinsights.com:8001/upload_file";
  private isActualsAPI="https://app.rmiinsights.com:8001/actuals?company=";
  private scenarioAPI="https://app.rmiinsights.com:8001/scenarios?company=";
  private isProjectionsAPIGET="https://app.rmiinsights.com:8001/projections?company=";
  private bsActualsAPI="https://app.rmiinsights.com:8001/balance-actuals?company=";
  private bsProjectionsAPIGET="https://app.rmiinsights.com:8001/balance-projections?company=";
  private isKPIActuals="https://app.rmiinsights.com:8001/kpi-pnl-actuals?company=";
  private isKPIProjections="https://app.rmiinsights.com:8001/kpi-pnl-projections?company=";
  private bsKPIActuals="https://app.rmiinsights.com:8001/kpi-bs-actuals?company=";
  private bsKPIProjections="https://app.rmiinsights.com:8001/kpi-bs-projections?company=";
  private userDetailAPI="https://app.rmiinsights.com:8001/updateprofile";
  private userProfileDetailAPI="https://app.rmiinsights.com:8001/userprofiledetails?userid="
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
getuserDetailAPI(){
  return this.userDetailAPI;
}
getuserProfileDetail(){
  return this.userProfileDetailAPI;
}
}
