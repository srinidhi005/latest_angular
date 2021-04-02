import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { cloneDeep } from 'lodash';
import { ExcelService } from 'src/app/shared/excel.service';

@Component({
  selector: 'app-comparator',
  templateUrl: './comparator.component.html',
  styleUrls: ['./comparator.component.scss']
})
export class ComparatorComponent implements OnInit {

  constructor(private urlConfig : UrlConfigService, private apiService : RMIAPIsService,public excelService : ExcelService) { }


  selectedCompanyOne;
  selectedCompanyTwo;
  selectedCompanyThree;
  selectedCompanyFour;
   
  selectedSenarioForCompOne;
  selectedSenarioForCompTwo;
  selectedSenarioForCompThree;
  selectedSenarioForCompFour;

  typeOfFinancials = "Historical";
  
  employer;
  progressBar = false;

  allCompanies = [];

  benchmarkingActualsOne;
  benchmarkingProjectionsOne;

  benchmarkingActualsTwo;
  benchmarkingProjectionsTwo;

  benchmarkingActualsThree;
  benchmarkingProjectionsThree;
	
   benchmarkingActualsFour;
  benchmarkingProjectionsFour;	
	
	
  scenariosForCompanyOne;
  scenariosForCompanyTwo;
  scenariosForCompanyThree;
  scenariosForCompanyFour;

  myControl = new FormControl();

  filteredOptions: Observable<any>;

	  ngOnInit(): void {
	  this.excelService.selectedDashboardMenu = 'comparator'
    this.progressBar = true;
    this.employer = localStorage.getItem('employer');

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(),
      map(value => typeof value === 'string' ? value : ""),
      map(name => name ? this._filter(name) : this.allCompanies.slice()));

