import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import {UserDetailModelService} from 'src/app/shared/user-detail-model.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
export interface PLElement {
  inMillions:number;
  "Cash Equivalents":string;
  "Accounts Receivable":string;
  "Inventories":string;
  "Prepaid Expenses & Other Current Assets":string;
  "Total Current Assets":string;
  "Property Plant & Equipment":string;
  "Intangible Assets":string;
  "Goodwill" :string;
  "Other Assets":string;
  "Total Assets" : string;
  "Current Portion Long Term Debt":string;
  "Accounts Payable":string;
  "Accrued Liabilities" : string;
  "Other Current Liabilities" : string;
  "Total Current Liabilities":string;
  "Long Term Debt":string;
  "Other Liabilities":string;
  "Total Shareholders Equity":string;
  "Total Liabilities and Shareholders Equity":string;
  "Memo Check":string;
}
let ELEMENT_BS_PDF: PLElement[] = [];
years=[];
financials=[];

@Component({
  selector: 'app-bsmetrics',
  templateUrl: './bsmetrics.component.html',
  styleUrls: ['./bsmetrics.component.scss']
})

export class BsmetricsComponent implements OnInit {
  scenarioArray=[];
  scenario=this.UserDetailModelService.getSelectedScenario();
  companyName=this.UserDetailModelService.getSelectedCompany();
  financialObj = new Map();
  progressBar:boolean;
  inputColumns = ['inMillions',  'Cash Equivalents',
  'Accounts Receivable',
  'Inventories',
  'Prepaid Expenses & Other Current Assets',
  'Total Current Assets',
  'Property Plant & Equipment',
  'Intangible Assets',
  'Goodwill' ,
  'Other Assets',
  'Total Assets',
  'Current Portion Long Term Debt',
  'Accounts Payable',
  'Accrued Liabilities',
  'Other Current Liabilities',
  'Total Current Liabilities',
  'Long Term Debt',
  'Other Liabilities',
  'Total Shareholders Equity',
  'Total Liabilities and Shareholders Equity',
  'Memo Check'];
  displayedColumns: string[]=[];
  displayData: any[];
  companySelected = localStorage.getItem('companySelected');
  constructor(
    private urlConfig:UrlConfigService,
    private apiService:RMIAPIsService,
    private UserDetailModelService:UserDetailModelService
  ) { }

