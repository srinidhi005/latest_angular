import { Component, OnInit } from '@angular/core';
import { RMIAPIsService } from 'src/app/shared/rmiapis.service';
import { UrlConfigService } from 'src/app/shared/url-config.service';

@Component({
  selector: 'app-credit-scorecard',
  templateUrl: './credit-scorecard.component.html',
  styleUrls: ['./credit-scorecard.component.scss']
})
export class CreditScorecardComponent implements OnInit {

  companySelected = localStorage.getItem('companySelected');
	scoreCardData
	sumProduct
  //scoreCardData = {"avgebitdamargin": 4.0, "avggrossmargin": 5.0, "capexpercent": 5.0, "companyname": "Nike2547781", "currentratio": 5.0, "ebitdacagr": 2.0, "factorweight": 10.0, "fromyear": 2017, "overallscorecard": 4.4, "returnassets": 5.0, "returnequity": 4.0, "revenuecagr": 4.0, "solvencyratio": 5.0, "totaldebtebitda": 5.0, "toyear": 2018}

  constructor(     private apiService: RMIAPIsService,
    private urlConfig: UrlConfigService) { }

  ngOnInit(): void {
    this.apiService.getData(this.urlConfig.getCreditScoreCardAPI() + this.companySelected).subscribe( res => {
      console.log("RES", res);
	  this.scoreCardData=res[0];
	  
	  this.sumProduct=(((this.scoreCardData.revenuecagr)*(this.scoreCardData.factorweight/100))+
	  ((this.scoreCardData.avggrossmargin)*(this.scoreCardData.factorweight/100))+
	  ((this.scoreCardData.avgebitdamargin)*(this.scoreCardData.factorweight/100))+
	  ((this.scoreCardData.totaldebtebitda)*(this.scoreCardData.factorweight/100))
	  +((this.scoreCardData.currentratio)*(this.scoreCardData.factorweight/100))+
	  ((this.scoreCardData.capexpercent)*(this.scoreCardData.factorweight/100))+
	  ((this.scoreCardData.returnassets)*(this.scoreCardData.factorweight/100))
	  +((this.scoreCardData.returnequity)*(this.scoreCardData.factorweight/100))+
	  ((this.scoreCardData.solvencyratio)*(this.scoreCardData.factorweight/100))+
	  ((this.scoreCardData.ebitdacagr)*(this.scoreCardData.factorweight/100)));
    console.log("socre",this.sumProduct);
	}, error => {
      console.log(error);
    })
  }

  isInSegment(lowValue, actualValue){
    return actualValue == lowValue ? true : false;
  }

}
