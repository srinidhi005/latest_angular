import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import { ExcelService } from 'src/app/shared/excel.service';
import { UserDetailModelService } from 'src/app/shared/user-detail-model.service';
import { formatNumber } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

export interface PLElement {
  inMillions: number;
  'EBITDA': string;
  '(–) Depreciation & Amortization': string;
  EBIT: string;
  '(+/–) Net Interest Expense': string;
  EBT: string;
  '(–) NOLs Utilized': string;
  'EBT Post NOL Utilization': string;
  '(–) Cash Taxes': string;
  'Earnings Before Interest After Taxes (EBIAT)': string;
  '(+) Depreciation & Amortization': string;
  '(–) Capex': string;
  '(+/–) Change in Net Working Capital': string;
  'Unlevered Free Cash Flow': string;
  'Period': string;
  'DiscountFactor': string;
  'wacc':string;
}

let ELEMENT_PL_PDF: PLElement[] = [];

@Component({
  selector: 'app-dcf',
  templateUrl: './dcf.component.html',
  styleUrls: ['./dcf.component.scss'],
})
export class DcfComponent implements OnInit {
	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  @ViewChild('imagecanvas', { static: true }) imagecanvas: ElementRef;
  scenarioArray = [];
  //scenario = this.UserDetailModelService.getSelectedScenario();
  companyName = this.UserDetailModelService.getSelectedCompany();
  financialObj = new Map();
  inprogress = true;
  progressBar: boolean;
  years = [];
  financials = [];
  inputColumns = [
    'inMillions',
    'EBITDA',
    'Depreciation & Amortization',
    'EBIT',
    'Net Interest Expense',
    'EBT',
    'NOLs Utilized',
    'EBT Post NOL Utilization',
    'Cash Taxes',
    'Earnings Before Interest After Taxes',
    'Depreciation Amortization',
    'Capex',
    ' Change in Net Working Capital',
    'Unlevered Free Cash Flow',
    'Peroid',
    'DiscountFactor',
	'wacc'
  ];
  displayedColumns: string[] = [];
  displayData: any[];
  companySelected = localStorage.getItem('companySelected');
  //scenarioNumber = localStorage.getItem('scenarioNumber');
  scenario = this.UserDetailModelService.getSelectedScenario();
  selectedCompanyName = localStorage.getItem('selectedCompanyName');
  scenarioName = 'Scenario [0]';
  saveScenarioNumber: any = 0;
  scenarioSelected: any =0;
  loadedScenario = 'Scenario 0';
  waacEditedValue:any;
  dcf;
  @ViewChild('firstBlock', { static: false }) firstBlock: ElementRef; valuationSummary
  @ViewChild('unleveredFreeCashFlow', { static: false }) unleveredFreeCashFlow: ElementRef;
  @ViewChild('valuations', { static: false }) valuations: ElementRef;
  @ViewChild('valuationSummary', { static: false }) valSummary: ElementRef;

  constructor(
    private urlConfig: UrlConfigService,
    private apiService: RMIAPIsService,
    private UserDetailModelService: UserDetailModelService,
    private excelService: ExcelService,
    public modalService : NgbModal,
	private _snackBar: MatSnackBar,
  ) { }


