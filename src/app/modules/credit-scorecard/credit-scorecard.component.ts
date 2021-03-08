import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/shared/excel.service';

@Component({
  selector: 'app-credit-scorecard',
  templateUrl: './credit-scorecard.component.html',
  styleUrls: ['./credit-scorecard.component.scss']
})
export class CreditScorecardComponent implements OnInit {

  constructor(public excelService : ExcelService) { }

  ngOnInit(): void {
this.excelService.selectedDashboardMenu = 'scorecard'
  }

}
