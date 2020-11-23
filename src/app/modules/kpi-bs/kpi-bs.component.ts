import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import { UserDetailModelService } from 'src/app/shared/user-detail-model.service';

export interface PeriodicElement {
  position:number;
  name: string;
  fromyear: number;
  toyear: number;
  KPIValue: any;
}

@Component({
  selector: 'app-kpi-bs',
  templateUrl: './kpi-bs.component.html',
  styleUrls: ['./kpi-bs.component.scss']
})
export class KpiBsComponent implements OnInit {
 
  scenario=this.UserDetailModelService.getSelectedScenario();
  companyName=this.UserDetailModelService.getSelectedCompany();
  scenarioArray=[];
  progressBar:boolean;
  dataValuesActuals:any;
  dataValuesProjections:any;
  loadedScenario: string = "Scenario 0";
  dataColumns:string[]=["Avg. Days Sales Outstanding (DSO)",	
  "Avg. Inventory Days",
  "Avg. Other Current Assets (as % of Revenue)",
  "Avg. Days Payable Outstanding (DPO)",	
  "Avg. Accrued Liabilities (as % of COGS)",
  "Avg. Other Current Liabilties (as % of COGS)"];
  displayedColumns: string[] = ['position','name',
    'fromyear',
    'toyear',
    'KPIValue'];
  ELEMENT_KPI_ACTUALS: PeriodicElement[] = [];
  ELEMENT_KPI_PROJECTIONS: PeriodicElement[] = [];
  dataSourceActuals = new MatTableDataSource<PeriodicElement>(this.ELEMENT_KPI_ACTUALS);
  dataSourceProjections=new MatTableDataSource<PeriodicElement>(this.ELEMENT_KPI_PROJECTIONS);
  companySelected = localStorage.getItem('companySelected');
  constructor(
    private urlConfig:UrlConfigService,
    private apiService:RMIAPIsService,
    private UserDetailModelService:UserDetailModelService
  ) { }

  ngOnInit() {
        this.progressBar=true;
    this.apiService.getData(this.urlConfig.getBsKPIActuals()+this.companySelected).subscribe((res:any)=>{
    this.ELEMENT_KPI_PROJECTIONS = [];
    this.ELEMENT_KPI_ACTUALS = []
	this.dataSourceActuals = new MatTableDataSource<PeriodicElement>(this.ELEMENT_KPI_ACTUALS);
  this.dataSourceProjections=new MatTableDataSource<PeriodicElement>(this.ELEMENT_KPI_PROJECTIONS);

    this.dataValuesActuals = [res[0].dso,res[0].inventorydays,res[0].othercurrentassetspercent,res[0].dpo,
    res[0].accruedliabilitiespercent,res[0].othercurrentliabilitiespercent];

    for (let index=0; index<=this.dataColumns.length-1;index++){
      let pushData = {
        position:index+1,
        name:this.dataColumns[index],
        fromyear:res[0].fromyear,
        toyear:res[0].toyear,
        KPIValue:this.dataValuesActuals[index]+"%"
  }
    this.ELEMENT_KPI_ACTUALS.push(pushData);
    this.dataSourceActuals._updateChangeSubscription();
      }
      this.progressBar=false;
    });
    this.apiService.getData(this.urlConfig.getScenarioAPI()+this.companySelected).subscribe((res:any)=>{
    this.progressBar=true;
    this.scenarioArray=res.scenarios;
    this.UserDetailModelService.setScenarioNumber(this.scenarioArray);
    let scenarioNumber=0;
    if(res.scenarios.includes(this.scenario)){
      scenarioNumber=this.scenario;
    }
    this.apiService.getData(this.urlConfig.getBsKPIProjections()+this.companySelected+"&scenario="+scenarioNumber).subscribe((res:any)=>{
      this.progressBar=true;
      this.dataValuesProjections = [res[0].dso,res[0].inventorydays,res[0].othercurrentassetspercent,res[0].dpo,
      res[0].accruedliabilitiespercent,res[0].othercurrentliabilitiespercent];
      for (let index=0; index<=this.dataColumns.length-1;index++){
        var pushData = {
          position:index+1,
          name:this.dataColumns[index],
          fromyear:res[0].fromyear,
          toyear:res[0].toyear,
          KPIValue:this.dataValuesProjections[index]+"%"
    }
      this.ELEMENT_KPI_PROJECTIONS.push(pushData);
      this.dataSourceProjections._updateChangeSubscription();
        }
        this.progressBar=false;    
      });
    });
  }
  loadScenario(index:number){
   
      this.scenario = index;

      this.loadedScenario = "Scenario "+index
      this.ngOnInit();
  
}
}



