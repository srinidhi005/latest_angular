import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import { UserDetailModelService } from 'src/app/shared/user-detail-model.service';
import { ExcelService } from 'src/app/shared/excel.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
//import * as XLSX from 'xlsx';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { formatNumber } from '@angular/common';
import { AuthService } from 'src/app/auth.service';

export interface PLElement {
  inMillions: number;
  'Total Revenue': string;
  'Revenue Y-O-Y Growth rate': string;
  '(-) Cost of Goods Sold (COGS)': string;
  'Gross Profit': string;
  'Gross Margin': string;
  '(-) Selling, General & Administrative Expense (SG&A)': string;
  EBIT: string;
  'EBIT Margin': string;
  '(+) Depreciation & Amortization (D&A)': string;
  EBITDA: string;
  'EBITDA Margin': string;
  '(-) Net Interest/Other Income Expense': string;
  EBT: string;
  'EBT Margin': string;
  '(-) Taxes': string;
  'Net Income': string;
  'Net Income Margin': string;
}

let ELEMENT_PL_PDF: PLElement[] = [];

@Component({
  selector: 'app-plmetrics',
  templateUrl: './plmetrics.component.html',
  styleUrls: ['./plmetrics.component.scss'],
})
export class PLMetricsComponent implements OnInit {
  @ViewChild('imagecanvas', { static: true }) imagecanvas: ElementRef;
  scenarioArray = [];
  scenario = this.UserDetailModelService.getSelectedScenario();
  companyName = this.UserDetailModelService.getSelectedCompany();
  financialObj = new Map();
  progressBar: boolean;
  years = [];
  financials = [];

  inputColumns = [
    'inMillions',
    'Total Revenue',
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
    'Net Income Margin',
  ];
  displayedColumns: string[] = [];
  displayData: any[];
  companySelected = localStorage.getItem('companySelected');
  selectedCompanyName = localStorage.getItem('selectedCompanyName');
  scenarioName = 'Scenario 0';

  metricsLoaded = false;

