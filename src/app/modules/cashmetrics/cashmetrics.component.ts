import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import {UserDetailModelService} from 'src/app/shared/user-detail-model.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface PLElement {
  inMillions:number;
  "Netincome" :string,
  "(+) D&A" : string,
            "Funds from Operations" : string,
            "(+/–) Δ in Accounts Receivable" : string,
            "(+/–) Δ in Inventories" : string,
            "(+/–) Δ in Accounts Payable" : string,
            "(+/–) Δ in Accrued Liabilities" : string,
            "(+/–) Δ in Other Current Liabilities":string,
            "Cash Flow from Operating Activities (CFO)" : string,
            "(–) Total Capital Expenditures" : string,
            "(+) Asset Sales":string,
            "(+/–) Other Investing Activities" :string,
            "Cash Flow from Investing Activities (CFI)" : string,
            "(+/–) Debt Issued (Retired)": string,
            "(+/–) Common Stock Issued (Retired)" : string,
            "(–) Dividends Paid" : string,
            "Cash Flow from Financing Activities (CFF)" : string,
			"Net Change in Cash" : string,
  
}

let ELEMENT_PL_PDF: PLElement[] = [];

@Component({
  selector: 'app-cashmetrics',
  templateUrl: './cashmetrics.component.html',
  styleUrls: ['./cashmetrics.component.scss']
})
export class CashmetricsComponent implements OnInit {
  scenarioArray=[];
  scenario=this.UserDetailModelService.getSelectedScenario();
  companyName=this.UserDetailModelService.getSelectedCompany();
  financialObj = new Map();
  progressBar:boolean;
years = [];
financials =[];
  inputColumns = ['inMillions',  'Net Income',
  'Depreciation & Amortization',
  'Funds from Operations',
' Accounts Receivable',
  ' Inventories',
  ' Other Current Assets',
  ' Accounts Payable',
  ' Accrued Liabilities',
  ' Other Current Liabilities',
  'Cash Flow from Operating Activities',
  'Total Capital Expenditures',
  ' Asset Sales',
  'Other Investing Activities',
  'Cash Flow from Investing Activities',
  ' Debt Issued',
  'Common Stock Issued',
  'Dividends Paid',
  'Cash Flow from Financing Activities',
  'Net Change in Cash'];
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
      
