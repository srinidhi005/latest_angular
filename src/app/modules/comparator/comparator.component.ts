import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-comparator',
  templateUrl: './comparator.component.html',
  styleUrls: ['./comparator.component.scss']
})
export class ComparatorComponent implements OnInit {

  constructor(private urlConfig : UrlConfigService, private apiService : RMIAPIsService) { }


  selectedCompanyOne;
  selectedCompanyTwo;
  selectedCompanyThree;
  selectedCompanyFour;
   
  selectedSenarioForCompOne;
  selectedSenarioForCompTwo;
  selectedSenarioForCompThree;
  selectedSenarioForCompFour;

  typeOfFinancials = "Historical";
  
  nickname;
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
    this.progressBar = true;
    this.nickname = localStorage.getItem('nickname');

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
      }
      else if(index == 2){
        this.selectedCompanyTwo = cloneDeep(srcObj)
        selectedComp = srcObj
        selectedScenario = this.selectedSenarioForCompTwo
      }
      else if(index == 3){
        this.selectedCompanyThree = cloneDeep(srcObj)
        selectedComp = srcObj
        selectedScenario = this.selectedSenarioForCompThree
      }
	  else {
        this.selectedCompanyFour = cloneDeep(srcObj)
        selectedComp = srcObj
        selectedScenario = this.selectedSenarioForCompFour
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
      console.log("failed to fetch Benchmarking Actuals", error)
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
      console.log("failed to fetch Benchmarking Projections", error)
    }

    this.progressBar = false;
  }

  loadFinancials(type){
    this.typeOfFinancials = type;
  }

  async loadComparator(){
    this.progressBar = true;
    try {
      const companiesAPIData : any = await this.apiService.getData(this.urlConfig.getStatementAPI() + this.nickname).toPromise();
      this.allCompanies = companiesAPIData.map( comp => { 
        return {companyname: comp.companyname, company: comp.company};
      })
    } catch (error) {
      console.log("Failed to fetch Statements data", error);
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
      console.log("failed to fetch Scenarios for Comp One", error)
    }

    try {
      const scenariosTwo : any = await this.apiService.getData(this.urlConfig.getScenarioAPI()+this.selectedCompanyTwo.companyname).toPromise();
      this.scenariosForCompanyTwo = scenariosTwo.scenarios;
    } catch (error) {
      console.log("failed to fetch Scenarios for Comp Two", error)
    }

    try {
      const scenariosThree : any = await this.apiService.getData(this.urlConfig.getScenarioAPI()+this.selectedCompanyThree.companyname).toPromise();
      this.scenariosForCompanyThree = scenariosThree.scenarios;
    } catch (error) {
      console.log("failed to fetch Scenarios for Comp Three", error)
    }
	
	try {
      const scenariosFour : any = await this.apiService.getData(this.urlConfig.getScenarioAPI()+this.selectedCompanyFour.companyname).toPromise();
      this.scenariosForCompanyFour = scenariosFour.scenarios;
    } catch (error) {
      console.log("failed to fetch Scenarios for Comp Four", error)
    }


    try {
      const bmActualsOne =  await this.apiService.getData(this.urlConfig.getBenchmarkingActualsAPI() + this.selectedCompanyOne.companyname).toPromise();
      this.benchmarkingActualsOne = bmActualsOne[0];
    } catch (error) {
      console.log("failed to fetch Scenarios for Comp One", error)
    }

    try {
      const bmProjectedOne = await this.apiService.getData(this.urlConfig.getBenchmarkingProjectionsAPI() + this.selectedCompanyOne.companyname+ "&scenario=" + this.selectedSenarioForCompOne).toPromise();
      this.benchmarkingProjectionsOne = bmProjectedOne[0];
    } catch (error) {
      console.log("failed to fetch Benchmarking Projections for Comp One", error)
    }

    try {
      const bmActualsTwo = await this.apiService.getData(this.urlConfig.getBenchmarkingActualsAPI() + this.selectedCompanyTwo.companyname).toPromise();
      this.benchmarkingActualsTwo = bmActualsTwo[0];
    } catch (error) {
      console.log("failed to fetch Benchmarking Actuals for Comp Two", error)
    }

    try {
      const bmProjectedTwo = await this.apiService.getData(this.urlConfig.getBenchmarkingProjectionsAPI() + this.selectedCompanyTwo.companyname + "&scenario=" + this.selectedSenarioForCompTwo).toPromise();
      this.benchmarkingProjectionsTwo = bmProjectedTwo[0];
    } catch (error) {
      console.log("failed to fetch Benchmarking Projections for Comp Two", error)
    }


    try {
      const bmActualsThree = await this.apiService.getData(this.urlConfig.getBenchmarkingActualsAPI() + this.selectedCompanyThree.companyname).toPromise();
      this.benchmarkingActualsThree = bmActualsThree[0];
    } catch (error) {
      console.log("failed to fetch Benchmarking Actuals for Comp Three", error)
    }

    try {
      const bmProjectedThree = await this.apiService.getData(this.urlConfig.getBenchmarkingProjectionsAPI() + this.selectedCompanyThree.companyname + "&scenario=" + this.selectedSenarioForCompThree).toPromise();
      this.benchmarkingProjectionsThree = bmProjectedThree[0];
    } catch (error) {
      console.log("failed to fetch Benchmarking Projections for Comp Three", error)
    }
	
	try {
      const bmActualsFour = await this.apiService.getData(this.urlConfig.getBenchmarkingActualsAPI() + this.selectedCompanyFour.companyname).toPromise();
      this.benchmarkingActualsFour = bmActualsFour[0];
    } catch (error) {
      console.log("failed to fetch Benchmarking Actuals for Comp Four", error)
    }
	
	
	try {
      const bmProjectedFour = await this.apiService.getData(this.urlConfig.getBenchmarkingProjectionsAPI() + this.selectedCompanyFour.companyname + "&scenario=" + this.selectedSenarioForCompFour).toPromise();
      this.benchmarkingProjectionsFour = bmProjectedFour[0];
    } catch (error) {
      console.log("failed to fetch Benchmarking Projections for Comp Four", error)
    }
	
	
    this.progressBar = false;
  }

}