    this.loadComparator()
  }

  displayFn(user): string {
    return user && user.companyname ? user.companyname : '';
  }

  private _filter(name: string) {
    const filterValue = name.toLowerCase();
    return this.allCompanies.filter(option => option.companyname.toLowerCase().indexOf(filterValue) >= 0);
  }

  async loadCompany(type, srcObj, index){
    console.log(this.myControl);
	let loadedCompScenarios = [0];
    try {
      const scenarios : any = await this.apiService.getData(this.urlConfig.getScenarioAPI()+srcObj.companyname).toPromise();
      loadedCompScenarios = scenarios.scenarios;
    } catch (error) {
      
    }
    this.progressBar = true;
    let selectedComp;
    let selectedScenario;
    if(type == 'SCENARIO'){
      if(index == 1){
        this.selectedSenarioForCompOne = srcObj
        selectedScenario = srcObj
        selectedComp = cloneDeep(this.selectedCompanyOne)
      }
      else if(index == 2){
        this.selectedSenarioForCompTwo = srcObj
        selectedScenario = srcObj
        selectedComp = cloneDeep(this.selectedCompanyTwo);
      }
      else if(index==3){
        this.selectedSenarioForCompThree = srcObj
        selectedScenario = srcObj
        selectedComp = cloneDeep(this.selectedCompanyThree)
      }
	  else {
        this.selectedSenarioForCompFour = srcObj
        selectedScenario = srcObj
        selectedComp = cloneDeep(this.selectedCompanyFour)
      }
    }
    else{
      if(index == 1){
        this.selectedCompanyOne = cloneDeep(srcObj)
        selectedComp = srcObj
        selectedScenario = this.selectedSenarioForCompOne
		this.scenariosForCompanyOne = loadedCompScenarios
      }
      else if(index == 2){
        this.selectedCompanyTwo = cloneDeep(srcObj)
        selectedComp = srcObj
        selectedScenario = this.selectedSenarioForCompTwo
		  this.scenariosForCompanyTwo = loadedCompScenarios
      }
      else if(index == 3){
        this.selectedCompanyThree = cloneDeep(srcObj)
        selectedComp = srcObj
        selectedScenario = this.selectedSenarioForCompThree
		  this.scenariosForCompanyThree = loadedCompScenarios
      }
	  else {
        this.selectedCompanyFour = cloneDeep(srcObj)
        selectedComp = srcObj
        selectedScenario = this.selectedSenarioForCompFour
		  this.scenariosForCompanyFour = loadedCompScenarios
      }
    }

    try {
      const bmActuals =  await this.apiService.getData(this.urlConfig.getBenchmarkingActualsAPI() + selectedComp.companyname).toPromise();
      if(index == 1){
        this.benchmarkingActualsOne = bmActuals[0];
      }
      else if(index == 2){
        this.benchmarkingActualsTwo = bmActuals[0];
      }
      else if(index == 3){
        this.benchmarkingActualsThree = bmActuals[0];
      }
	  else {
        this.benchmarkingActualsFour = bmActuals[0];
      }

      console.log(bmActuals)
    } catch (error) {
      
    }

    try {
      const bmProjections = await this.apiService.getData(this.urlConfig.getBenchmarkingProjectionsAPI() + selectedComp.companyname+ "&scenario=" + selectedScenario).toPromise();
      if(index == 1){
        this.benchmarkingProjectionsOne = bmProjections[0];
      }
      else if(index == 2){
        this.benchmarkingProjectionsTwo = bmProjections[0];
      }
      else if(index == 3){
        this.benchmarkingProjectionsThree = bmProjections[0];
      }
	  else{
        this.benchmarkingProjectionsFour = bmProjections[0];
      }
    
      console.log(bmProjections)
    } catch (error) {
      
    }

    this.progressBar = false;
  }

  loadFinancials(type){
    this.typeOfFinancials = type;
  }

  async loadComparator(){
    this.progressBar = true;
    try {
      const companiesAPIData : any = await this.apiService.getData(this.urlConfig.getStatementAPI() + this.employer).toPromise();
      this.allCompanies = companiesAPIData.map( comp => { 
        return {companyname: comp.companyname, company: comp.company};
      })
    } catch (error) {
      
    }

    // this.selectedCompany = localStorage.getItem('companySelected');
    this.selectedCompanyOne = this.allCompanies[0];
    this.selectedCompanyTwo = this.allCompanies[1];
    this.selectedCompanyThree = this.allCompanies[2];
	this.selectedCompanyFour = this.allCompanies[3];

    this.selectedSenarioForCompOne = 0
    this.selectedSenarioForCompTwo = 0
    this.selectedSenarioForCompThree = 0
	this.selectedSenarioForCompFour = 0

    try {
      const scenariosOne : any = await this.apiService.getData(this.urlConfig.getScenarioAPI()+this.selectedCompanyOne.companyname).toPromise();
      this.scenariosForCompanyOne = scenariosOne.scenarios;
    } catch (error) {
     
    }

    try {
      const scenariosTwo : any = await this.apiService.getData(this.urlConfig.getScenarioAPI()+this.selectedCompanyTwo.companyname).toPromise();
      this.scenariosForCompanyTwo = scenariosTwo.scenarios;
    } catch (error) {
      
    }

    try {
      const scenariosThree : any = await this.apiService.getData(this.urlConfig.getScenarioAPI()+this.selectedCompanyThree.companyname).toPromise();
      this.scenariosForCompanyThree = scenariosThree.scenarios;
    } catch (error) {
     
    }
	
	try {
      const scenariosFour : any = await this.apiService.getData(this.urlConfig.getScenarioAPI()+this.selectedCompanyFour.companyname).toPromise();
      this.scenariosForCompanyFour = scenariosFour.scenarios;
    } catch (error) {
     
    }


    try {
      const bmActualsOne =  await this.apiService.getData(this.urlConfig.getBenchmarkingActualsAPI() + this.selectedCompanyOne.companyname).toPromise();
      this.benchmarkingActualsOne = bmActualsOne[0];
    } catch (error) {
     
    }

    try {
      const bmProjectedOne = await this.apiService.getData(this.urlConfig.getBenchmarkingProjectionsAPI() + this.selectedCompanyOne.companyname+ "&scenario=" + this.selectedSenarioForCompOne).toPromise();
      this.benchmarkingProjectionsOne = bmProjectedOne[0];
    } catch (error) {
      
    }

    try {
      const bmActualsTwo = await this.apiService.getData(this.urlConfig.getBenchmarkingActualsAPI() + this.selectedCompanyTwo.companyname).toPromise();
      this.benchmarkingActualsTwo = bmActualsTwo[0];
    } catch (error) {
      
    }

    try {
      const bmProjectedTwo = await this.apiService.getData(this.urlConfig.getBenchmarkingProjectionsAPI() + this.selectedCompanyTwo.companyname + "&scenario=" + this.selectedSenarioForCompTwo).toPromise();
      this.benchmarkingProjectionsTwo = bmProjectedTwo[0];
    } catch (error) {
      
    }


    try {
      const bmActualsThree = await this.apiService.getData(this.urlConfig.getBenchmarkingActualsAPI() + this.selectedCompanyThree.companyname).toPromise();
      this.benchmarkingActualsThree = bmActualsThree[0];
    } catch (error) {
      
    }

    try {
      const bmProjectedThree = await this.apiService.getData(this.urlConfig.getBenchmarkingProjectionsAPI() + this.selectedCompanyThree.companyname + "&scenario=" + this.selectedSenarioForCompThree).toPromise();
      this.benchmarkingProjectionsThree = bmProjectedThree[0];
    } catch (error) {
      
    }
	
	try {
      const bmActualsFour = await this.apiService.getData(this.urlConfig.getBenchmarkingActualsAPI() + this.selectedCompanyFour.companyname).toPromise();
      this.benchmarkingActualsFour = bmActualsFour[0];
    } catch (error) {
      
    }
	
	
	try {
      const bmProjectedFour = await this.apiService.getData(this.urlConfig.getBenchmarkingProjectionsAPI() + this.selectedCompanyFour.companyname + "&scenario=" + this.selectedSenarioForCompFour).toPromise();
      this.benchmarkingProjectionsFour = bmProjectedFour[0];
    } catch (error) {
     
    }
	
	
    this.progressBar = false;
  }