  ngOnInit() {
    this.excelService.selectedDashboardMenu = 'dcf'
    if (this.UserDetailModelService.selectedScenarioIndex >= 0) {
      this.scenario = this.UserDetailModelService.selectedScenarioIndex;
    }

    this.initScenario(this.scenario);

    this.UserDetailModelService.updateBalanceSheetScenario.subscribe(() => {
      this.initScenario(this.UserDetailModelService.selectedScenarioIndex);
    });
  }
 initScenario(scenarioNumber?) {
    const ELEMENT_PL = [] as any;
    this.progressBar = true;

    if (scenarioNumber >= 0) {
      this.scenarioSelected = scenarioNumber;
      this.loadedScenario = 'Scenario ' + this.scenarioSelected;
    }

    this.apiService.getData(this.urlConfig.getdcfCompaniesAPI() + this.companySelected).subscribe(res => {
      console.log("DCF ASSUMPTINS", res);
	  
	  
      this.dcf = res;
    }, error => {
      console.log(error);
    });
	

    this.apiService
      .getData(
        this.urlConfig.getDCFAPI() +
        this.companySelected +
        '&scenario=' +
        this.scenarioSelected
      )
      .subscribe((res: any) => {
        for (let j = 0; j < res.length; j++) {
          this.financialObj.set(res[j].asof, {
            EBITDA: res[j].ebitda,
            DepreciationAmortization: res[j].da,
            EBIT: res[j].ebit,
            NetInterestExpense: res[j].netinterest,
            EBT: res[j].ebt,
            NOLsUtilized: res[j].nols,
            EBTPostNOLUtilization: res[j].ebtpostnol,
            CashTaxes: res[j].cashtaxes,
            EarningsBeforeInterestAfterTaxes: res[j].ebiat,
            DA: res[j].da,
            Capex: res[j].capex,
            ChangeinNetWorkingCapital: res[j].networkingcapitalchange,
            UnleveredFreeCashFlow: res[j].unleveredfreecash,
            Period: res[j].period,
           
            PresentFcf: res[j].presentfcf,
            PresentTerminalValue: res[j].presentterminalvalue,
            Total: res[j].presentfcf+res[j].presentterminalvalue,
			current:res[j].currentnetdebt,
					equity:res[j].equityvalue,
			
			Totla:res[j].totalenterprisevalue,
			
				afterTaxCostOfDebt:res[j].after_tax_debt_cost,
					costOfDebt:res[j].cost_of_debt,
					costOfEquity:res[j].cost_of_equity,
					debtEquity:res[j].debt_equity,
					debtToTotalCapitalization:res[j].debt_to_total_cap, 
					equityRiskPremium:res[j].equity_risk_premium,
					equityToTotalCapitalization:res[j].equity_to_total_cap,
					leveredBeta:res[j].levered_beta,
					riskFreeRate:res[j].risk_free_rate,
					taxRate:res[j].tax_rate,
					wacc:res[j].wacc,
					DiscountFactor: (1/(1+((res[j].wacc)/100))**res[j].period)*100,
					fpyebitdaexitmultiple:res[j].fpyebitdaexitmultiple,
					spyebitdaexitmultiple:res[j].spyebitdaexitmultiple,
					
          });
        }
		
		
		
		
		
		
		
		
		
		
		
		
		
        this.apiService
          .getData(this.urlConfig.getdcfscenarioAPI() + this.companySelected)
          .subscribe((res: any) => {
            this.scenarioArray = res.scenarios;
            this.UserDetailModelService.setScenarioNumber(this.scenarioArray);
            if (this.scenarioArray.includes(+this.scenarioSelected)) {
              this.loadedScenario = ('Scenario ' +
                this.scenarioSelected) as any;
              this.inprogress = true;
            } else {
              this.scenarioSelected = 0;
              this.loadedScenario = ('Scenario ' +
                this.scenarioSelected) as any;
              this.inprogress = true;
            }
            this.apiService
              .getData(
                this.urlConfig.getDCFAPI() +
                this.companySelected +
                '&scenario=' +
                this.scenarioSelected
              )
              .subscribe((res: any) => {
				  console.log("wacc",res);
                for (let j = 0; j < res.length; j++) {
					
                  this.financialObj.set(res[j].asof, {
                    EBITDA: res[j].ebitda,
                    DepreciationAmortization: res[j].da,
                    EBIT: res[j].ebit,
                    NetInterestExpense: res[j].netinterest,
                    EBT: res[j].ebt,
                    NOLsUtilized: res[j].nols,
                    EBTPostNOLUtilization: res[j].ebtpostnol,
                    CashTaxes: res[j].cashtaxes,
                    EarningsBeforeInterestAfterTaxes: res[j].ebiat,
                    DA: res[j].da,
                    Capex: res[j].capex,
                    ChangeinNetWorkingCapital: res[j].networkingcapitalchange,
                    UnleveredFreeCashFlow: res[j].unleveredfreecash,
                    Period: res[j].period,
                    //Total: res[j].valuationtotal,
					Totla:res[j].totalenterprisevalue,
					afterTaxCostOfDebt:res[j].after_tax_debt_cost,
					costOfDebt:res[j].cost_of_debt,
					costOfEquity:res[j].cost_of_equity,
					debtEquity:res[j].debt_equity,
					debtToTotalCapitalization:res[j].debt_to_total_cap, 
					equityRiskPremium:res[j].equity_risk_premium,
					equityToTotalCapitalization:res[j].equity_to_total_cap,
					leveredBeta:res[j].levered_beta,
					riskFreeRate:res[j].risk_free_rate,
					taxRate:res[j].tax_rate,
					wacc:res[j].wacc,
					DiscountFactor: (1/(1+((res[j].wacc)/100))**res[j].period)*100,
					current:res[j].currentnetdebt,
					PresentFcf: (res[j].unleveredfreecash)*((1/(1+((res[j].wacc)/100))**res[j].period)),
					PresentTerminalValue: res[j].presentterminalvalue,
					Total: (res[j].unleveredfreecash)*((1/(1+((res[j].wacc)/100))**res[j].period))+res[j].presentterminalvalue,
					equity:res[j].equityvalue,
					fpyebitdaexitmultiple:res[j].fpyebitdaexitmultiple,
					spyebitdaexitmultiple:res[j].spyebitdaexitmultiple,
					scenarioNumber: res[j].scenario,
					
					
                  });
				  
                }

                this.financialObj.forEach((v, k) => {
                  var pushData = {
                    inMillions: k,
                    EBITDA:
                      '$ ' + formatNumber(Number(v.EBITDA), 'en-US', '1.0-0'),
                    '(–) Depreciation & Amortization':
                      '$ ' +
                      formatNumber(
                        Number(v.DepreciationAmortization),
                        'en-US',
                        '1.0-0'
                      ),
                    EBIT: '$ ' + formatNumber(Number(v.EBIT), 'en-US', '1.0-0'),
                    '(+/–) Net Interest Expense':
                      '$ ' +
                      formatNumber(
                        Number(v.NetInterestExpense),
                        'en-US',
                        '1.0-0'
                      ),
                    EBT: '$ ' + formatNumber(Number(v.EBT), 'en-US', '1.0-0'),
                    '(–) NOLs Utilized':
                      '$ ' +
                      formatNumber(Number(v.NOLsUtilized), 'en-US', '1.0-0'),
                    'EBT Post NOL Utilization':
                      '$ ' +
                      formatNumber(
                        Number(v.EBTPostNOLUtilization),
                        'en-US',
                        '1.0-0'
                      ),
                    '(–) Cash Taxes':
                      '$ ' +
                      formatNumber(Number(v.CashTaxes), 'en-US', '1.0-0'),
                    'Earnings Before Interest After Taxes (EBIAT)':
                      '$ ' +
                      formatNumber(
                        Number(v.EarningsBeforeInterestAfterTaxes),
                        'en-US',
                        '1.0-0'
                      ),
                    '(+) Depreciation & Amortization':
                      '$ ' +
                      formatNumber(Number(v.DAmortization), 'en-US', '1.0-0'),
                    '(–) Capex':
                      '$ ' + formatNumber(Number(v.Capex), 'en-US', '1.0-0'),
                    '(+/–) Change in Net Working Capital':
                      '$ ' +
                      formatNumber(
                        Number(v.ChangeinNetWorkingCapital),
                        'en-US',
                        '1.0-0'
                      ),
                    'Unlevered Free Cash Flow':
                      '$ ' +
                      formatNumber(
                        Number(v.UnleveredFreeCashFlow),
                        'en-US',
                        '1.0-0'
                      ),
                    Period:
                      '$ ' + formatNumber(Number(v.period), 'en-US', '1.0-0'),
                    DiscountFactor:
                      '$ ' +
                      formatNumber(Number(v.discountfactor), 'en-US', '1.0-0'),
                    PresentFcf:
                      '$ ' +
                      formatNumber(Number(v.presentfcf), 'en-US', '1.0-0'),
                    PresentTerminalValue:
                      '$ ' +
                      formatNumber(
                        Number(v.presentterminalvalue),
                        'en-US',
                        '1.0-0'
                      ),
                    Total:
                      '$ ' +
                      formatNumber(Number(v.valuationtotal), 'en-US', '1.0-0'),
                  };
                  ELEMENT_PL.push(pushData);
                });
                ELEMENT_PL_PDF = ELEMENT_PL;
                this.displayedColumns = ['0'].concat(
                  ELEMENT_PL.map((x) => x.inMillions.toString())
                );
                this.displayData = this.inputColumns.map((x) =>
                  formatInputRow(x)
                );
                this.progressBar = false;
                const obj = {};
                this.financialObj.forEach((value, key) => {
                  obj[key] = value;
                });
                this.years = Object.keys(obj);
				console.log("years",this.years);
                this.financials = Object.values(obj);
				console.log("financials",this.financials);
              }); //end of projections
			  
          }); //end of Save Scenarios
      }); //end of actuals
    function formatInputRow(row) {
      const output = {};
      output[0] = row;
      for (let i = 0; i < ELEMENT_PL.length; ++i) {
        output[ELEMENT_PL[i].inMillions] = ELEMENT_PL[i][row];
      }
      return output;
    }
  }




