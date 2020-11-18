import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserDetailModelService} from '../../user-detail-model.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  scenarioArray:any=[];
  constructor(private UserDetailModelService:UserDetailModelService, private router: Router, public userDetailModelService : UserDetailModelService) { }

  ngOnInit() {
  }
  scenarioNumber(){
    this.scenarioArray = this.UserDetailModelService.getScenarioNumber();
  }

  displayBalSheetScenario(scenarioNumber){
    console.log("scenarioNumber", scenarioNumber);
    this.userDetailModelService.setBalanceSheetScenario(scenarioNumber)
    this.router.navigate(['/visualsBS'])
  }

  displayIncomeSheetScenario(scenarioNumber){
    console.log("scenarioNumber", scenarioNumber);
    this.userDetailModelService.setIncomeSheetScenario(scenarioNumber)
    this.router.navigate(['/visualsIS'])
  }
}
