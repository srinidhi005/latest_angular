import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import {UserDetailModelService} from 'src/app/shared/user-detail-model.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-plmetrics',
  templateUrl: './plmetrics.component.html',
  styleUrls: ['./plmetrics.component.scss']
})

export class PLMetricsComponent implements OnInit {
  yearsArray=[];
  scenarioArray=[];
  scenario=this.UserDetailModelService.getSelectedScenario();
  companyName=this.UserDetailModelService.getSelectedCompany();
  financialObj = new Map();
  progressBar:boolean;
  inputColumns = ['inMillions',  'Total Revenue',
  'Revenue Y-O-Y Growth rate',
  '(-) Cost of Goods Sold (COGS)',
  'Gross Profit',
  'Gross Margin',
  '(-) Selling, General & Administrative Expense (SG&A)',
  'EBIT',
  'EBIT Margin',
  '(+) Depreciation & Amortization (D&A)',
  'EBITDA',
  'EBITDA Margin',
  '(-) Net Interest/Other Income Expense',
  'EBT',
  'EBT Margin',
  '(-) Taxes',
  'Net Income',
  'Net Income Margin'];
  displayedColumns: string[]=[];
  displayData: any[];
  constructor(
    private urlConfig:UrlConfigService,
    private apiService:RMIAPIsService,
    private UserDetailModelService:UserDetailModelService
  ) { }

  ngOnInit() {
   
      this.progressBar=true;
  var previousAmount;
    this.apiService.getData(this.urlConfig.getIsActualsAPI()+this.companyName).subscribe((res:any)=>{
      for (let j=0; j<res.length; j++) {
        if( res[j].latest === 0){
          previousAmount = res[j].totalrevenue;
        }
      this.financialObj.set(res[j].asof,{
        "totalRevenue":res[j].totalrevenue,
        "COGS":res[j].cogs,
        "GrossProfit" : res[j].grossprofit, 
        "GrossMargin":res[j].grossprofitmargin,
        "SGA":res[j].sga,
        "EBIT" : res[j].ebit, 
        "EBITMargin":res[j].ebitmargin,
        "DandA":res[j].da,
        "EBITDA" : res[j].ebitda, 
        "EBITDAMargin":res[j].ebitdamargin,
        "EBT" : res[j].ebt,
        "EBTMargin":res[j].ebtmargin,
        "Taxes":res[j].taxes,
        "revenuepercent" : res[j].revenuepercent,
        "netIterestExpense" : res[j].netinterest,
        "NetIncome":res[j].netincome,
        "NetIncomeMargin":res[j].netincomemargin
          });
        }
    this.apiService.getData(this.urlConfig.getScenarioAPI()+this.companyName).subscribe((res:any)=>{
      this.scenarioArray=res.scenarios;
     this.UserDetailModelService.setScenarioNumber(this.scenarioArray);
      let scenarioNumber=0;
      if(res.scenarios.includes(this.scenario)){
        scenarioNumber=this.scenario;
      }
      this.apiService.getData(this.urlConfig.getIsProjectionsAPIGET()+this.companyName+"&scenario="+scenarioNumber).subscribe((res:any)=>{
        let totalRevenue=0;  
        for (let j=0; j<res.length; j++) {
          if(j == 0){
              totalRevenue = Math.round(previousAmount + (previousAmount * (res[j].revenuepercent/100)));
          }else{
              totalRevenue = Math.round(res[j-1].totalRevenue + (res[j-1].totalRevenue * (res[j].revenuepercent/100)));
          }
          this.financialObj.set(res[j].asof,{
                  "totalRevenue": res[j].totalrevenue,
                  "revenuepercent" : res[j].revenuepercent,
                  "COGS" : res[j].cogs, 
                  "GrossProfit":res[j].grossprofit, 
                  "GrossMargin":res[j].grossprofitmargin,
                  "SGA":res[j].sga,
                  "EBIT" : res[j].ebit, 
                  "EBITMargin":res[j].ebitmargin,
                  "DandA":res[j].da, 
                  "EBITDA" : res[j].ebitda, 
                  "EBITDAMargin":res[j].ebitdamargin,
                  "netIterestExpense" : res[j].netinterestdollars,
                  "EBT" : res[j].ebt,
                  "EBTMargin":res[j].ebtmargin,
                  "Taxes":res[j].taxes,
                  "NetIncome":res[j].netincome,
                  "NetIncomeMargin":res[j].netincomemargin,
          });
        }
        this.financialObj.forEach((v,k) => {
          var pushData={
            inMillions:k,
            "Total Revenue":v.totalRevenue,
            "Revenue Y-O-Y Growth rate":v.revenuepercent+"%",
            "(-) Cost of Goods Sold (COGS)":v.COGS,
            "Gross Profit":v.GrossProfit,
            "Gross Margin":v.GrossMargin+"%",
            "(-) Selling, General & Administrative Expense (SG&A)":v.SGA,
            "EBIT":v.EBIT,
            "EBIT Margin":v.EBITMargin+"%",
            "(+) Depreciation & Amortization (D&A)":v.DandA,
            "EBITDA":v.EBITDA,
            "EBITDA Margin":v.EBITDAMargin+"%",
            "(-) Net Interest/Other Income Expense":v.netIterestExpense,
            "EBT":v.EBT,
            "EBT Margin":v.EBTMargin+"%",
            "(-) Taxes":v.Taxes,
            "Net Income":v.NetIncome,
            "Net Income Margin":v.NetIncomeMargin+"%"
          };
          ELEMENT_D.push(pushData);
      });
      this.displayedColumns = ['0'].concat(ELEMENT_D.map(x => x.inMillions.toString()));
      this.displayData = this.inputColumns.map(x => this.formatInputRow(x));
      this.progressBar=false;
        });//end of projections
      });//end of Save Scenarios
    });//end of actuals
  }
  formatInputRow(row) {
    const output = {};
    output[0] = row;
    for (let i = 0; i < ELEMENT_D.length; ++i) {
      output[ELEMENT_D[i].inMillions] = ELEMENT_D[i][row];
    }

    return output;
  }
  exportToXLSX(){}
  exportToPDF(){
    let doc = new jsPDF('l','pt'); 
  let data = [];
  ELEMENT_D.forEach(obj => {
    let arr = [];
    this.inputColumns.forEach(col => {
      arr.push(obj[col]);
      console.log(arr);
    });
    data.push(arr);
  });      
    autoTable(doc,{
      head: [this.inputColumns],
      body: data
    });
    doc.save('table.pdf')
  }
}

export interface PLElement {
  inMillions:number;
  "Total Revenue":number;
  "Revenue Y-O-Y Growth rate":string;
  "(-) Cost of Goods Sold (COGS)":number;
  "Gross Profit":number;
  "Gross Margin":string;
  "(-) Selling, General & Administrative Expense (SG&A)":number;
  "EBIT":number;
  "EBIT Margin":string;
  "(+) Depreciation & Amortization (D&A)":number;
  "EBITDA":number;
  "EBITDA Margin":string;
  "(-) Net Interest/Other Income Expense":number;
  "EBT":number;
  "EBT Margin":string;
  "(-) Taxes":number;
  "Net Income":number;
  "Net Income Margin":string;
}
const ELEMENT_D: PLElement[] = [];