  ngOnInit() {
    const ELEMENT_BS: PLElement[] = [];
	this.years=[];
	this.financials=[];
      this.progressBar=true;
  var memocheck;
    this.apiService.getData(this.urlConfig.getBsActualsAPI()+this.companySelected).subscribe((res:any)=>{
      for (let j=0; j<res.length; j++) {
        if(res[j].memocheck === 0){
          memocheck="Match";
        }
        else{
          memocheck="Not Match";
        }
      this.financialObj.set(res[j].asof,{
        "cashequivalents":res[j].cashequivalents,
        "accountsreceivable":res[j].accountsreceivable,
        "inventories" : res[j].inventories, 
        "GrossMargin":res[j].grossprofitmargin,
        "othercurrentassets":res[j].othercurrentassets,
        "totalcurrentassets" : res[j].totalcurrentassets, 
        "ppe":res[j].ppe,
        "intangibleassets":res[j].intangibleassets,
        "goodwill" : res[j].goodwill, 
        "otherassets":res[j].otherassets,
        "totalassets" : res[j].totalassets,
        "currentportionlongtermdebt":res[j].currentportionlongtermdebt,
        "accountspayable":res[j].accountspayable,
        "accruedliabilities" : res[j].accruedliabilities,
        "othercurrentliabilities" : res[j].othercurrentliabilities,
        "totalcurrentliabilities":res[j].totalcurrentliabilities,
        "longtermdebt":res[j].longtermdebt,
        "otherliabilities":res[j].otherliabilities,
        "totalshareholdersequity":res[j].totalshareholdersequity,
        "totalliabilitiesandequity":res[j].totalliabilitiesandequity,
        "Memo Check":memocheck
                });
        }
    this.apiService.getData(this.urlConfig.getScenarioAPI()+this.companySelected).subscribe((res:any)=>{
      this.scenarioArray=res.scenarios;
     this.UserDetailModelService.setScenarioNumber(this.scenarioArray);
      let scenarioNumber=0;
      if(res.scenarios.includes(this.scenario)){
        scenarioNumber=this.scenario;
      }
      this.apiService.getData(this.urlConfig.getBsProjectionsAPIGET()+this.companySelected+"&scenario="+scenarioNumber).subscribe((res:any)=>{
        for (let j=0; j<res.length; j++) {
          if(res[j].memocheck === 0){
            memocheck="Match";
          }
          else{
            memocheck="Not Match";
          }
          this.financialObj.set(res[j].asof,{
            "cashequivalents":res[j].cashequivalents,
            "accountsreceivable":res[j].accountsreceivable,
            "inventories" : res[j].inventories, 
            "othercurrentassets":res[j].othercurrentassets,
            "totalcurrentassets" : res[j].totalcurrentassets, 
            "ppe":res[j].ppe,
            "intangibleassets":res[j].intangibleassets,
            "goodwill" : res[j].goodwill, 
            "otherassets":res[j].otherassets,
            "totalassets" : res[j].totalassets,
            "currentportionlongtermdebt":res[j].currentportionlongtermdebt,
            "accountspayable":res[j].accountspayable,
            "accruedliabilities" : res[j].accruedliabilities,
            "othercurrentliabilities" : res[j].othercurrentliabilities,
            "totalcurrentliabilities":res[j].totalcurrentliabilities,
            "longtermdebt":res[j].longtermdebt,
            "otherliabilities":res[j].otherliabilities,
            "totalshareholdersequity":res[j].totalshareholdersequity,
            "totalliabilitiesandequity":res[j].totalliabilitiesandequity,
            "Memo Check":memocheck
          });
        }
        
        this.financialObj.forEach((v,k) => {
          var pushData={
            inMillions:k,
            "Cash Equivalents" : "$ " +v.cashequivalents,
            "Accounts Receivable" : "$ " +v.accountsreceivable,
            "Inventories": "$ " +v.inventories,
            "Prepaid Expenses & Other Current Assets" : "$ "+v.othercurrentassets,
            "Total Current Assets" : "$ "+v.totalcurrentassets, 
            "Property Plant & Equipment" : "$ "+v.ppe,
            "Intangible Assets" : "$ "+v.intangibleassets,
            "Goodwill"  : "$ "+ v.goodwill, 
            "Other Assets" : "$ "+v.otherassets,
            "Total Assets"  : "$ "+ v.totalassets,
            "Current Portion Long Term Debt" : "$ "+v.currentportionlongtermdebt,
            "Accounts Payable" : "$ "+v.accountspayable,
            "Accrued Liabilities"  : "$ "+ v.accruedliabilities,
            "Other Current Liabilities"  : "$ "+ v.othercurrentliabilities,
            "Total Current Liabilities" : "$ "+v.totalcurrentliabilities,
            "Long Term Debt" : "$ "+v.longtermdebt,
            "Other Liabilities" : "$ "+v.otherliabilities,
            "Total Shareholders Equity" : "$ "+v.totalshareholdersequity,
            "Total Liabilities and Shareholders Equity" : "$ "+v.totalliabilitiesandequity,
            "Memo Check" : memocheck
          };
          ELEMENT_BS.push(pushData);
      });
      this.displayedColumns = ['0'].concat(ELEMENT_BS.map(x => x.inMillions.toString()));
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
      for (let i = 0; i < ELEMENT_BS.length; ++i) {
        output[ELEMENT_BS[i].inMillions] = ELEMENT_BS[i][row];
      }
      return output;
    }
    ELEMENT_BS_PDF=ELEMENT_BS
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
  let cashEquivalents=[];
  let accountsReceivable=[];
  let inventories=[];
  let prepaidExpensesOtherCurrentAssets=[];
  let totalCurrentAssets=[];
  let ppe=[];
  let intangibleAssets=[];
  let goodwill =[];
  let otherAssets=[];
  let totalAssets=[];
  let currentPortionLongTermDebt=[];
  let accountsPayable=[];
  let accruedLiabilities = [];
  let otherCurrentLiabilities = [];
  let totalCurrentLiabilities=[];
  let longTermDebt=[];
  let otherLiabilities=[];
  let totalShareholdersEquity=[];
  let totalLiabilitiesShareholdersEquity=[];
  let memocheck=[];
  ELEMENT_BS_PDF.forEach(obj => {
    inMillionsYear.push(obj["inMillions"]);
    cashEquivalents.push(obj["Cash Equivalents"]);
    accountsReceivable.push(obj["Accounts Receivable"]);
    inventories.push(obj["Inventories"]);
    prepaidExpensesOtherCurrentAssets.push(obj["Prepaid Expenses & Other Current Assets"]);
    totalCurrentAssets.push(obj["Total Current Assets"]);
    ppe.push(obj["Property Plant & Equipment"]);
    intangibleAssets.push(obj["Intangible Assets"]);
    goodwill.push(obj["Goodwill"]);
    otherAssets.push(obj["Other Assets"]);
    totalAssets.push(obj["Total Assets"]);
    currentPortionLongTermDebt.push(obj["Current Portion Long Term Debt"]);
    accountsPayable.push(obj["Accounts Payable"]);
    accruedLiabilities.push(obj["Accrued Liabilities"]);
    otherCurrentLiabilities.push(obj["Other Current Liabilities"]);
    totalCurrentLiabilities.push(obj["Total Current Liabilities"]);
    longTermDebt.push(obj["Long Term Debt"]);
    otherLiabilities.push(obj["Other Liabilities"]);
    totalShareholdersEquity.push(obj["Total Shareholders Equity"]);
    totalLiabilitiesShareholdersEquity.push(obj["Total Liabilities and Shareholders Equity"]);
    memocheck.push(obj["memocheck"]);
  });
  inMillionsYear.unshift("Years");
  cashEquivalents.unshift("Cash Equivalents");
  accountsReceivable.unshift("Accounts Receivable");
  inventories.unshift("Inventories");
  prepaidExpensesOtherCurrentAssets.unshift("Prepaid Expenses & Other Current Assets");
  totalCurrentAssets.unshift("Total Current Assets");
  ppe.unshift("Property Plant & Equipment");
  intangibleAssets.unshift("Intangible Assets");
  goodwill.unshift("Goodwill");
  otherAssets.unshift("Other Assets");
  totalAssets.unshift("Total Assets");
  currentPortionLongTermDebt.unshift("Current Portion Long Term Debt");
  accountsPayable.unshift("Accounts Payable");
  accruedLiabilities.unshift("Accrued Liabilities");
  otherCurrentLiabilities.unshift("Other Current Liabilities");
  totalCurrentLiabilities.unshift("Total Current Liabilities");
  longTermDebt.unshift("Long Term Debt");
  otherLiabilities.unshift("Other Liabilities");
  totalShareholdersEquity.unshift("Total Shareholders Equity");
  totalLiabilitiesShareholdersEquity.unshift("Total Liabilities and Shareholders Equity");
  memocheck.unshift("memocheck");
  data.push(cashEquivalents,accountsReceivable,inventories,prepaidExpensesOtherCurrentAssets,totalCurrentAssets,ppe,intangibleAssets,goodwill,otherAssets,totalAssets,currentPortionLongTermDebt,accountsPayable,accruedLiabilities,otherCurrentLiabilities,totalCurrentLiabilities,longTermDebt,otherLiabilities,totalShareholdersEquity,totalLiabilitiesShareholdersEquity,memocheck);

    autoTable(doc,{
      head: [inMillionsYear],
      body: data,
      headStyles:{fillColor: [22, 74, 91], textColor:[245, 245, 245]},
      columnStyles: {0: {fillColor: [22, 74, 91], textColor:[245, 245, 245] }},
      styles: {overflow: 'linebreak',fontSize: 12},
    });
    doc.save(this.companyName +'.pdf');
  }
}


