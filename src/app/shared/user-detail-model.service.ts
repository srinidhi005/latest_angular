import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDetailModelService {
  private selectedCompany:string;
  private selectedScenario:number;
  private scenarioNumber=[]
  constructor() { }

  getSelectedCompany(){
    return this.selectedCompany;
  }
  setSelectedCompany(companyName:string){
    this.selectedCompany= companyName;
  }
  isSelectedCompanyExists(){
    return this.selectedCompany!=undefined
  }
  getSelectedScenario(){
    return this.selectedScenario;
  }
  setSelectedScenario(selectedScenario:number){
    this.selectedScenario=selectedScenario;
  }
  getScenarioNumber(){
    return this.scenarioNumber;
  }
  setScenarioNumber(scenarioNumber:any[]){
    this.scenarioNumber=scenarioNumber;
  }
}