  constructor(
    private urlConfig: UrlConfigService,
    private apiService: RMIAPIsService,
    public authService: AuthService,
    private UserDetailModelService: UserDetailModelService,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    if (this.authService.authServiceLoaded) {
      const ELEMENT_PL: PLElement[] = [];
      this.progressBar = true;
      var previousAmount;


      this.apiService.getData(this.urlConfig.getScenarioAPI() + this.companySelected).subscribe( res => {
        console.log("Successfully fetched scenarios for company " + this.companySelected, res);
  
        this.scenarioArray = res[this.companySelected] || [];
        this.UserDetailModelService.setScenarioNumber(this.scenarioArray);
        let scenarioNumber = 0;
        if (this.scenarioArray.includes(this.scenario)) {
          scenarioNumber = this.scenario;
        }
  
        this.apiService.getData(this.urlConfig.getActualsProjectionsForIS() + this.companySelected + "&scenario=" + scenarioNumber).subscribe( (success: any) => {
          console.log("Succesfully fetched projections and actuals for company " + this.companySelected, success);
          if(success.result && success.result.actuals && success.result.projections){
            const actualsData = JSON.parse(success.result.actuals);
            const projectionsData = JSON.parse(success.result.projections);
  
            for (let j = 0; j < actualsData.length; j++) {
              if (actualsData[j].latest === 0) {
                previousAmount = actualsData[j].totalrevenue;
              }
              this.financialObj.set(actualsData[j].asof, {
                totalRevenue: actualsData[j].totalrevenue,
                revenuepercent: actualsData[j].revenuepercent,
                COGS: actualsData[j].cogs,
                GrossProfit: actualsData[j].grossprofit,
                GrossMargin: actualsData[j].grossprofitmargin,
                SGA: actualsData[j].sga,
                EBIT: actualsData[j].ebit,
                EBITMargin: actualsData[j].ebitmargin,
                DandA: actualsData[j].da,
                EBITDA: actualsData[j].ebitda,
                EBITDAMargin: actualsData[j].ebitdamargin,
                EBT: actualsData[j].ebt,
                EBTMargin: actualsData[j].ebtmargin,
                Taxes: actualsData[j].taxes,
                netIterestExpense: actualsData[j].netinterest,
                NetIncome: actualsData[j].netincome,
                NetIncomeMargin: actualsData[j].netincomemargin,
              });
            }
  
            let totalRevenue = 0;
            for (let j = 0; j < projectionsData.length; j++) {
              if (j == 0) {
                totalRevenue = Math.round(
                  previousAmount +
                    previousAmount * (projectionsData[j].revenuepercent / 100)
                );
              } else {
                totalRevenue = Math.round(
                  projectionsData[j - 1].totalRevenue +
                    projectionsData[j - 1].totalRevenue * (projectionsData[j].revenuepercent / 100)
                );
              }
              this.financialObj.set(projectionsData[j].asof, {
                totalRevenue: projectionsData[j].totalrevenue,
                revenuepercent: projectionsData[j].revenuepercent,
                COGS: projectionsData[j].cogs,
                GrossProfit: projectionsData[j].grossprofit,
                GrossMargin: projectionsData[j].grossprofitmargin,
                SGA: projectionsData[j].sga,
                EBIT: projectionsData[j].ebit,
                EBITMargin: projectionsData[j].ebitmargin,
                DandA: projectionsData[j].da,
                EBITDA: projectionsData[j].ebitda,
                EBITDAMargin: projectionsData[j].ebitdamargin,
                EBT: projectionsData[j].ebt,
                EBTMargin: projectionsData[j].ebtmargin,
                Taxes: projectionsData[j].taxes,
                netIterestExpense: projectionsData[j].netinterestdollars,
                NetIncome: projectionsData[j].netincome,
                NetIncomeMargin: projectionsData[j].netincomemargin,
              });
            }
  
            this.financialObj.forEach((v, k) => {
              var pushData = {
                inMillions: k,
                'Total Revenue':
                  '$ ' +
                  formatNumber(Number(v.totalRevenue), 'en-US', '1.0-0'),
                'Revenue Y-O-Y Growth rate': v.revenuepercent + '%',
                '(-) Cost of Goods Sold (COGS)':
                  '$ ' + formatNumber(Number(v.COGS), 'en-US', '1.0-0'),
                'Gross Profit':
                  '$ ' +
                  formatNumber(Number(v.GrossProfit), 'en-US', '1.0-0'),
                'Gross Margin': v.GrossMargin + '%',
                '(-) Selling, General & Administrative Expense (SG&A)':
                  '$ ' + formatNumber(Number(v.SGA), 'en-US', '1.0-0'),
                EBIT:
                  '$ ' + formatNumber(Number(v.EBIT), 'en-US', '1.0-0'),
                'EBIT Margin': v.EBITMargin + '%',
                '(+) Depreciation & Amortization (D&A)':
                  '$ ' + formatNumber(Number(v.DandA), 'en-US', '1.0-0'),
                EBITDA:
                  '$ ' + formatNumber(Number(v.EBITDA), 'en-US', '1.0-0'),
                'EBITDA Margin': v.EBITDAMargin + '%',
                '(-) Net Interest/Other Income Expense':
                  '$ ' +
                  formatNumber(
                    Number(v.netIterestExpense),
                    'en-US',
                    '1.0-0'
                  ),
                EBT: '$ ' + formatNumber(Number(v.EBT), 'en-US', '1.0-0'),
                'EBT Margin': v.EBTMargin + '%',
                '(-) Taxes':
                  '$ ' + formatNumber(Number(v.Taxes), 'en-US', '1.0-0'),
                'Net Income':
                  '$ ' +
                  formatNumber(Number(v.NetIncome), 'en-US', '1.0-0'),
                'Net Income Margin': v.NetIncomeMargin + '%',
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
            this.financials = Object.values(obj);
            this.metricsLoaded = true;
            
          }
          else{
            throw new Error();
          }
          
        }, error => {
          this.metricsLoaded = true;
          console.log("Failed to fetch projections and actuals for company " + this.companySelected, error);
        })
  
      }, error => {
        this.metricsLoaded = true;
        console.log("Failed to fetch scenarios for company " + this.companySelected, error)
      })

      function formatInputRow(row) {
        const output = {};
        output[0] = row;
        for (let i = 0; i < ELEMENT_PL.length; ++i) {
          output[ELEMENT_PL[i].inMillions] = ELEMENT_PL[i][row];
        }
        return output;
      }
    } else {
      const intervalID = setInterval(() => {
        if (this.authService.authServiceLoaded) {
          this.ngOnInit();
          clearInterval(intervalID);
        }
      }, 100);
    }
  }

  loadScenario(index: number) {
    this.scenarioName = 'Scenario ' + index;
    this.scenario = index;
    this.ngOnInit();
  }

  exportToXLSX() {
    console.log('Finanials', this.financials);

    this.years.forEach((year) => {
      year = ' ' + year;
    });

    const keys = ['in millions'].concat(this.years);
    const data = [];

    data.push(this.prepareJsonForExport(keys, 'totalRevenue', 'Total Revenue'));
    data.push(
      this.prepareJsonForExport(
        keys,
        'revenuepercent',
        'Revenue Y-O-Y Growth rate',
        true
      )
    );
    data.push(
      this.prepareJsonForExport(keys, 'COGS', '(-) Cost of Goods Sold (COGS) ')
    );
    data.push(this.prepareJsonForExport(keys, 'GrossProfit', 'Gross Profit '));
    data.push(
      this.prepareJsonForExport(keys, 'GrossMargin', 'Gross Margin', true)
    );
    data.push(
      this.prepareJsonForExport(
        keys,
        'SGA',
        '(-) Selling, General & Administrative Expense (SG&A)'
      )
    );
    data.push(this.prepareJsonForExport(keys, 'EBIT', 'EBIT'));
    data.push(
      this.prepareJsonForExport(keys, 'EBITMargin', 'EBIT Margin', true)
    );
    data.push(
      this.prepareJsonForExport(
        keys,
        'DandA',
        '(+) Depreciation & Amortization (D&A)'
      )
    );
    data.push(this.prepareJsonForExport(keys, 'EBITDA', 'EBITDA'));
    data.push(
      this.prepareJsonForExport(keys, 'EBITDAMargin', 'EBITDA Margin', true)
    );
    data.push(this.prepareJsonForExport(keys, 'EBIT', 'EBIT')); // check this.
    data.push(
      this.prepareJsonForExport(
        keys,
        'netIterestExpense',
        '(-) Net Interest/Other Income Expense'
      )
    );
    data.push(this.prepareJsonForExport(keys, 'EBT', 'EBT'));
    data.push(this.prepareJsonForExport(keys, 'EBTMargin', 'EBT Margin', true));
    data.push(this.prepareJsonForExport(keys, 'Taxes', '(-) Taxes'));
    data.push(this.prepareJsonForExport(keys, 'NetIncome', 'Net Income'));
    data.push(
      this.prepareJsonForExport(
        keys,
        'NetIncomeMargin',
        'Net Income Margin',
        true
      )
    );

    console.log(data);

    this.excelService.exportAsExcelFile(
      data,
      'Income Statement',
      keys,
      this.selectedCompanyName,
      this.scenarioName
    );
  }

  prepareJsonForExport(keys, parameter, label, isPercent?) {
    const jsonObject = {};

    keys.forEach((key, index) => {
      if (index == 0) {
        jsonObject[key] = label;
      } else {
        if (isPercent) {
          jsonObject[key] = +(this.financials[index - 1][parameter] / 100);
        } else {
          jsonObject[key] = +this.financials[index - 1][parameter];
        }
      }
    });

    return jsonObject;
  }

  exportToPDF() {
    //let doc = new jsPDF('l','pt');
    let data = [];
    let inMillionsYear = [];
    let totalRevenue = [];
    let revenueGrowthRate = [];
    let COGS = [];
    let grossProfit = [];
    let grossMargin = [];
    let SGA = [];
    let EBIT = [];
    let EBITMargin = [];
    let DA = [];
    let EBITDA = [];
    let EBITDAMargin = [];
    let NIE = [];
    let EBT = [];
    let EBTMargin = [];
    let taxes = [];
    let netIncome = [];
    let netIncomeMargin = [];
    ELEMENT_PL_PDF.forEach((obj) => {
      inMillionsYear.push(obj['inMillions']);
      totalRevenue.push(obj['Total Revenue']);
      revenueGrowthRate.push(obj['Revenue Y-O-Y Growth rate']);
      COGS.push(obj['(-) Cost of Goods Sold (COGS)']);
      grossProfit.push(obj['Gross Profit']);
      grossMargin.push(obj['Gross Margin']);
      SGA.push(obj['(-) Selling, General & Administrative Expense (SG&A)']);
      EBIT.push(obj['EBIT']);
      EBITMargin.push(obj['EBIT Margin']);
      DA.push(obj['(+) Depreciation & Amortization (D&A)']);
      EBITDA.push(obj['EBITDA']);
      EBITDAMargin.push(obj['EBITDA Margin']);
      NIE.push(obj['(-) Net Interest/Other Income Expense']);
      EBT.push(obj['EBT']);
      EBTMargin.push(obj['EBT Margin']);
      taxes.push(obj['(-) Taxes']);
      netIncome.push(obj['Net Income']);
      netIncomeMargin.push(obj['Net Income Margin']);
    });
    inMillionsYear.unshift('Years');
    totalRevenue.unshift('Total Revenue');
    revenueGrowthRate.unshift('Revenue Y-O-Y Growth rate');
    COGS.unshift('(-) Cost of Goods Sold (COGS)');
    grossProfit.unshift('Gross Profit');
    grossMargin.unshift('Gross Margin');
    SGA.unshift('(-) Selling, General & Administrative Expense (SG&A)');
    EBIT.unshift('EBIT');
    EBITMargin.unshift('EBIT Margin');
    DA.unshift('(+) Depreciation & Amortization (D&A)');
    EBITDA.unshift('EBITDA');
    EBITDAMargin.unshift('EBITDA Margin');
    NIE.unshift('(-) Net Interest/Other Income Expense');
    EBT.unshift('EBT');
    EBTMargin.unshift('EBT Margin');
    taxes.unshift('(-) Taxes');
    netIncome.unshift('Net Income');
    netIncomeMargin.unshift('Net Income Margin');

    inMillionsYear = inMillionsYear.map((year, index) => {
      if (index == 0) {
        return {
          text: '(in millions)',
          italics: true,
          fillColor: '#164A5B',
          color: '#fff',
          margin: [0, 10, 0, 10],
        };
      } else {
        return {
          text: year,
          bold: true,
          fillColor: '#164A5B',
          color: '#fff',
          margin: [0, 10, 0, 10],
          border: [10, 10, 10, 10],
          alignment: 'right',
        };
      }
    });

    data.push(
      inMillionsYear,
      this.getMappedArr(totalRevenue, true),
      this.getMappedArr(revenueGrowthRate),
      this.getMappedArr(COGS),
      this.getMappedArr(grossProfit, true),
      this.getMappedArr(grossMargin),
      this.getMappedArr(SGA),
      this.getMappedArr(EBIT, true),
      this.getMappedArr(EBITMargin),
      this.getMappedArr(DA),
      this.getMappedArr(EBITDA, true),
      this.getMappedArr(EBITDAMargin),
      this.getMappedArr(NIE),
      this.getMappedArr(EBT, true),
      this.getMappedArr(EBTMargin),
      this.getMappedArr(taxes),
      this.getMappedArr(netIncome, true),
      this.getMappedArr(netIncomeMargin)
    );
    console.log('data', data);

    var canvas = document.createElement('canvas');
    canvas.width = this.imagecanvas.nativeElement.width;
    canvas.height = this.imagecanvas.nativeElement.height;
    canvas.getContext('2d').drawImage(this.imagecanvas.nativeElement, 0, 0);
    const imagermi = canvas.toDataURL('image/png');

    let docDefinition = {
      pageSize: {
        width: 910,
        height: 'auto',
      },

      pageMargins: [40, 40, 40, 40],

      content: [
        { image: imagermi, width: 150, height: 75 },
        {
          text:
            this.companySelected +
            ' - ' +
            ' Historical & Projected Income Statement  ' +
            '-' +
            this.scenarioName,
          style: 'header',
        },
        {
          //style: 'tableExample',
          // layout: 'lightHorizontalLines',

          table: {
            headerRows: 1,
            heights: 20,
            //width:'auto',
            widths: [290, 60, 60, 60, 60, 60, 60, 60, 60],
            body: data,
          },
          layout: {
            //set custom borders size and color
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 0.5 : 0.5;
            },
            vLineWidth: function (i, node) {
              return 0;
            },
            hLineColor: function (i, node) {
              return i === 0 || i === node.table.body.length ? 'black' : 'gray';
            },
            // vLineColor: function (i, node) {
            //   return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
            // }
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [10, 10, 10, 10],
        },
      },
    };
    // pdfMake.tableLayouts = {
    //   exampleLayout : {
    //     paddingLeft: function (i) {
    //       return 20;
    //     },
    //   }
    // }

    pdfMake.createPdf(docDefinition).download();
  }

  getMappedArr(inputArr, isfundsfromOperations?) {
    const arr = inputArr.map((year, index) => {
      if (index == 0) {
        if (isfundsfromOperations) {
          return {
            text: year,
            margin: [0, 10, 0, 10],
            alignment: 'left',
            bold: true,
          };
        } else {
          return { text: year, margin: [0, 10, 0, 10] };
        }
      } else {
        if (isfundsfromOperations) {
          return {
            text:
              year.indexOf('-') >= 0
                ? '( ' + year.replace('-', '') + ' )'
                : year,
            margin: [0, 10, 0, 10],
            alignment: 'right',
            bold: true,
          };
        } else {
          return {
            text:
              year.indexOf('-') >= 0
                ? '( ' + year.replace('-', '') + ' )'
                : year,
            margin: [0, 10, 0, 10],
            alignment: 'right',
          };
        }
      }
    });

    return arr;
  }
}
