import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import {UserDetailModelService} from 'src/app/shared/user-detail-model.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PLElement {
  inMillions:number;
  "Total Revenue":string;
  "Revenue Y-O-Y Growth rate":string;
  "(-) Cost of Goods Sold (COGS)":string;
  "Gross Profit":string;
  "Gross Margin":string;
  "(-) Selling, General & Administrative Expense (SG&A)":string;
  "EBIT":string;
  "EBIT Margin":string;
  "(+) Depreciation & Amortization (D&A)":string;
  "EBITDA":string;
  "EBITDA Margin":string;
  "(-) Net Interest/Other Income Expense":string;
  "EBT":string;
  "EBT Margin":string;
  "(-) Taxes":string;
  "Net Income":string;
  "Net Income Margin":string;
}

let ELEMENT_PL_PDF: PLElement[] = [];

@Component({
  selector: 'app-plmetrics',
  templateUrl: './plmetrics.component.html',
  styleUrls: ['./plmetrics.component.scss']
})

export class PLMetricsComponent implements OnInit {
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
  companySelected = localStorage.getItem('companySelected');
  constructor(
    private urlConfig:UrlConfigService,
    private apiService:RMIAPIsService,
    private UserDetailModelService:UserDetailModelService
  ) { }

  ngOnInit() {
    const ELEMENT_PL: PLElement[] = [];
      this.progressBar=true;
      var previousAmount;
    this.apiService.getData(this.urlConfig.getIsActualsAPI()+this.companySelected).subscribe((res:any)=>{
      for (let j=0; j<res.length; j++) {
        if( res[j].latest === 0){
          previousAmount = res[j].totalrevenue;
        }
      this.financialObj.set(res[j].asof,{
        "totalRevenue":res[j].totalrevenue,
        "revenuepercent" : res[j].revenuepercent,
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
        "netIterestExpense" : res[j].netinterest,
        "NetIncome":res[j].netincome,
        "NetIncomeMargin":res[j].netincomemargin
          });
        }
    this.apiService.getData(this.urlConfig.getScenarioAPI()+this.companySelected).subscribe((res:any)=>{
      this.scenarioArray=res.scenarios;
      this.UserDetailModelService.setScenarioNumber(this.scenarioArray);
      let scenarioNumber=0;
      if(res.scenarios.includes(this.scenario)){
        scenarioNumber=this.scenario;
      }
      this.apiService.getData(this.urlConfig.getIsProjectionsAPIGET()+this.companySelected+"&scenario="+scenarioNumber).subscribe((res:any)=>{
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
                  "EBT" : res[j].ebt,
                  "EBTMargin":res[j].ebtmargin,
                  "Taxes":res[j].taxes,
                  "netIterestExpense" : res[j].netinterestdollars,
                  "NetIncome":res[j].netincome,
                  "NetIncomeMargin":res[j].netincomemargin,
          });
        }
        this.financialObj.forEach((v,k) => {
        var pushData={
            inMillions : k,
            "Total Revenue" : "$ "+v.totalRevenue,
            "Revenue Y-O-Y Growth rate" : v.revenuepercent+"%",
            "(-) Cost of Goods Sold (COGS)" : "$ "+v.COGS,
            "Gross Profit" : "$ "+v.GrossProfit,
            "Gross Margin" : v.GrossMargin+"%",
            "(-) Selling, General & Administrative Expense (SG&A)" : "$ "+v.SGA,
            "EBIT" : "$ "+v.EBIT,
            "EBIT Margin":v.EBITMargin+"%",
            "(+) Depreciation & Amortization (D&A)" : "$ "+v.DandA,
            "EBITDA" : "$ "+v.EBITDA,
            "EBITDA Margin":v.EBITDAMargin+"%",
            "(-) Net Interest/Other Income Expense" : "$ "+v.netIterestExpense,
            "EBT" : "$ "+v.EBT,
            "EBT Margin":v.EBTMargin+"%",
            "(-) Taxes" : "$ "+v.Taxes,
            "Net Income" : "$ "+v.NetIncome,
            "Net Income Margin" : "$ "+v.NetIncomeMargin+"%"
          };
          ELEMENT_PL.push(pushData);
      });
      ELEMENT_PL_PDF=ELEMENT_PL;
      this.displayedColumns = ['0'].concat(ELEMENT_PL.map(x => x.inMillions.toString()));
      this.displayData = this.inputColumns.map(x => formatInputRow(x));
      this.progressBar=false;
	  const obj = {};
        this.financialObj.forEach((value, key) => {
          obj[key] = value
        })

        this.years = Object.keys(obj);
        this.financials = Object.values(obj);
        });//end of projections
      });//end of Save Scenarios
    });//end of actuals
   function formatInputRow(row) {
      const output = {};
      output[0] = row;
      for (let i = 0; i < ELEMENT_PL.length; ++i) {
        output[ELEMENT_PL[i].inMillions] = ELEMENT_PL[i][row];
      }
      return output;
    }
  }
 
  loadScenario(index:number){
  
      this.scenario = index;
      this.ngOnInit();
  
  }

  exportToXLSX(){}
  exportToPDF(){
    let doc = new jsPDF('l','pt'); 
  let data = [];
  let inMillionsYear=[];
  let totalRevenue=[];
  let revenueGrowthRate=[];
  let COGS=[];
  let grossProfit=[];
  let grossMargin=[];
  let SGA=[];
  let EBIT=[];
  let EBITMargin=[];
  let DA=[];
  let EBITDA=[];
  let EBITDAMargin=[];
  let NIE=[];
  let EBT=[];
  let EBTMargin=[];
  let taxes=[];
  let netIncome=[];
  let netIncomeMargin=[];
  ELEMENT_PL_PDF.forEach(obj => {
    inMillionsYear.push(obj["inMillions"]);
    totalRevenue.push(obj["Total Revenue"]);
    revenueGrowthRate.push(obj["Revenue Y-O-Y Growth rate"]);
    COGS.push(obj["(-) Cost of Goods Sold (COGS)"]);
    grossProfit.push(obj["Gross Profit"]);
    grossMargin.push(obj["Gross Margin"]);
    SGA.push(obj["(-) Selling, General & Administrative Expense (SG&A)"]);
    EBIT.push(obj["EBIT"]);
    EBITMargin.push(obj["EBIT Margin"]);
    DA.push(obj["(+) Depreciation & Amortization (D&A)"]);
    EBITDA.push(obj["EBITDA"]);
    EBITDAMargin.push(obj["EBITDA Margin"]);
    NIE.push(obj["(-) Net Interest/Other Income Expense"]);
    EBT.push(obj["EBT"]);
    EBTMargin.push(obj["EBT Margin"]);
    taxes.push(obj["(-) Taxes"]);
    netIncome.push(obj["Net Income"]);
    netIncomeMargin.push(obj["Net Income Margin"]);
  });
  inMillionsYear.unshift("Years");
  totalRevenue.unshift("Total Revenue");
  revenueGrowthRate.unshift("Revenue Y-O-Y Growth rate");
  COGS.unshift("(-) Cost of Goods Sold (COGS)");
  grossProfit.unshift("Gross Profit");
  grossMargin.unshift("Gross Margin");
  SGA.unshift("(-) Selling, General & Administrative Expense (SG&A)");
  EBIT.unshift("EBIT");
  EBITMargin.unshift("EBIT Margin");
  DA.unshift("(+) Depreciation & Amortization (D&A)");
  EBITDA.unshift("EBITDA");
  EBITDAMargin.unshift("EBITDA Margin");
  NIE.unshift("(-) Net Interest/Other Income Expense");
  EBT.unshift("EBT");
  EBTMargin.unshift("EBT Margin");
  taxes.unshift("(-) Taxes");
  netIncome.unshift("Net Income");
  netIncomeMargin.unshift("Net Income Margin");
  data.push(totalRevenue,revenueGrowthRate,COGS,grossProfit,grossMargin,SGA,EBIT,EBITMargin,DA,EBITDA,EBITDAMargin,NIE,EBT,EBTMargin,taxes,netIncome,netIncomeMargin);
    autoTable(doc,{
      head: [inMillionsYear],
      body: data,     
      headStyles:{fillColor: [22, 74, 91], textColor:[245, 245, 245]},
      columnStyles: {0: {fillColor: [22, 74, 91], textColor:[245, 245, 245] }},
      styles: {overflow: 'linebreak',fontSize: 12},
    });
    doc.save(this.companySelected +'.pdf');
  }
}


