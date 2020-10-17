import { Component, OnInit } from '@angular/core';
import {UserDetailModelService} from '../../user-detail-model.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  scenarioArray:any=[];
  constructor(private UserDetailModelService:UserDetailModelService) { }

  ngOnInit() {
  }
  scenarioNumber(){
    this.scenarioArray = this.UserDetailModelService.getScenarioNumber();
  }
}