  saveScenario() {
    this.apiService
      .getData(this.urlConfig.getdcfscenarioAPI() + this.companySelected)
      .subscribe((res: any) => {
        if (this.scenarioSelected == 0) {
          this.saveScenarioNumber = res.scenarios.length;
          this.scenarioSelected = res.scenarios.length;
        } else {
          this.saveScenarioNumber = this.scenarioSelected;
        }

        this.loadedScenario = ('Scenario ' + this.scenarioSelected) as any;
        console.log("finals",this.financialObj);
		const inputArray = [];
        for (const [key, value] of this.financialObj) {
          const inputObj: any = {};
          
			inputObj.companyname = this.companySelected;
			inputObj.asof = key.toString();
            inputObj.wacc = this.financialObj.get(key).wacc;
			inputObj.period = this.financialObj.get(key).Period;
			//inputObj.scenario = this.saveScenarioNumber;
			inputObj.ebitda=this.financialObj.get(key).EBITDA;
			inputObj.scenario = this.scenario;
			 inputObj.da= this.financialObj.get(key).DepreciationAmortization,
            inputObj.ebit=this.financialObj.get(key).EBIT,
            inputObj.netinterest= this.financialObj.get(key).NetInterestExpense,
            inputObj.ebt= this.financialObj.get(key).EBT,
            inputObj.nols= this.financialObj.get(key).NOLsUtilized,
            inputObj.ebtpostnol= this.financialObj.get(key).EBTPostNOLUtilization,
            inputObj.cashtaxes= this.financialObj.get(key).CashTaxes,
            inputObj.ebiat= this.financialObj.get(key).EarningsBeforeInterestAfterTaxes,
            inputObj.da= this.financialObj.get(key).DA,
            inputObj.capex=this.financialObj.get(key).Capex,
            inputObj.networkingcapitalchange= this.financialObj.get(key).ChangeinNetWorkingCapital,
            inputObj.unleveredfreecash= this.financialObj.get(key).UnleveredFreeCashFlow,
            
           
            inputObj.presentfcf= this.financialObj.get(key).PresentFcf,
            inputObj.presentterminalvalue= this.financialObj.get(key).PresentTerminalValue,
            inputObj.valuationtotal= this.financialObj.get(key).Total,
			inputObj.currentnetdebt=this.financialObj.get(key).current,
			inputObj.equityvalue=this.financialObj.get(key).equity,
			
			inputObj.totalenterprisevalue=this.financialObj.get(key).Totla,
			inputObj.DiscountFactor= (1/(1+((inputObj.wacc)/100))**inputObj.Period)*100;
			//inputObj.DiscountFactor = this.financialObj.get(key).DiscountFactor;
			inputObj.fpyebitdaexitmultiple=this.financialObj.get(key).fpyebitdaexitmultiple,
					inputObj.spyebitdaexitmultiple=this.financialObj.get(key).spyebitdaexitmultiple,
            inputArray.push(inputObj);
            console.log('Json stringify', inputArray);
        
        }
		
        this.apiService
          .postData(
            this.urlConfig.getdcfPOST() + this.companySelected,
            JSON.stringify(inputArray)
          )
          .subscribe((res: any) => {
            console.log(inputArray);
            console.log('latest', res);
            if (res.message == 'Success') {
              this._snackBar.openFromComponent(uploadSnackBarDCFComponent, {
                duration: 5000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
            } else {
              this._snackBar.openFromComponent(
                uploadFailureSnackBarDCFComponent,
                {
                  duration: 5000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                }
              );
            }
          });
        this.initScenario(this.scenarioSelected);
      });
  }

  addScenario() {
    const existingScenarios = this.UserDetailModelService.getScenarioNumber();
    if (existingScenarios.length < 9) {
      this.scenario = existingScenarios.length;
      this._snackBar.openFromComponent(uploadSnackBarDCFAddComponent, {
        duration: 5000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      //loading default scenario
      this.initScenario(0);
    } else {
      this._snackBar.openFromComponent(uploadFailureSnackBarDCFAddComponent, {
        duration: 5000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

openPopUpModal(content) {
    this.modalService.open(content, { centered: true });
  }

  getWaccValue(value){
    value = (value );
    return value;
  }

  assignValueToDCFAssumptions(event){
	  console.log("event",event);
    const editedValue = event;
for (const [key, value] of this.financialObj) {
   this.financialObj.get(key).wacc = editedValue;
}
  }

  loadScenario(index: number) {
    this.loadedScenario = 'Scenario ' + 'index';
    this.scenario = index;
    this.ngOnInit();
  }
  
 exportToPdf1(){

    const content = [];
    html2canvas(this.firstBlock.nativeElement).then(canvas1 => {
      const canvasData1 = canvas1.toDataURL();
      content.push({
        image: canvasData1,
        width: 500,
        })

        html2canvas(this.unleveredFreeCashFlow.nativeElement).then(canvas2 => {
          content.push({
            image: canvas2.toDataURL(),
            width: 500,
            })

            html2canvas(this.valuations.nativeElement).then(canvas3 => {
              content.push({
                image: canvas3.toDataURL(),
                width: 500,
                })

                html2canvas(this.valSummary.nativeElement).then(canvas4 => {
                  content.push({
                    image: canvas4.toDataURL(),
                    width: 200,
                    })
                    let docDefinition = {
                      content: content
                    };
              
                  pdfMake.createPdf(docDefinition).download('RMI_Insights_Export_'+this.companySelected+'_'+ '.pdf');

                })
            })
        })
    });

  }
 
  
}
@Component({
  selector: 'snackBar',
  templateUrl: 'snackBar.html',
  styles: [
    `
      .snackBar {
        color: #fff;
      }
      b {
        color: #fff !important;
      }
      .material-icons {
        color: lightgreen;
      }
    `,
  ],
})
export class uploadSnackBarDCFComponent {
  scenarioBanner = localStorage.getItem('scenarioSelected');
}

@Component({
  selector: 'snackBar',
  templateUrl: 'snackBar.html',
  styles: [
    `
      .snackBar {
        color: #fff;
      }
      b {
        color: #fff !important;
      }
      .material-icons {
        color: lightgreen;
      }
    `,
  ],
})
export class uploadFailureSnackBarDCFComponent {
  scenarioBanner = localStorage.getItem('scenarioSelected');
}

@Component({
  selector: 'snackBarAddScenario',
  templateUrl: 'snackBarAddScenario.html',
  styles: [
    `
      .snackBar {
        color: #fff;
      }
      b {
        color: #fff !important;
      }
      .material-icons {
        color: lightgreen;
      }
    `,
  ],
})
export class uploadSnackBarDCFAddComponent {
  scenarioBanner = localStorage.getItem('scenarioSelected');
}

@Component({
  selector: 'snackBarAddScenarioFailure',
  templateUrl: 'snackBarAddScenarioFailure.html',
  styles: [
    `
      .snackBar {
        color: #fff;
      }
      b {
        color: #fff !important;
      }
      .material-icons {
        color: lightgreen;
      }
    `,
  ],
})
export class uploadFailureSnackBarDCFAddComponent {
  scenarioBanner = localStorage.getItem('scenarioSelected');
}

