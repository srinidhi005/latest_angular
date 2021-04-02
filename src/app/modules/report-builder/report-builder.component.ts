import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ReportBuilderService } from 'src/app/shared/report-builder.service';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { formatNumber } from '@angular/common';
import html2canvas from 'html2canvas';
import { LoadingPopupComponent } from '../loading-popup/loading-popup.component';
import { MatDialog } from '@angular/material';


export interface PLElement {
  inMillions: number;
  EBITDA: string;
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
  Period: string;
  DiscountFactor: string;
  wacc: string;
}

let ELEMENT_PL_PDF: PLElement[] = [];

@Component({
  selector: 'app-report-builder',
  templateUrl: './report-builder.component.html',
  styleUrls: ['./report-builder.component.scss'],
})
export class ReportBuilderComponent implements OnInit {
  constructor(
    private urlConfig: UrlConfigService,
    private apiService: RMIAPIsService,
    private dialog: MatDialog,
    public reportService: ReportBuilderService
  ) {}

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
    'wacc',
  ];
  displayedColumns: string[] = [];
  displayData: any[];

  myControl = new FormControl();

  @ViewChild('imagecanvas', { static: false }) imagecanvas: ElementRef;

  filteredOptions: Observable<any>;
  allCompanies = [];

  selectedScenarioForDisplay = -1;

  selectedScenario;

  selectedCompany: any = {};
  selectedCompanyScenarios = [];

  companyLoaded = true;

  showValuations = false;

  dcf;
  @ViewChild('firstBlock', { static: false }) firstBlock: ElementRef;
  valuationSummary;
  @ViewChild('unleveredFreeCashFlow', { static: false })
  unleveredFreeCashFlow: ElementRef;
  @ViewChild('valuations', { static: false }) valuations: ElementRef;
  @ViewChild('valuationSummary', { static: false }) valSummary: ElementRef;

  // reportTitle = "";
  nickname;
  showScenario = false;

  ngOnInit(): void {
    this.nickname = localStorage.getItem('nickname');

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(),
      map((value) => (typeof value === 'string' ? value : '')),
      map((name) => (name ? this._filter(name) : this.allCompanies.slice()))
    );

    this.loadCompanies();
  }

  async loadCompanies() {
    try {
      const companiesAPIData: any = await this.apiService
        .getData(this.urlConfig.getStatementAPI() + 'rmiinsights')
        .toPromise();
      this.allCompanies = companiesAPIData.map((comp) => {
        return { compName: comp.companyname, compActualName: comp.company };
      });
      // .splice(0, 10)
    } catch (error) {
      console.log('Failed to fetch Statements data', error);
    }
  }

  loadSelectedMetric(srcObj, selectedMetric) {
    console.log(srcObj, selectedMetric);
    srcObj.selectedMetric = selectedMetric;
  }

  loadCompany(comp) {
    this.companyLoaded = false;
    this.showScenario = false;

    this.selectedCompany = comp;

    this.getScenariosForCompany(comp);
    // this.selectedScenario = -1;
  }

  async getScenariosForCompany(comp) {
    try {
      const scenarios: any = await this.apiService
        .getData(this.urlConfig.getScenarioAPI() + comp.compName)
        .toPromise();
      this.selectedCompanyScenarios = scenarios.scenarios;
      this.companyLoaded = true;
      this.showScenario = true;
    } catch (error) {
      console.log('failed to fetch Scenarios for Comp One', error);
      this.companyLoaded = true;
      this.showScenario = true;
    }
  }

  loadScenario(scenarioNumber) {
    this.selectedScenario = scenarioNumber;
    this.selectedScenarioForDisplay = -1;
  }

  displayFn(user): string {
    return user && user.compName ? user.compName : '';
  }

  private _filter(name: string) {
    const filterValue = name.toLowerCase();
    return this.allCompanies.filter(
      (option) => option.compName.toLowerCase().indexOf(filterValue) >= 0
    );
  }

  async buildReport() {

    const selectionExists = this.reportSelection.find( r => r.isSelected == true)

    if(selectionExists && this.reportSelection &&
      this.selectedCompany &&
      this.selectedCompany['compName'] &&
      this.selectedScenario >= 0){
      this.reportService.message = "Download is in Progress. Please Wait!"
    this.dialog.open(LoadingPopupComponent, { disableClose: true });

    var canvas = document.createElement('canvas');
    canvas.width = this.imagecanvas.nativeElement.width;
    canvas.height = this.imagecanvas.nativeElement.height;
    canvas.getContext('2d').drawImage(this.imagecanvas.nativeElement, 0, 0);
    const imagermi = canvas.toDataURL('image/png');

    await this.initScenario(this.selectedScenario);
    this.showValuations = true;

    setTimeout(() => {
      this.exportToPdf1(imagermi);
    }, 1500);
    }
    
  }

  async initScenario(selectedScenario) {
    const ELEMENT_PL = [] as any;

    try {
      const comps = await this.apiService
        .getData(
          this.urlConfig.getdcfCompaniesAPI() + this.selectedCompany.compName
        )
        .toPromise();
      this.dcf = comps;
    } catch (error) {}

    let resp1;
    try {
      resp1 = await this.apiService
        .getData(
          this.urlConfig.getDCFAPI() +
            this.selectedCompany.compName +
            '&scenario=' +
            this.selectedScenario
        )
        .toPromise();
    } catch (error) {}
    for (let j = 0; j < resp1.length; j++) {
      this.financialObj.set(resp1[j].asof, {
        EBITDA: resp1[j].ebitda,
        DepreciationAmortization: resp1[j].da,
        EBIT: resp1[j].ebit,
        NetInterestExpense: resp1[j].netinterest,
        EBT: resp1[j].ebt,
        NOLsUtilized: resp1[j].nols,
        EBTPostNOLUtilization: resp1[j].ebtpostnol,
        CashTaxes: resp1[j].cashtaxes,
        EarningsBeforeInterestAfterTaxes: resp1[j].ebiat,
        DA: resp1[j].da,
        Capex: resp1[j].capex,
        ChangeinNetWorkingCapital: resp1[j].networkingcapitalchange,
        UnleveredFreeCashFlow: resp1[j].unleveredfreecash,
        Period: resp1[j].period,

        PresentFcf: resp1[j].presentfcf,
        PresentTerminalValue: resp1[j].presentterminalvalue,
        Total: resp1[j].presentfcf + resp1[j].presentterminalvalue,
        current: resp1[j].currentnetdebt,
        equity: resp1[j].equityvalue,

        Totla: resp1[j].totalenterprisevalue,

        afterTaxCostOfDebt: resp1[j].after_tax_debt_cost,
        costOfDebt: resp1[j].cost_of_debt,
        costOfEquity: resp1[j].cost_of_equity,
        debtEquity: resp1[j].debt_equity,
        debtToTotalCapitalization: resp1[j].debt_to_total_cap,
        equityRiskPremium: resp1[j].equity_risk_premium,
        equityToTotalCapitalization: resp1[j].equity_to_total_cap,
        leveredBeta: resp1[j].levered_beta,
        riskFreeRate: resp1[j].risk_free_rate,
        taxRate: resp1[j].tax_rate,
        wacc: resp1[j].wacc,
        DiscountFactor:
          (1 / (1 + resp1[j].wacc / 100) ** resp1[j].period) * 100,
        fpyebitdaexitmultiple: resp1[j].fpyebitdaexitmultiple,
        spyebitdaexitmultiple: resp1[j].spyebitdaexitmultiple,
      });
    }

    let res;

    try {
      res = await this.apiService
        .getData(
          this.urlConfig.getDCFAPI() +
            this.selectedCompany.compName +
            '&scenario=' +
            this.selectedScenario
        )
        .toPromise();
    } catch (error) {}
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
        Totla: res[j].totalenterprisevalue,
        afterTaxCostOfDebt: res[j].after_tax_debt_cost,
        costOfDebt: res[j].cost_of_debt,
        costOfEquity: res[j].cost_of_equity,
        debtEquity: res[j].debt_equity,
        debtToTotalCapitalization: res[j].debt_to_total_cap,
        equityRiskPremium: res[j].equity_risk_premium,
        equityToTotalCapitalization: res[j].equity_to_total_cap,
        leveredBeta: res[j].levered_beta,
        riskFreeRate: res[j].risk_free_rate,
        taxRate: res[j].tax_rate,
        wacc: res[j].wacc,
        DiscountFactor: (1 / (1 + res[j].wacc / 100) ** res[j].period) * 100,
        current: res[j].currentnetdebt,
        PresentFcf:
          res[j].unleveredfreecash *
          (1 / (1 + res[j].wacc / 100) ** res[j].period),
        PresentTerminalValue: res[j].presentterminalvalue,
        Total:
          res[j].unleveredfreecash *
            (1 / (1 + res[j].wacc / 100) ** res[j].period) +
          res[j].presentterminalvalue,
        equity: res[j].equityvalue,
        fpyebitdaexitmultiple: res[j].fpyebitdaexitmultiple,
        spyebitdaexitmultiple: res[j].spyebitdaexitmultiple,
        scenarioNumber: res[j].scenario,
      });
    }

    this.financialObj.forEach((v, k) => {
      var pushData = {
        inMillions: k,
        EBITDA: '$ ' + formatNumber(Number(v.EBITDA), 'en-US', '1.0-0'),
        '(–) Depreciation & Amortization':
          '$ ' +
          formatNumber(Number(v.DepreciationAmortization), 'en-US', '1.0-0'),
        EBIT: '$ ' + formatNumber(Number(v.EBIT), 'en-US', '1.0-0'),
        '(+/–) Net Interest Expense':
          '$ ' + formatNumber(Number(v.NetInterestExpense), 'en-US', '1.0-0'),
        EBT: '$ ' + formatNumber(Number(v.EBT), 'en-US', '1.0-0'),
        '(–) NOLs Utilized':
          '$ ' + formatNumber(Number(v.NOLsUtilized), 'en-US', '1.0-0'),
        'EBT Post NOL Utilization':
          '$ ' +
          formatNumber(Number(v.EBTPostNOLUtilization), 'en-US', '1.0-0'),
        '(–) Cash Taxes':
          '$ ' + formatNumber(Number(v.CashTaxes), 'en-US', '1.0-0'),
        'Earnings Before Interest After Taxes (EBIAT)':
          '$ ' +
          formatNumber(
            Number(v.EarningsBeforeInterestAfterTaxes),
            'en-US',
            '1.0-0'
          ),
        '(+) Depreciation & Amortization':
          '$ ' + formatNumber(Number(v.DAmortization), 'en-US', '1.0-0'),
        '(–) Capex': '$ ' + formatNumber(Number(v.Capex), 'en-US', '1.0-0'),
        '(+/–) Change in Net Working Capital':
          '$ ' +
          formatNumber(Number(v.ChangeinNetWorkingCapital), 'en-US', '1.0-0'),
        'Unlevered Free Cash Flow':
          '$ ' +
          formatNumber(Number(v.UnleveredFreeCashFlow), 'en-US', '1.0-0'),
        Period: '$ ' + formatNumber(Number(v.period), 'en-US', '1.0-0'),
        DiscountFactor:
          '$ ' + formatNumber(Number(v.discountfactor), 'en-US', '1.0-0'),
        PresentFcf: '$ ' + formatNumber(Number(v.presentfcf), 'en-US', '1.0-0'),
        PresentTerminalValue:
          '$ ' + formatNumber(Number(v.presentterminalvalue), 'en-US', '1.0-0'),
        Total: '$ ' + formatNumber(Number(v.valuationtotal), 'en-US', '1.0-0'),
      };
      ELEMENT_PL.push(pushData);
    });
    ELEMENT_PL_PDF = ELEMENT_PL;
    this.displayedColumns = ['0'].concat(
      ELEMENT_PL.map((x) => x.inMillions.toString())
    );
    this.displayData = this.inputColumns.map((x) => formatInputRow(x));
    this.progressBar = false;
    const obj = {};
    this.financialObj.forEach((value, key) => {
      obj[key] = value;
    });
    this.years = Object.keys(obj);
    console.log('years', this.years);
    this.financials = Object.values(obj);
    console.log('financials', this.financials);
    function formatInputRow(row) {
      const output = {};
      output[0] = row;
      for (let i = 0; i < ELEMENT_PL.length; ++i) {
        output[ELEMENT_PL[i].inMillions] = ELEMENT_PL[i][row];
      }
      return output;
    }
  }

  exportToPdf1(imagermi) {
    const content = [];

    content.push({ 
      image: imagermi, width: 130, height: 60, pageOrientation: "landscape",
  })
    content.push({
      text: "Valuations",
      style: 'header',
      pageOrientation: "landscape",

    })

    content.push({
      text:
        this.selectedCompany.compName + " - " + "Scenario "  + this.selectedScenario,
        style: 'subheader',
        pageOrientation: "landscape",
    })
    html2canvas(this.firstBlock.nativeElement).then((canvas1) => {
      const canvasData1 = canvas1.toDataURL();
      content.push({
        image: canvasData1,
        width: 900,
        pageOrientation: "landscape",
        margin: [30, 10, 30, 10]
        // height: 470
      });


      html2canvas(this.unleveredFreeCashFlow.nativeElement).then((canvas2) => {
        content.push({
          image: canvas2.toDataURL(),
          width: 850,
          pageOrientation: "landscape",
          margin: [30, 10, 30, 10]
          // height: 430
        });

        // this.unleveredFreeCashFlow.nativeElement.style.display = "none"


        html2canvas(this.valuations.nativeElement).then((canvas3) => {
          content.push({
            image: canvas3.toDataURL(),
            width: 850,
            pageOrientation: "landscape",
            margin: [30, 10, 30, 10]
            // height: 220
          });

          // this.valuations.nativeElement.style.display = "none"

          html2canvas(this.valSummary.nativeElement).then((canvas4) => {
            content.push({
              image: canvas4.toDataURL(),
              width: 400,
              pageOrientation: "landscape",
              pageBreak: 'after',
              margin: [30, 10, 30, 10]
            });

            

            // this.valSummary.nativeElement.style.display = "none"

            this.showValuations = false;
            if (
              this.reportSelection &&
              this.selectedCompany &&
              this.selectedCompany['compName'] &&
              this.selectedScenario >= 0
            ) {
              this.reportService.initReportBuild(
                this.reportSelection,
                this.selectedCompany,
                this.selectedScenario,
                imagermi,
                content
              );
            }

          });
        });
      });
    });
  }

  reportSelection = [
    {
      selectedMetric: {
        key: 'all',
        name: 'All',
      },
      metrics: [
        {
          key: 'all',
          name: 'All',
        },
        {
          key: 'incomeStatement',
          name: 'Income Statement',
        },
        {
          key: 'balanceSheet',
          name: 'Balance Sheet',
        },
        {
          key: 'cashflow',
          name: 'Cash Flow Statement',
        },
      ],
      isSelected: false,
      name: 'Financial Statements',
    },
    {
      selectedMetric: {
        key: 'all',
        name: 'All',
      },
      metrics: [
        {
          key: 'all',
          name: 'All ',
        },
        {
          key: 'incomeStatement',
          name: 'Income Statement',
        },
        {
          key: 'balanceSheet',
          name: 'Balance Sheet',
        },
        {
          key: 'cashflow',
          name: 'Cash Flow Statement',
        },
      ],
      isSelected: false,
      name: 'KPI',
    },
    {
      selectedMetric: {
        key: 'all',
        name: 'All',
      },
      metrics: [
        {
          key: 'all',
          name: 'All ',
        },
        {
          key: 'profitabilityRatios',
          name: 'Profitability Ratios',
        },
        {
          key: 'returnRatios',
          name: 'Return Ratios',
        },
        {
          key: 'liquidityRatios',
          name: 'Liquidity Ratios',
        },
        {
          key: 'solvencyRatios',
          name: 'Solvency Ratios',
        },
      ],
      isSelected: false,
      name: 'Ratios',
    },
    {
      isSelected: false,
      name: 'Valuations',
    },
    {
      isSelected: false,
      name: 'Financial Health Scorecard',
    },
  ];
}
