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
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as Excel from 'exceljs/dist/exceljs.min.js';
import { formatNumber } from '@angular/common';
import { AuthService } from 'src/app/auth.service';

export interface PLElement {
  inMillions: number;
  'Cash Equivalents': string;
  'Accounts Receivable': string;
  Inventories: string;
  'Prepaid Expenses & Other Current Assets': string;
  'Total Current Assets': string;
  'Property Plant & Equipment': string;
  'Intangible Assets': string;
  Goodwill: string;
  'Other Assets': string;
  'Total Assets': string;
  'Current Portion Long Term Debt': string;
  'Accounts Payable': string;
  'Accrued Liabilities': string;
  'Other Current Liabilities': string;
  'Total Current Liabilities': string;
  'Long Term Debt': string;
  'Other Liabilities': string;
  'Total Shareholders Equity': string;
  'Total Liabilities and Shareholders Equity': string;
  'Memo Check': string;
}
let ELEMENT_BS_PDF: PLElement[] = [];

@Component({
  selector: 'app-bsmetrics',
  templateUrl: './bsmetrics.component.html',
  styleUrls: ['./bsmetrics.component.scss'],
})
export class BsmetricsComponent implements OnInit {
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
    'Cash Equivalents',
    'Accounts Receivable',
    'Inventories',
    'Prepaid Expenses & Other Current Assets',
    'Total Current Assets',
    'Property Plant & Equipment',
    'Intangible Assets',
    'Goodwill',
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
    'Memo Check',
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
    if(this.authService.authServiceLoaded){
      const ELEMENT_BS: PLElement[] = [];
    this.progressBar = true;
    var memocheck;


    this.apiService.getData(this.urlConfig.getScenarioAPI() + this.companySelected).subscribe(res => {
      console.log("Successfully fetched scenarios for company " + this.companySelected, res);

      this.scenarioArray = res[this.companySelected];
      this.UserDetailModelService.setScenarioNumber(
        this.scenarioArray
      );
      let scenarioNumber = 0;
      if (this.scenarioArray.includes(this.scenario)) {
        scenarioNumber = this.scenario;
      }


      this.apiService.getData(this.urlConfig.getActualsProjectionsForBS() + this.companySelected + "&scenario=" + scenarioNumber).subscribe( (success:any) => {
        console.log("Succesfully fetched projections and actuals for company " + this.companySelected, success);

        if(success.result && success.result.actuals && success.result.projections){
          const actualsData = JSON.parse(success.result.actuals);
          const projectionsData = JSON.parse(success.result.projections);

          for (let j = 0; j < actualsData.length; j++) {
            if (actualsData[j].memocheck === 0) {
              memocheck = 'Match';
            } else {
              memocheck = 'Not Match';
            }
            this.financialObj.set(actualsData[j].asof, {
              cashequivalents: actualsData[j].cashequivalents,
              accountsreceivable: actualsData[j].accountsreceivable,
              inventories: actualsData[j].inventories,
              othercurrentassets: actualsData[j].othercurrentassets,
              totalcurrentassets: actualsData[j].totalcurrentassets,
              ppe: actualsData[j].ppe,
              intangibleassets: actualsData[j].intangibleassets,
              goodwill: actualsData[j].goodwill,
              otherassets: actualsData[j].otherassets,
              totalassets: actualsData[j].totalassets,
              currentportionlongtermdebt: actualsData[j].currentportionlongtermdebt,
              accountspayable: actualsData[j].accountspayable,
              accruedliabilities: actualsData[j].accruedliabilities,
              othercurrentliabilities: actualsData[j].othercurrentliabilities,
              totalcurrentliabilities: actualsData[j].totalcurrentliabilities,
              longtermdebt: actualsData[j].longtermdebt,
              otherliabilities: actualsData[j].otherliabilities,
              totalliabilities: actualsData[j].totalliabilities,
              totalshareholdersequity: actualsData[j].totalshareholdersequity,
              totalliabilitiesandequity: actualsData[j].totalliabilitiesandequity,
              'Memo Check': memocheck,
            });
          }

          for (let j = 0; j < projectionsData.length; j++) {
            if (projectionsData[j].memocheck === 0) {
              memocheck = 'Match';
            } else {
              memocheck = 'Not Match';
            }
            this.financialObj.set(projectionsData[j].asof, {
              cashequivalents: projectionsData[j].cashequivalents,
              accountsreceivable: projectionsData[j].accountsreceivable,
              inventories: projectionsData[j].inventories,
              othercurrentassets: projectionsData[j].othercurrentassets,
              totalcurrentassets: projectionsData[j].totalcurrentassets,
              ppe: projectionsData[j].ppe,
              intangibleassets: projectionsData[j].intangibleassets,
              goodwill: projectionsData[j].goodwill,
              otherassets: projectionsData[j].otherassets,
              totalassets: projectionsData[j].totalassets,
              currentportionlongtermdebt:
                projectionsData[j].currentportionlongtermdebt,
              accountspayable: projectionsData[j].accountspayable,
              accruedliabilities: projectionsData[j].accruedliabilities,
              othercurrentliabilities:
                projectionsData[j].othercurrentliabilities,
              totalcurrentliabilities:
                projectionsData[j].totalcurrentliabilities,
              longtermdebt: projectionsData[j].longtermdebt,
              otherliabilities: projectionsData[j].otherliabilities,
              totalliabilities: projectionsData[j].totalliabilities,
              totalshareholdersequity:
                projectionsData[j].totalshareholdersequity,
              totalliabilitiesandequity:
                projectionsData[j].totalliabilitiesandequity,
              'Memo Check': memocheck,
            });
          }

          this.financialObj.forEach((v, k) => {
            var pushData = {
              inMillions: k,
              'Cash Equivalents':
                '$ ' +
                formatNumber(
                  Number(v.cashequivalents),
                  'en-US',
                  '1.0-0'
                ),
              'Accounts Receivable':
                '$ ' +
                formatNumber(
                  Number(v.accountsreceivable),
                  'en-US',
                  '1.0-0'
                ),
              Inventories:
                '$ ' +
                formatNumber(
                  Number(v.inventories),
                  'en-US',
                  '1.0-0'
                ),
              'Prepaid Expenses & Other Current Assets':
                '$ ' +
                formatNumber(
                  Number(v.othercurrentassets),
                  'en-US',
                  '1.0-0'
                ),
              'Total Current Assets':
                '$ ' +
                formatNumber(
                  Number(v.totalcurrentassets),
                  'en-US',
                  '1.0-0'
                ),
              'Property Plant & Equipment':
                '$ ' +
                formatNumber(Number(v.ppe), 'en-US', '1.0-0'),
              'Intangible Assets':
                '$ ' +
                formatNumber(
                  Number(v.intangibleassets),
                  'en-US',
                  '1.0-0'
                ),
              Goodwill:
                '$ ' +
                formatNumber(Number(v.goodwill), 'en-US', '1.0-0'),
              'Other Assets':
                '$ ' +
                formatNumber(
                  Number(v.otherassets),
                  'en-US',
                  '1.0-0'
                ),
              'Total Assets':
                '$ ' +
                formatNumber(
                  Number(v.totalassets),
                  'en-US',
                  '1.0-0'
                ),
              'Current Portion Long Term Debt':
                '$ ' +
                formatNumber(
                  Number(v.currentportionlongtermdebt),
                  'en-US',
                  '1.0-0'
                ),
              'Accounts Payable':
                '$ ' +
                formatNumber(
                  Number(v.accountspayable),
                  'en-US',
                  '1.0-0'
                ),
              'Accrued Liabilities':
                '$ ' +
                formatNumber(
                  Number(v.accruedliabilities),
                  'en-US',
                  '1.0-0'
                ),
              'Other Current Liabilities':
                '$ ' +
                formatNumber(
                  Number(v.othercurrentliabilities),
                  'en-US',
                  '1.0-0'
                ),
              'Total Current Liabilities':
                '$ ' +
                formatNumber(
                  Number(v.totalcurrentliabilities),
                  'en-US',
                  '1.0-0'
                ),
              'Long Term Debt':
                '$ ' +
                formatNumber(
                  Number(v.longtermdebt),
                  'en-US',
                  '1.0-0'
                ),
              'Other Liabilities':
                '$ ' +
                formatNumber(
                  Number(v.otherliabilities),
                  'en-US',
                  '1.0-0'
                ),
              'Total Shareholders Equity':
                '$ ' +
                formatNumber(
                  Number(v.totalshareholdersequity),
                  'en-US',
                  '1.0-0'
                ),
              'Total Liabilities and Shareholders Equity':
                '$ ' +
                formatNumber(
                  Number(v.totalliabilitiesandequity),
                  'en-US',
                  '1.0-0'
                ),
              'Memo Check': memocheck,
            };
            ELEMENT_BS.push(pushData);
          });
          this.displayedColumns = ['0'].concat(
            ELEMENT_BS.map((x) => x.inMillions.toString())
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
      for (let i = 0; i < ELEMENT_BS.length; ++i) {
        output[ELEMENT_BS[i].inMillions] = ELEMENT_BS[i][row];
      }
      return output;
    }
    ELEMENT_BS_PDF = ELEMENT_BS;
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

    data.push(
      this.prepareJsonForExport(keys, 'cashequivalents', 'Cash Equivalents')
    );
    data.push(
      this.prepareJsonForExport(
        keys,
        'accountsreceivable',
        'Accounts Receivable'
      )
    );
    data.push(this.prepareJsonForExport(keys, 'inventories', ' Inventories '));
    data.push(
      this.prepareJsonForExport(
        keys,
        'othercurrentassets',
        'Prepaid Expenses & Other Current Assets '
      )
    );
    data.push(
      this.prepareJsonForExport(
        keys,
        'totalcurrentassets',
        'Total Current Assets'
      )
    );
    data.push(
      this.prepareJsonForExport(keys, 'ppe', 'Property Plant & Equipment')
    );
    data.push(
      this.prepareJsonForExport(keys, 'intangibleassets', ' Intangible Assets')
    );
    data.push(this.prepareJsonForExport(keys, 'goodwill', 'Goodwill'));
    data.push(this.prepareJsonForExport(keys, 'otherassets', 'Other Assets'));
    data.push(this.prepareJsonForExport(keys, 'totalassets', ' Total Assets'));
    data.push(
      this.prepareJsonForExport(
        keys,
        'currentportionlongtermdebt',
        'Current Portion Long Term Debt'
      )
    );
    data.push(
      this.prepareJsonForExport(keys, 'accountspayable', ' Accounts Payable')
    ); // check this.
    data.push(
      this.prepareJsonForExport(
        keys,
        'accruedliabilities',
        'Accrued Liabilities'
      )
    );
    data.push(
      this.prepareJsonForExport(
        keys,
        'othercurrentliabilities',
        'Other Current Liabilities'
      )
    );
    data.push(
      this.prepareJsonForExport(
        keys,
        'totalcurrentliabilities',
        ' Total Current Liabilities'
      )
    );
    data.push(
      this.prepareJsonForExport(keys, 'longtermdebt', 'Long Term Debt')
    );
    data.push(
      this.prepareJsonForExport(keys, 'otherliabilities', 'Other Liabilities')
    );
    data.push(
      this.prepareJsonForExport(keys, 'totalliabilities', 'Total Liabilities')
    );
    data.push(
      this.prepareJsonForExport(
        keys,
        'totalshareholdersequity',
        'Total Shareholders Equity'
      )
    );
    data.push(
      this.prepareJsonForExport(
        keys,
        'totalliabilitiesandequity',
        ' Total Liabilities and Shareholders Equity '
      )
    );
    data.push(
      this.prepareJsonForExport(keys, 'Memo Check', 'Memo Check', true)
    );

    console.log(data);

    this.excelService.exportAsExcelFileBalancesheet(
      data,
      'Balance-Sheet Statement',
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
          jsonObject[key] = this.financials[index - 1][parameter];
        } else {
          jsonObject[key] = +this.financials[index - 1][parameter];
        }
      }
    });

    return jsonObject;
  }
  exportToPDF() {
    // let doc = new jsPDF('l','pt');
    let data = [];
    let inMillionsYear = [];
    let cashEquivalents = [];
    let accountsReceivable = [];
    let inventories = [];
    let prepaidExpensesOtherCurrentAssets = [];
    let totalCurrentAssets = [];
    let ppe = [];
    let intangibleAssets = [];
    let goodwill = [];
    let otherAssets = [];
    let totalAssets = [];
    let currentPortionLongTermDebt = [];
    let accountsPayable = [];
    let accruedLiabilities = [];
    let otherCurrentLiabilities = [];
    let totalCurrentLiabilities = [];
    let longTermDebt = [];
    let otherLiabilities = [];
    let totalShareholdersEquity = [];
    let totalLiabilitiesShareholdersEquity = [];
    let memocheck = [];
    ELEMENT_BS_PDF.forEach((obj) => {
      inMillionsYear.push(obj['inMillions']);
      cashEquivalents.push(obj['Cash Equivalents']);
      accountsReceivable.push(obj['Accounts Receivable']);
      inventories.push(obj['Inventories']);
      prepaidExpensesOtherCurrentAssets.push(
        obj['Prepaid Expenses & Other Current Assets']
      );
      totalCurrentAssets.push(obj['Total Current Assets']);
      ppe.push(obj['Property Plant & Equipment']);
      intangibleAssets.push(obj['Intangible Assets']);
      goodwill.push(obj['Goodwill']);
      otherAssets.push(obj['Other Assets']);
      totalAssets.push(obj['Total Assets']);
      currentPortionLongTermDebt.push(obj['Current Portion Long Term Debt']);
      accountsPayable.push(obj['Accounts Payable']);
      accruedLiabilities.push(obj['Accrued Liabilities']);
      otherCurrentLiabilities.push(obj['Other Current Liabilities']);
      totalCurrentLiabilities.push(obj['Total Current Liabilities']);
      longTermDebt.push(obj['Long Term Debt']);
      otherLiabilities.push(obj['Other Liabilities']);
      totalShareholdersEquity.push(obj['Total Shareholders Equity']);
      totalLiabilitiesShareholdersEquity.push(
        obj['Total Liabilities and Shareholders Equity']
      );
      memocheck.push(obj['Memo Check']);
    });
    inMillionsYear.unshift('Years');
    cashEquivalents.unshift('Cash Equivalents');
    accountsReceivable.unshift('Accounts Receivable');
    inventories.unshift('Inventories');
    prepaidExpensesOtherCurrentAssets.unshift(
      'Prepaid Expenses & Other Current Assets'
    );
    totalCurrentAssets.unshift('Total Current Assets');
    ppe.unshift('Property Plant & Equipment');
    intangibleAssets.unshift('Intangible Assets');
    goodwill.unshift('Goodwill');
    otherAssets.unshift('Other Assets');
    totalAssets.unshift('Total Assets');
    currentPortionLongTermDebt.unshift('Current Portion Long Term Debt');
    accountsPayable.unshift('Accounts Payable');
    accruedLiabilities.unshift('Accrued Liabilities');
    otherCurrentLiabilities.unshift('Other Current Liabilities');
    totalCurrentLiabilities.unshift('Total Current Liabilities');
    longTermDebt.unshift('Long Term Debt');
    otherLiabilities.unshift('Other Liabilities');
    totalShareholdersEquity.unshift('Total Shareholders Equity');
    totalLiabilitiesShareholdersEquity.unshift(
      'Total Liabilities and Shareholders Equity'
    );
    memocheck.unshift('memocheck');

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
      this.getMappedArr(cashEquivalents),
      this.getMappedArr(accountsReceivable),
      this.getMappedArr(inventories),
      this.getMappedArr(prepaidExpensesOtherCurrentAssets),
      this.getMappedArr(totalCurrentAssets, true),
      this.getMappedArr(ppe),
      this.getMappedArr(intangibleAssets),
      this.getMappedArr(goodwill),
      this.getMappedArr(otherAssets),
      this.getMappedArr(totalAssets, true),
      this.getMappedArr(currentPortionLongTermDebt),
      this.getMappedArr(accountsPayable),
      this.getMappedArr(accruedLiabilities),
      this.getMappedArr(otherCurrentLiabilities),
      this.getMappedArr(totalCurrentLiabilities, true),
      this.getMappedArr(longTermDebt, otherLiabilities),
      this.getMappedArr(totalShareholdersEquity),
      this.getMappedArr(totalLiabilitiesShareholdersEquity, true),
      this.getMappedArr(memocheck, true)
    );

    var canvas = document.createElement('canvas');
    canvas.width = this.imagecanvas.nativeElement.width;
    canvas.height = this.imagecanvas.nativeElement.height;
    canvas.getContext('2d').drawImage(this.imagecanvas.nativeElement, 0, 0);
    const imagermi = canvas.toDataURL('image/png');

    let docDefinition = {
      pageSize: {
        width: 900,
        height: 'auto',
      },
      pageMargins: [40, 40, 40, 40],

      content: [
        { image: imagermi, width: 150, height: 75 },
        {
          text:
            this.companySelected +
            ' - ' +
            ' Historical & Projected Balance Sheet' +
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
            widths: [235, 75, 75, 75, 75, 75, 75, 75],
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
  /////#imagecanvas
}