    this.apiService.getData(this.urlConfig.getCashActualsAPI()+this.companySelected).subscribe((res:any)=>{
      for (let j=0; j<res.length; j++) {
        
      this.financialObj.set(res[j].asof,{
        "Netincome":res[j].netincome,
        "DandA" : res[j].daa,
        "FundsFromOperations":res[j].fundsfromoperations,
        "Accountreceivables" : res[j].accountreceivablesdelta, 
        "Inventories":res[j].inventoriesdelta,
        "OtherCurrentassets":res[j].othercurrentassets,
        "Accountspayable" : res[j].accountspayable, 
		"AccuredLiabilites" : res[j].accruedliabilities, 
        "OtherCurrentliabilities":res[j].othercurrentliabilities,
		"CashFlowFromOperatingActivites":res[j].cfo,
        "Totalexpenditure":res[j].totalexpenditure,
        "AssetSales" : res[j].assetsales, 
		"OtherInvestingActivites" : res[j].otherinvestingactivities, 
        "CashFlowFromInvesting":res[j].cfi,
        "DebtIssuedRetired" : res[j].debtissued,
        "CommonStockIssuedRetired":res[j].commonstockissued,
        "Dividendspaid":res[j].dividendspaid,
		"CashFlowFromFinancingActivites":res[j].cff,
        "NetChangeinCash" : res[j].netchangeincash
          });
        }
    this.apiService.getData(this.urlConfig.getScenarioAPI()+this.companySelected).subscribe((res:any)=>{
      this.scenarioArray=res.scenarios;
      this.UserDetailModelService.setScenarioNumber(this.scenarioArray);
      let scenarioNumber=0;
      if(res.scenarios.includes(this.scenario)){
        scenarioNumber=this.scenario;
      }
      this.apiService.getData(this.urlConfig.getCashProjectionsAPIGET()+this.companySelected+"&scenario="+scenarioNumber).subscribe((res:any)=>{
for (let j=0; j<res.length; j++) {
         
        
       this.financialObj.set(res[j].asof,{
       "Netincome":res[j].netincome,
        "DandA" : res[j].daa,
        "FundsFromOperations":res[j].fundsfromoperations,
        "Accountreceivables" : res[j].accountreceivablesdelta, 
        "Inventories":res[j].inventoriesdelta,
        "OtherCurrentassets":res[j].othercurrentassets,
        "Accountspayable" : res[j].accountspayable, 
		"AccuredLiabilites" : res[j].accruedliabilities, 
        "OtherCurrentliabilities":res[j].othercurrentliabilities,
		"CashFlowFromOperatingActivites":res[j].cfo,
        "Totalexpenditure":res[j].totalexpenditure,
        "AssetSales" : res[j].assetsales, 
		"OtherInvestingActivites" : res[j].otherinvestingactivities, 
        "CashFlowFromInvesting":res[j].cfi,
        "DebtIssuedRetired" : res[j].debtissued,
        "CommonStockIssuedRetired":res[j].commonstockissued,
        "Dividendspaid":res[j].dividendspaid,
		"CashFlowFromFinancingActivites":res[j].cff,
        "NetChangeinCash" : res[j].netchangeincash
          });
        }
        this.financialObj.forEach((v,k) => {
        var pushData={
            inMillions : k,		
            "Netincome" : "$ "+v.netincome,
            "(+) D&A" : "$ "+v.daa,
            "Funds from Operations" : "$ "+v.fundsfromoperations,
            "(+/–) Δ in Accounts Receivable" : "$ "+v.accountreceivablesdelta,
            "(+/–) Δ in Inventories" : "$ "+v.inventoriesdelta,
            "(+/–) Δ in Accounts Payable" : "$ "+v.accountspayable,
            "(+/–) Δ in Accrued Liabilities" : "$ "+v.accruedliabilities,
            "(+/–) Δ in Other Current Liabilities":"$ "+v.othercurrentliabilities,
            "Cash Flow from Operating Activities (CFO)" : "$ "+v.cfo,
            "(–) Total Capital Expenditures" : "$ "+v.totalexpenditure,
            "(+) Asset Sales":"$ "+v.assetsales,
            "(+/–) Other Investing Activities" : "$ "+v.otherinvestingactivities,
            "Cash Flow from Investing Activities (CFI)" : "$ "+v.cfi,
            "(+/–) Debt Issued (Retired)":"$ "+v.debtissued,
            "(+/–) Common Stock Issued (Retired)" : "$ "+v.commonstockissued,
            "(–) Dividends Paid" : "$ "+v.dividendspaid,
            "Cash Flow from Financing Activities (CFF)" : "$ "+v.cff,
			"Net Change in Cash" : "$ "+v.netchangeincash,
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
  let netIncome=[];
  let DA=[];
  let fundsfromOperations=[];
  let accountsReceviable=[];
  let inventories=[];
  let otherCurrentAssests=[];
  let accountPayable=[];
  let accruedLiablities=[];
  let otherCurrentLiabilites=[];
  let CFO=[];
  let totalCapitalExpenditures=[];
  let assestSales=[];
  let otherInvestingActivites=[];
  let CFI=[];
  let debtIssued=[];
  let commonStockIssued=[];
  let dividendsPaid=[];
  let CFF=[];
  let netChangeInCash=[];
  ELEMENT_PL_PDF.forEach(obj => {
    inMillionsYear.push(obj["inMillions"]);
    netIncome.push(obj["Net Income"]);
    DA.push(obj["(+) D&A"]);
    fundsfromOperations.push(obj["Funds from Operations"]);
    accountsReceviable.push(obj["(+/–) Δ in Accounts Receivable"]);
    inventories.push(obj["(+/–) Δ in Inventories"]);
    otherCurrentAssests.push(obj["(+/–) Δ in Other Current Assets"]);
    accountPayable.push(obj["(+/–) Δ in Accounts Payable"]);
    accruedLiablities.push(obj["(+/–) Δ in Accrued Liabilities"]);
    otherCurrentLiabilites.push(obj["(+/–) Δ in Other Current Liabilities"]);
    CFO.push(obj["Cash Flow from Operating Activities (CFO)"]);
    totalCapitalExpenditures.push(obj["(–) Total Capital Expenditures"]);
    assestSales.push(obj["(+) Asset Sales"]);
    otherInvestingActivites.push(obj["(+/–) Other Investing Activities"]);
    CFI.push(obj["Cash Flow from Investing Activities (CFI)"]);
    debtIssued.push(obj["(+/–) Debt Issued (Retired)"]);
    commonStockIssued.push(obj["(+/–) Common Stock Issued (Retired)"]);
    dividendsPaid.push(obj["(–) Dividends Paid"]);
	CFF.push(obj["Cash Flow from Financing Activities (CFF)"]);
	netChangeInCash.push(obj["Net Change in Cash"]);
  });
  inMillionsYear.unshift("Years");
    netIncome.unshift("Net Income");
    DA.unshift("(+) D&A");
    fundsfromOperations.unshift("Funds from Operations");
    accountsReceviable.unshift("(+/–) Δ in Accounts Receivable");
    inventories.unshift("(+/–) Δ in Inventories");
    otherCurrentAssests.unshift("(+/–) Δ in Other Current Assets");
    accountPayable.unshift("(+/–) Δ in Accounts Payable");
    accruedLiablities.unshift("(+/–) Δ in Accrued Liabilities");
    otherCurrentLiabilites.unshift("(+/–) Δ in Other Current Liabilities");
    CFO.unshift("Cash Flow from Operating Activities (CFO)");
    totalCapitalExpenditures.unshift("(–) Total Capital Expenditures");
    assestSales.unshift("(+) Asset Sales");
    otherInvestingActivites.unshift("(+/–) Other Investing Activities");
    CFI.unshift("Cash Flow from Investing Activities (CFI)");
    debtIssued.unshift("(+/–) Debt Issued (Retired)");
    commonStockIssued.unshift("(+/–) Common Stock Issued (Retired)");
    dividendsPaid.unshift("(–) Dividends Paid");
	CFF.unshift("Cash Flow from Financing Activities (CFF)");
	netChangeInCash.unshift("Net Change in Cash");
	
 
  data.push(netIncome,DA,fundsfromOperations,accountsReceviable,inventories,otherCurrentAssests,accountPayable,accruedLiablities,otherCurrentLiabilites,CFO,totalCapitalExpenditures,assestSales,otherInvestingActivites,CFI,debtIssued,commonStockIssued,dividendsPaid,CFF,netChangeInCash	);
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
