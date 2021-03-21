import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExcelService } from 'src/app/shared/excel.service';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { cloneDeep } from 'lodash';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-ratios',
  templateUrl: './ratios.component.html',
  styleUrls: ['./ratios.component.scss'],
})
export class RatiosComponent implements OnInit, OnDestroy {
  isLoading = true;
  actuals = [];
  projections = [];
  scenarioArray = [];
  selectedScenario;
  companySelected = "";
  selectedCompanyName = localStorage.getItem('selectedCompanyName');
  RatioScenarionSubscription: Subscription;
  RatioActualsSubscription: Subscription;
  RatiosProjectionSubscription: Subscription;
  constructor(private rmiApiService: RMIAPIsService, private excelService : ExcelService) {}

  ngOnInit() {
this.excelService.selectedDashboardMenu = 'ratios'
    this.getData();
  }
  getData() {
    const companySelected = localStorage.getItem('companySelected'); // 'nike-2018';
  	this.companySelected = companySelected
    this.RatioScenarionSubscription = this.rmiApiService
      .getData(`ratios-scenarios?company=${companySelected}`)
      .subscribe((scenario: any) => {
        this.scenarioArray = scenario.scenarios;
        this.selectedScenario = this.scenarioArray[0] || 0;
        this.getActualAndProjection();
      });
  }
  getActualAndProjection() {
    const companySelected = localStorage.getItem('companySelected'); // 'nike-2018';
    this.RatioActualsSubscription = this.rmiApiService
      .getData(`ratios-actuals?company=${companySelected}`)
      .subscribe((data: any[]) => {
        this.RatiosProjectionSubscription = this.rmiApiService
          .getData(
            `ratios-projections?company=${companySelected}&scenario=${this.selectedScenario}`
          )
          .subscribe((projection: any) => {
            this.projections = projection;
            this.actuals = data;
            this.isLoading = false;
          });
      });
  }
  changeScenario(scenario) {
    this.selectedScenario = scenario;
    this.isLoading = true;
    this.getActualAndProjection();
  }
  ngOnDestroy() {
    if (this.RatioActualsSubscription) {
      this.RatioActualsSubscription.unsubscribe();
    }
    if (this.RatiosProjectionSubscription) {
      this.RatiosProjectionSubscription.unsubscribe();
    }
    if (this.RatioScenarionSubscription) {
      this.RatioActualsSubscription.unsubscribe();
    }
  }

  ELEMENT_KPI_ACTUALS = []
  ELEMENT_KPI_PROJECTIONS = []