exportToPDF() {

    const financials = [this.typeOfFinancials, "", "", "", ""]
    const companies = ["" ,this.selectedCompanyOne.companyname, this.selectedCompanyTwo.companyname, this.selectedCompanyThree.companyname, this.selectedCompanyFour.companyname]
    const scenarios = ["", this.selectedSenarioForCompOne, this.selectedSenarioForCompTwo, this.selectedSenarioForCompThree, this.selectedSenarioForCompFour]
        
  
    const headersOne = financials.map( (name, index) => {
      if(index == 0){
        return {text: name, bold: true, fillColor: '#fff', color: "#000", margin: [10, 10, 0, 10], border: [0, 0, 0, 0], alignment: "left"}
      }
      else{
        return {text: name, bold: true, fillColor: '#fff', color: "#000", margin: [0, 10, 0, 10], border: [0, 0, 0, 0], alignment: "center"}
      }
    })

    const headersTwo = scenarios.map( (name, index) => {
      if(index == 0){
        return {text: "", bold: true, fillColor: '#164A5B', color: "#fff", margin: [10, 10, 0, 10], border: [10, 10, 10, 10], alignment: "left"}
      }
      else{
        return {text: "Scenario " + name , bold: true, fillColor: '#164A5B', color: "#fff", margin: [0, 10, 0, 10], border: [10, 10, 10, 10], alignment: "center"}
      }
    })

    const headersThree = companies.map( (name, index) => {
      if(index == 0){
        return {text: "", bold: true, fillColor: '#164A5B', color: "#fff", margin: [10, 10, 0, 10], border: [10, 10, 10, 10], alignment: "left"}
      }
      else{
        return {text: name, bold: true, fillColor: '#164A5B', color: "#fff", margin: [0, 10, 0, 10], border: [10, 10, 10, 10], alignment: "center"}
      }
    })

    let BMAOne : any = {};
    let BMPOne : any = {};

    let BMATwo : any = {};
    let BMPTwo : any = {};

    let BMAThree : any = {};
    let BMPThree : any = {};

    let BMAFour : any = {};
    let BMPFour : any = {};

    if(this.typeOfFinancials == "Historical"){
      BMAOne = this.benchmarkingActualsOne
      BMATwo = this.benchmarkingActualsTwo
      BMAThree = this.benchmarkingActualsThree
      BMAFour = this.benchmarkingActualsFour
    }
    else{
      BMPOne = this.benchmarkingProjectionsOne
      BMPTwo = this.benchmarkingProjectionsTwo
      BMPThree = this.benchmarkingProjectionsThree
      BMPFour = this.benchmarkingProjectionsFour
    }

    const revCagr = ["Historical Revenue CAGR"].concat(BMAOne?.avgrevenuecagr).concat(BMATwo?.avgrevenuecagr).concat(BMAThree?.avgrevenuecagr).concat(BMAFour?.avgrevenuecagr);
    const ebitdaMargin = ["Avg. EBITDA Margin"].concat(BMAOne?.avgebitdamargin).concat(BMATwo?.avgebitdamargin).concat(BMAThree?.avgebitdamargin).concat(BMAFour?.avgebitdamargin);
    const netIncomeMargin = ["Avg. Net Income Margin "].concat(BMAOne?.avgnetincomemargin).concat(BMATwo?.avgnetincomemargin).concat(BMAThree?.avgnetincomemargin).concat(BMAFour?.avgnetincomemargin);
    const OROA = ["Operating Return on Assets (ROA)"].concat(BMAOne?.operatingreturnassets).concat(BMATwo?.operatingreturnassets).concat(BMAThree?.operatingreturnassets).concat(BMAFour?.operatingreturnassets);
    const ROA = ["Return on Assets (ROA)"].concat(BMAOne?.returnassets).concat(BMATwo?.returnassets).concat(BMAThree?.returnassets).concat(BMAFour?.returnassets);
    const ROTC = ["Return on Total Capital"].concat(BMAOne?.returntotalcapital).concat(BMATwo?.returntotalcapital).concat(BMAThree?.returntotalcapital).concat(BMAFour?.returntotalcapital);
    const ROE = ["Return on Equity (ROE)"].concat(BMAOne?.returnequity).concat(BMATwo?.returnequity).concat(BMAThree?.returnequity).concat(BMAFour?.returnequity);
    const CR = ["Current Ratio "].concat(BMAOne?.currentratio).concat(BMATwo?.currentratio).concat(BMAThree?.currentratio).concat(BMAFour?.currentratio);
    const QR = [" Quick Ratio "].concat(BMAOne?.quickratio).concat(BMATwo?.quickratio).concat(BMAThree?.quickratio).concat(BMAFour?.quickratio);
    const CashR = ["Cash Ratio"].concat(BMAOne?.cashratio).concat(BMATwo?.cashratio).concat(BMAThree?.cashratio).concat(BMAFour?.cashratio);
    const SR = ["Solvency Ratio "].concat(BMAOne?.solvencyratio).concat(BMATwo?.solvencyratio).concat(BMAThree?.solvencyratio).concat(BMAFour?.solvencyratio);
    const DE = ["Debt-to-Equity "].concat(BMAOne?.debtequity).concat(BMATwo?.debtequity).concat(BMAThree?.debtequity).concat(BMAFour?.debtequity);
    const DA = ["Debt-to-Assets "].concat(BMAOne?.debtassets).concat(BMATwo?.debtassets).concat(BMAThree?.debtassets).concat(BMAFour?.debtassets);
    const debtToEbitda = ["Net Debt-to-EBITDA "].concat(BMAOne?.netdebtebitda).concat(BMATwo?.netdebtebitda).concat(BMAThree?.netdebtebitda).concat(BMAFour?.netdebtebitda);
    const ICR = ["Interest Coverage Ratio "].concat(BMAOne?.interestcoverageratio).concat(BMATwo?.interestcoverageratio).concat(BMAThree?.interestcoverageratio).concat(BMAFour?.interestcoverageratio);
    const TDE : any = ["Total Debt-to-EBITDA"].concat([""]).concat([""]).concat([""]).concat([""]);
    const DSCR = [" Debt Service Coverage Ratio "].concat(BMAOne?.debtcoverageratio).concat(BMATwo?.debtcoverageratio).concat(BMAThree?.debtcoverageratio).concat(BMAFour?.debtcoverageratio);


    const revCagrArray = this.getMappedArr(revCagr, "%")
    const ebitdaMarginArray = this.getMappedArr(ebitdaMargin, "%")
    const netIncomeMarginArray = this.getMappedArr(netIncomeMargin, "%")
    const OROAArray = this.getMappedArr(OROA, "%")
    const ROAArray = this.getMappedArr(ROA, "%")
    const ROTCArray = this.getMappedArr(ROTC, "%")
    const ROEArray = this.getMappedArr(ROE, "%")
    const CRArray = this.getMappedArr(CR, "x")

    const QRArray = this.getMappedArr(QR, "x")
    const CashRArray = this.getMappedArr(CashR, "x")
    const SRArray = this.getMappedArr(SR, "x");
    const DEArray = this.getMappedArr(DE, "%")
    const DAArray = this.getMappedArr(DA, "%")
    const debtToEbitdaArray = this.getMappedArr(debtToEbitda, "x")
    const ICRArray = this.getMappedArr(ICR, "x")
    const TDEArray = this.getMappedArr(TDE, "x")
    const DSCRArray = this.getMappedArr(DSCR, "x");

    const finalArray : any = []

    finalArray.push(headersOne);
    finalArray.push(headersTwo);
    finalArray.push(headersThree);
    finalArray.push(revCagrArray);
    finalArray.push(ebitdaMarginArray)
    ;
    finalArray.push(netIncomeMarginArray);
    finalArray.push(OROAArray);
    finalArray.push(ROAArray);
    finalArray.push(ROTCArray);
    finalArray.push(ROEArray);
    finalArray.push(CRArray)
    ;
    finalArray.push(QRArray);
    finalArray.push(CashRArray);
    finalArray.push(SRArray);
    finalArray.push(DEArray);
    finalArray.push(DAArray);
    finalArray.push(debtToEbitdaArray);
    finalArray.push(ICRArray)
    ;
    finalArray.push(TDEArray);
    finalArray.push(DSCRArray);

    console.log(finalArray)

    // var canvas = document.createElement('canvas');
    // canvas.width = this.imagecanvas.nativeElement.width;
    // canvas.height = this.imagecanvas.nativeElement.height;
    // canvas.getContext('2d').drawImage(this.imagecanvas.nativeElement, 0, 0);
    // const imagermi = canvas.toDataURL('image/png');

    let docDefinition = {
      pageSize: {
        width: 800,
        height: "auto",
      },

      pageMargins: [40, 40, 40, 40],

      content: [
        // { image: imagermi, width: 150, height: 75 },
        // { image: imagermi, width: 150, height: 75 },
        {
          text: "Benchmarking",
          style: 'header',
        },
        {
          //style: 'tableExample',
          // layout: 'lightHorizontalLines',
          // style: 'tableExample',
          table: {
            headerRows: 3,
            heights: 20,
            // width:'auto',
            widths: [250, 100, 100, 100, 100],
            body: finalArray
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
          margin: [10, 50, 10, 10],
        },
      },
    };
    

    pdfMake.createPdf(docDefinition).download();
  }

  getMappedArr(inputArr, suffix) {
    const arr = inputArr.map((value:any, index) => {
      if(index == 0){
        return  {
          text: value,
          margin: [0, 10, 0, 10],          
          alignment: 'left',
          bold: true,
        };
      }
      else{
        return  {
          text: value ?  +value.toFixed(1) + "" + suffix : "" + suffix,
          margin: [0, 10, 0, 10],
          alignment: 'center',
          bold: false,
        };
      }
    });

    return arr;
  }




}
