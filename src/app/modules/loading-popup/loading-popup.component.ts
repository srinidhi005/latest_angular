import { Component, OnInit } from '@angular/core';
import { ReportBuilderService } from 'src/app/shared/report-builder.service';

@Component({
  selector: 'app-loading-popup',
  templateUrl: './loading-popup.component.html',
  styleUrls: ['./loading-popup.component.scss']
})
export class LoadingPopupComponent implements OnInit {

  constructor(private reportService : ReportBuilderService) { }

  message = "";

  ngOnInit(): void {
    this.message = this.reportService.message;
  }

}