  exportToPDF() {

    //return Ratios
    const keysReturn = Object.keys(this.excelService.returnRatiosData[0]);
    let onlyYears = keysReturn.filter( k => {
      return k.indexOf("-") < 0 && k != "name";
    })

    const returnRatiosKeys = ["name"].concat(onlyYears).concat(keysReturn.filter( k => k.indexOf("-") >= 0))
    const returnRatiosHeaders = returnRatiosKeys.map( (name, index) => {
      if(index == 0){
        return {text: "Return Ratios", bold: true, fillColor: '#164A5B', color: "#fff", margin: [10, 10, 0, 10], border: [10, 10, 10, 10], alignment: "left"}
      }
      else{
        return {text: name, bold: true, fillColor: '#164A5B', color: "#fff", margin: [0, 10, 0, 10], border: [10, 10, 10, 10], alignment: "left"}
      }
    })

    let returnRatiosData = []
    this.excelService.returnRatiosData.forEach((obj) => {
      const values = []
      returnRatiosKeys.forEach( key => {
        values.push(obj[key]);
      })
      returnRatiosData.push(this.getMappedArr(values))
    });


    const commmonHeaders = returnRatiosKeys.map( (name, index) => {
      if(index == 2){
        return {text: "Actuals", bold: true, fillColor: '#fff', color: "#000", margin: [10, 10, 0, 10], border: [0, 0, 10, 0], alignment: "left"}
      }
      else if(index == 6){
        return {text: "Projections", bold: true, fillColor: '#fff', color: "#000", margin: [0, 10, 0, 10], border: [0, 0, 10, 0], alignment: "left"}
      }
      else if(index == 9){
        return {text: "Average", bold: true, fillColor: '#fff', color: "#000", margin: [0, 10, 0, 10], border: [0, 0, 0, 0], alignment: "right"}
      }
      else{
        return {text: "", bold: true, fillColor: '#fff', color: "#000", margin: [0, 10, 0, 10], border: [0, 0, 0, 0], alignment: "right"}
      }
    })

    const finalDataForReturn = [cloneDeep(commmonHeaders)].concat([returnRatiosHeaders]).concat(returnRatiosData)

    // ---------------------------------------------------------------------------------------------------
    //profitability Ratios
    const keysProfit = Object.keys(this.excelService.profitabilityRatiosData[0]);
    onlyYears = keysReturn.filter( k => {
      return k.indexOf("-") < 0 && k != "name";
    })

    const profitabilityRatiosKeys = ["name"].concat(onlyYears).concat(keysProfit.filter( k => k.indexOf("-") >= 0))
    const profitabilityRatiosHeaders = profitabilityRatiosKeys.map( (name, index) => {
      if(index == 0){
        return {text: "Profitability Ratios", bold: true, fillColor: '#164A5B', color: "#fff", margin: [10, 10, 0, 10], border: [10, 10, 10, 10], alignment: "left"}
      }
      else{
        return {text: name, bold: true, fillColor: '#164A5B', color: "#fff", margin: [0, 10, 0, 10], border: [10, 10, 10, 10], alignment: "left"}
      }
    })

    let profitabilityRatiosData = []
    this.excelService.profitabilityRatiosData.forEach((obj) => {
      const values = []
      profitabilityRatiosKeys.forEach( key => {
        values.push(obj[key]);
      })
      profitabilityRatiosData.push(this.getMappedArr(values))
    });

    const finalDataForProfit= [cloneDeep(commmonHeaders)].concat([profitabilityRatiosHeaders]).concat(profitabilityRatiosData)

    // ---------------------------------------------------------------------------------------------------
    //Liquidity Ratios
    const keysLiquidity = Object.keys(this.excelService.liquidityRatiosData[0]);
    onlyYears = keysLiquidity.filter( k => {
      return k.indexOf("-") < 0 && k != "name";
    })

    const liquidityRatiosKeys = ["name"].concat(onlyYears).concat(keysLiquidity.filter( k => k.indexOf("-") >= 0))
    const liquidityRatiosHeaders = liquidityRatiosKeys.map( (name, index) => {
      if(index == 0){
        return {text: "Liquidity Ratios", bold: true, fillColor: '#164A5B', color: "#fff", margin: [10, 10, 0, 10], border: [10, 10, 10, 10], alignment: "left"}
      }
      else{
        return {text: name, bold: true, fillColor: '#164A5B', color: "#fff", margin: [0, 10, 0, 10], border: [10, 10, 10, 10], alignment: "left"}
      }
    })

    let liquidityRatiosData = []
    this.excelService.liquidityRatiosData.forEach((obj) => {
      const values = []
      liquidityRatiosKeys.forEach( key => {
        values.push(obj[key]);
      })
      liquidityRatiosData.push(this.getMappedArr(values))
    });

    const finalDataForLiquidity= [cloneDeep(commmonHeaders)].concat([liquidityRatiosHeaders]).concat(liquidityRatiosData)


    // ---------------------------------------------------------------------------------------------------
    //Solvency Ratios
    const keysSolvency = Object.keys(this.excelService.solvencyRatiosData[0]);
    onlyYears = keysSolvency.filter( k => {
      return k.indexOf("-") < 0 && k != "name";
    })

    const solvencyRatiosKeys = ["name"].concat(onlyYears).concat(keysSolvency.filter( k => k.indexOf("-") >= 0))
    const solvencyRatiosHeaders = solvencyRatiosKeys.map( (name, index) => {
      if(index == 0){
        return {text: "Solvency Ratios", bold: true, fillColor: '#164A5B', color: "#fff", margin: [10, 10, 0, 10], border: [10, 10, 10, 10], alignment: "left"}
      }
      else{
        return {text: name, bold: true, fillColor: '#164A5B', color: "#fff", margin: [0, 10, 0, 10], border: [10, 10, 10, 10], alignment: "left"}
      }
    })

    let solvencyRatiosData = []
    this.excelService.solvencyRatiosData.forEach((obj) => {
      const values = []
      solvencyRatiosKeys.forEach( key => {
        values.push(obj[key]);
      })
      solvencyRatiosData.push(this.getMappedArr(values))
    });

    const finalDataForSolvency = [cloneDeep(commmonHeaders)].concat([solvencyRatiosHeaders]).concat(solvencyRatiosData)

    // var canvas = document.createElement('canvas');
    // canvas.width = this.imagecanvas.nativeElement.width;
    // canvas.height = this.imagecanvas.nativeElement.height;
    // canvas.getContext('2d').drawImage(this.imagecanvas.nativeElement, 0, 0);
    // const imagermi = canvas.toDataURL('image/png');

    let docDefinition = {
      pageSize: {
        width: 1200,
        height: "auto",
      },

      pageMargins: [40, 40, 40, 40],

      content: [
        // { image: imagermi, width: 150, height: 75 },
        // { image: imagermi, width: 150, height: 75 },
        {
          text: this.selectedCompanyName + " - Scenario [(" + this.selectedScenario  + ")]",
          style: 'header',
        },
        {
          //style: 'tableExample',
          // layout: 'lightHorizontalLines',
          // style: 'tableExample',
          table: {
            headerRows: 2,
            heights: 20,
            // width:'auto',
            widths: [260, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75],
            body: finalDataForProfit
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

        {
          text: '',
          style: 'header',
        },
        {
          //style: 'tableExample',
          // layout: 'lightHorizontalLines',
          // style: 'tableExample',
          table: {
            headerRows: 2,
            heights: 20,
            // width:'auto',
            widths: [260, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75],
            body: finalDataForReturn
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
        {
          text: '',
          style: 'header',
        },
        {
          //style: 'tableExample',
          // layout: 'lightHorizontalLines',
          // style: 'tableExample',
          table: {
            headerRows: 2,
            heights: 20,
            // width:'auto',
            widths: [260, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75],
            body: finalDataForLiquidity
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

        {
          text: '',
          style: 'header',
        },
        {
          //style: 'tableExample',
          // layout: 'lightHorizontalLines',
          // style: 'tableExample',
          table: {
            headerRows: 2,
            heights: 20,
            // width:'auto',
            widths: [260, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75],
            body: finalDataForSolvency
          },
          layout: {
            //set custom borders size and color
            hLineWidth: function (i, node) {
              return i === 0 || i === node.table.body.length ? 0.5 : 0.5;
            },
            vLineWidth: function (i, node) {
              return 0;
            },
            hLineStyle: function (i, node) {
              if (i === 0 || i === node.table.body.length) {
                return null;
              }
              // return {dash: {length: 10, space: 4}};
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
          margin: [10, 50, 10, 10],
        },
      },
    };
    

    pdfMake.createPdf(docDefinition).download();
  }

  getMappedArr(inputArr) {
    const arr = inputArr.map((value:any, index) => {
      if(index == 0){
        return  {
          text: value,
          margin: [0, 10, 0, 10],          
          alignment: 'left',
          bold: true,
        };
      }
      else if(index == inputArr.length - 1 || index == inputArr.length - 2){
        return  {
          text: value.toFixed(1) + "%",
          margin: [10, 10, 0, 10],          
          alignment: 'left',
          bold: true,
        };
      }
      else{
        return  {
          text: value.toFixed(1) + "%",
          margin: [0, 10, 0, 10],
          alignment: 'left',
          bold: false,
        };
      }
    });

    return arr;
  }

}
