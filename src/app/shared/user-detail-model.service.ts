import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDetailModelService {
  selectedScenarioIndex: number

  updateBalanceSheetScenario = new Subject();
  updateIncomeSheetScenario = new Subject();

  private selectedCompany:string;
  private selectedScenario:number;
  private scenarioNumber=[]
  constructor() { }


  setBalanceSheetScenario(scenarioNumber){
    this.selectedScenarioIndex = scenarioNumber;
    this.updateBalanceSheetScenario.next();
  }

  setIncomeSheetScenario(scenarioNumber){
    this.selectedScenarioIndex = scenarioNumber;
    this.updateIncomeSheetScenario.next();
  }

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
