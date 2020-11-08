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
  selector: 'app-kpi-is',
  templateUrl: './kpi-is.component.html',
  styleUrls: ['./kpi-is.component.scss']
})
export class KpiIsComponent implements OnInit {
  scenario=this.UserDetailModelService.getSelectedScenario();
  companyName=this.UserDetailModelService.getSelectedCompany();
  scenarioArray=[];
  progressBar:boolean;
  dataValuesActuals:any;
  dataValuesProjections:any;
  dataColumnsActuals:string[]=["Revenue CAGR",	
    "COGS CAGR",
    "Gross Profit CAGR",
    "EBITDA CAGR",	
    "Avg. Gross Margin",
    "Avg. SG&A as % of Revenue",	
    "Avg. EBIT Margin",
    "Avg. D&A as % of Revenue",	
    "Avg. EBITDA Margin",	
    "Avg. EBT Margin",
    "Avg. Net Income Margin"];
    dataColumnsProjections:string[]=["Revenue CAGR",	
    "COGS CAGR",
    "Gross Profit CAGR",
    "EBITDA CAGR",	
    "Avg. Gross Margin",
    "Avg. SG&A as % of Revenue",	
    "Avg. EBIT Margin",
    "Avg. D&A as % of Revenue",	
    "Avg. EBITDA Margin",	
    "Avg. EBT Margin",
    "Avg. Net Income Margin"];
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
    this.apiService.getData(this.urlConfig.getIsKPIActuals()+this.companySelected).subscribe((res:any)=>{
    this.dataValuesActuals = [res[0].revenuecagr,res[0].cogscagr,res[0].grossprofitcagr,res[0].ebitdacagr,
    res[0].avggrossmargin,res[0].avgsgaasrevenue,res[0].avgebitmargin,res[0].avgdnaasrevenue,
    res[0].avgebitdamargin,res[0].avgebtmargin,res[0].avgnetincomemargin];
    for (let index=0; index<=this.dataColumnsActuals.length-1;index++){
      let pushData = {
        position:index+1,
        name:this.dataColumnsActuals[index],
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
      this.apiService.getData(this.urlConfig.getIsKPIProjections()+this.companySelected+"&scenario="+scenarioNumber).subscribe((res:any)=>{
        this.progressBar=true;
        this.dataValuesProjections = [res[0].revenuecagr,res[0].cogscagr,res[0].grossprofitcagr,res[0].ebitdacagr,
        res[0].avggrossmargin,res[0].avgsgaasrevenue,res[0].avgebitmargin,res[0].avgdnaasrevenue,
        res[0].avgebitdamargin,res[0].avgebtmargin,res[0].avgnetincomemargin];
        for (let index=0; index<=this.dataColumnsProjections.length-1;index++){
          let pushData = {
            position:index+1,
            name:this.dataColumnsProjections[index],
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
      this.ngOnInit();
  
}
}