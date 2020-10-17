import { Component, OnInit } from '@angular/core';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { RMIAPIsService } from '../../shared/rmiapis.service';
import {UserDetailModelService} from '../../shared/user-detail-model.service';
import {MatSnackBar,MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import draggable from "highcharts/modules/draggable-points";
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
draggable(Highcharts);
@Component({
  selector: 'app-visuals-is',
  templateUrl: './visuals-is.component.html',
  styleUrls: ['./visuals-is.component.scss']
})

export class VisualsISComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  inprogress: boolean = true;
  progressBar:boolean;
  RGOptions:{};
  COGSOptions:{};
  SGAOptions:{};
  DAOptions:{};
  OIEOptions:{};
  NIEOptions:{};
  PTROptions:{};
  PGPOptions:{};
  PEBITOptions:{};
  PEBITDAOptions:{};
  PEBTOptions:{};
  PNIOptions:{};
  yearsArray=[];
  scenarioArray=[];
  scenario=this.UserDetailModelService.getSelectedScenario();
  companyName=this.UserDetailModelService.getSelectedCompany();
  financialObj = new Map();
  Highcharts = Highcharts;
  constructor(
    private urlConfig:UrlConfigService,
    private apiService:RMIAPIsService,
    private UserDetailModelService:UserDetailModelService,
    private _snackBar: MatSnackBar,
    ) { 
    }
 
  ngOnInit() {
    console.log("scenario",this.scenario)
  let that=this;
  const RGArray=[];
  const COGSArray=[];
  const SGAArray=[];
  const DAArray=[];
  const OIEArray=[];
  const NIEArray=[];
  var previousAmount;

      this.apiService.getData(this.urlConfig.getIsActualsAPI()+this.companyName).subscribe((res:any)=>{
      this.progressBar=true;
      for (let j=0; j<res.length; j++) {
        if( res[j].latest === 0){
          previousAmount = res[j].totalrevenue;
        }
      this.financialObj.set(res[j].asof,{
        "totalRevenue":res[j].totalrevenue,
        "p_GrossProfit" : res[j].grossprofit, 
        "p_EBIT" : res[j].ebit, 
        "p_EBITDA" : res[j].ebitda, 
        "p_EBT" : res[j].ebt,
        "p_NetInCome" : res[j].netincome,
        "latest" : res[j].latest,
        "revenuepercent" : res[j].revenuepercent,
        "sgapercent" : res[j].sgapercent,
        "cogspercent" : res[j].cogspercent,
        "dapercent" : res[j].dapercent,
        "netIterestExpense" : res[j].netinterest
          });
        }
    this.apiService.getData(this.urlConfig.getScenarioAPI()+this.companyName).subscribe((res:any)=>{
      
      this.scenarioArray=res.scenarios;
     this.UserDetailModelService.setScenarioNumber(this.scenarioArray);
      let scenarioNumber=0;
      if(res.scenarios.includes(this.scenario)){
        scenarioNumber=this.scenario;
        this.inprogress=false;
      }
      else{
        this.inprogress = true;
      }
      this.apiService.getData(this.urlConfig.getIsProjectionsAPIGET()+this.companyName+"&scenario="+scenarioNumber).subscribe((res:any)=>{
        this.progressBar=false;
        let totalRevenue=0;  
        for (let j=0; j<res.length; j++) {
          if(j == 0){
              totalRevenue = Math.round(previousAmount + (previousAmount * (res[j].revenuepercent/100)));
          }else{
              totalRevenue = Math.round(res[j-1].totalRevenue + (res[j-1].totalRevenue * (res[j].revenuepercent/100)));
          }
          this.financialObj.set(res[j].asof,{
                  "totalRevenue": totalRevenue,
                  "revenueGrowth" : res[j].revenuepercent, 
                  "COGS" : res[j].cogspercent, 
                  "SGAndA" : res[j].sgapercent, 
                  "DAndA" : res[j].dapercent,
                  "netIterestExpense" : res[j].netinterestdollars,
                  "otherIncomeOrExpense" :res[j].otherincomepercent,
                  "netinterest" : res[j].netinterest,
                  "latest" : res[j].latest,
                  "taxes" :res[j].taxespercent,
                  // "latest" : res[j].latest
                  "revenuepercent" : res[j].revenuepercent,
                  "sgapercent" : res[j].sgapercent,
                  "cogspercent" : res[j].cogspercent,
                  "dapercent" : res[j].dapercent
          });
        }
        
          this.financialObj.forEach((v,k) => {
            this.yearsArray.push(k);
            RGArray.push((v.revenuepercent == undefined)?0: v.revenuepercent);
            COGSArray.push((v.cogspercent == undefined)?0: v.cogspercent );
            SGAArray.push((v.sgapercent == undefined)?0:v.sgapercent );
            DAArray.push((v.revenuepercent == undefined)?0: v.revenuepercent );
            OIEArray.push((v.otherincomepercent == undefined)?0: v.otherincomepercent );
            NIEArray.push((v.netIterestExpense == undefined)?0:v.netIterestExpense );
          });
          this.RGOptions = {
          chart: {type: 'column',animation:false},
          title: {text: 'Revenue Growth'},  
          yAxis: {title: {text: 'In Percentage %'}},
          xAxis: {categories: this.yearsArray},
          colors: ['skyblue','skyblue','grey','grey','grey','grey','grey'],
           plotOptions: {
            series: {stickyTracking: true,
              dragDrop: {draggableY: true},
              point: {
                events: {
                    drag: function (e) {
                        // console.log("drag",e);
                    },
                    drop: function (e) {  
                      that.financialObj.get(e.target.category).revenueGrowth = e.target.y;
                      console.log("inside chart",that.financialObj); 
                      that.updateProjection();  //this line is showing value of financialObj undefined.
                      //but financialObj is global and it consists of Data
                      // this.columnDrag(e.target.y,e.target.category,"RG");
                      // this.updateProjection(this.financialObj);
                    }
                }
            },
            }, 
          column: {stacking: "normal",minPointLength: 2,colorByPoint: true},
          line: {cursor: "ns-resize"}},
          tooltip: {split: true,valueSuffix: ' millions'},
          credits: {enabled: false},
          exporting: {enabled: false},
          series: [{data:RGArray, dragDrop: {draggableY: true},minPointLength: 2}],
          legend: false
        };   
        this.COGSOptions = {
            chart: {type: 'column',animation:false},
            title: {text: 'COGS'},  
            yAxis: {title: {text: 'As % of Revenue'}},
            xAxis: {categories: this.yearsArray},
             plotOptions: {
              series: {stickyTracking: false,
                dragDrop: {draggableY: true},
                point: {
                  events: {
                      drag: function (e) {
                          // console.log("drag",e);
                      },
                      drop: function (e) {  
                        that.financialObj.get(e.target.category).COGS = e.target.y;
                      console.log("inside chart",that.financialObj); 
                      that.updateProjection();
                      }
                  }
              },
              },
              column: {stacking: "normal",minPointLength: 2},
              line: {cursor: "ns-resize"}},
            tooltip: {split: true,valueSuffix: ' millions'},
            credits: {enabled: false},
            exporting: {enabled: false},
            series: [{data:COGSArray, dragDrop: {draggableY: true}}],
            legend: false
          };
          this.SGAOptions = {
            chart: {type: 'column',animation:false},
            title: {text: 'SGA'},  
            yAxis: {title: {text: 'As % of Revenue'}},
            xAxis: {categories: this.yearsArray},
             plotOptions: {
              series: {stickyTracking: false,
                dragDrop: {draggableY: true},
                point: {
                  events: {
                      drag: function (e) {
                          // console.log("drag",e);
                      },
                      drop: function (e) {  
                        that.financialObj.get(e.target.category).SGAndA = e.target.y;
                        console.log("inside chart",that.financialObj); 
                        that.updateProjection();
                        
                      }
                  }
              },
              },
              column: {stacking: "normal",minPointLength: 2},
              line: {cursor: "ns-resize"}},
            tooltip: {split: true,valueSuffix: ' millions'},
            credits: {enabled: false},
            exporting: {enabled: false},
            series: [{data:SGAArray, dragDrop: {draggableY: true}}],
            legend: false
          };
          this.DAOptions = {
            chart: {type: 'column',animation:false},
            title: {text: 'D&A'},  
            yAxis: {title: {
            text: 'As % of Revenue'}},
            xAxis: {categories: this.yearsArray},
             plotOptions: {
              series: {stickyTracking: false,
                dragDrop: {draggableY: true},
                point: {
                  events: {
                      drag: function (e) {
                          // console.log("drag",e);
                      },
                      drop: function (e) {  
                        that.financialObj.get(e.target.category).DAndA = e.target.y;
                      console.log("inside chart",that.financialObj); 
                      that.updateProjection();
                      }
                  }
              },
              },
              column: {stacking: "normal",minPointLength: 2},
              line: {cursor: "ns-resize"}},
            tooltip: {split: true,valueSuffix: ' millions'},
            credits: {enabled: false},
            exporting: {enabled: false},
            series: [{data:DAArray, dragDrop: {draggableY: true}}],
      
            legend: false
          };
          this.OIEOptions = {
            chart: {type: 'column',animation:false},
            title: {text: 'Other Income/Expense'},  
            yAxis: {title: {text: 'As % of Revenue'}},
            xAxis: {categories:this.yearsArray},
             plotOptions: {
              series: {stickyTracking: false,
                dragDrop: {draggableY: true},
                point: {
                  events: {
                      drag: function (e) {
                          // console.log("drag",e);
                      },
                      drop: function (e) {  
                        that.financialObj.get(e.target.category).otherIncomeOrExpense= e.target.y;
                      console.log("inside chart",that.financialObj); 
                      that.updateProjection();
                      }
                  }
              },
              },
              column: {stacking: "normal",minPointLength: 2},
              line: {cursor: "ns-resize"}},
            tooltip: {split: true,valueSuffix: ' millions'},
            credits: {enabled: false},
            exporting: {enabled: false},
            series: [{data:OIEArray, dragDrop: {draggableY: true}}],
            legend: false
          };
          this.NIEOptions = {
            chart: {type: 'column',animation:false},
            title: {text: 'Net Interest Expense'},  
            yAxis: {title: {text: 'USD'}},
            xAxis: {categories: this.yearsArray},
             plotOptions: {
              series: {stickyTracking: false,
                dragDrop: {draggableY: true},
                point: {
                  events: {
                      drag: function (e) {
                          // console.log("drag",e);
                      },
                      drop: function (e) {  
                        that.financialObj.get(e.target.category).netIterestExpense = e.target.y;
                      console.log("inside chart",that.financialObj); 
                      that.updateProjection();
                      }
                  }
              },
              },
              column: {stacking: "normal",minPointLength: 2},
              line: {cursor: "ns-resize"}},
            tooltip: {split: true,valueSuffix: ' millions'},
            credits: {enabled: false},
            exporting: {enabled: false},
            series: [{data:NIEArray, dragDrop: {draggableY: true}}],
            legend: false
          }; 
          this.updateProjection();
        });//end of projections
      });//end of Save Scenarios

    });//end of actuals

HC_exporting(Highcharts);
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
   
 
     
       
  }

  updateProjection(){
    // console.log("before updateProjection",this.financialObj);
    let PTRArray = [];
    let PGPArray = [];
    let PEBITArray = [];
    let PEBITDAArray = [];
    let PEBTArray = [];
    let PNIArray =[];
    let lastKey = 0;
    for (let [key, value] of this.financialObj) {
      if(typeof this.financialObj.get(key).COGS !== 'undefined'){
        console.log(this.financialObj.get(key).totalRevenue);
        console.log((this.financialObj.get(key).COGS/100));
      this.financialObj.get(key).totalRevenue = Math.round(this.financialObj.get(lastKey).totalRevenue + (this.financialObj.get(lastKey).totalRevenue * (this.financialObj.get(key).revenueGrowth/100)));
      this.financialObj.get(key).p_COGS = Math.round(this.financialObj.get(key).totalRevenue * (this.financialObj.get(key).COGS/100));
      this.financialObj.get(key).p_GrossProfit = Math.round(this.financialObj.get(key).totalRevenue - this.financialObj.get(key).p_COGS);
      this.financialObj.get(key).p_SGAndA = Math.round(this.financialObj.get(key).totalRevenue * (this.financialObj.get(key).SGAndA/100));
      this.financialObj.get(key).p_EBIT = Math.round(this.financialObj.get(key).p_GrossProfit - this.financialObj.get(key).p_SGAndA);
      this.financialObj.get(key).p_DAndA = Math.round(this.financialObj.get(key).totalRevenue * (this.financialObj.get(key).DAndA/100));
      this.financialObj.get(key).p_EBITDA = Math.round(this.financialObj.get(key).p_EBIT + this.financialObj.get(key).p_DAndA);
      this.financialObj.get(key).p_NIE = this.financialObj.get(key).netIterestExpense;
      this.financialObj.get(key).p_OIOrE = Math.round(this.financialObj.get(key).totalRevenue * (this.financialObj.get(key).otherIncomeOrExpense/100));
      this.financialObj.get(key).p_EBT = Math.round(this.financialObj.get(key).p_EBIT - this.financialObj.get(key).p_NIE - this.financialObj.get(key).p_OIOrE);
      this.financialObj.get(key).p_taxes = Math.round(this.financialObj.get(key).p_EBT * (this.financialObj.get(key).taxes/100));
      this.financialObj.get(key).p_NetInCome = this.financialObj.get(key).p_EBT - this.financialObj.get(key).p_taxes;
                //revenueGrowthArray.push(obj.get(key).revenueGrowth);
                }
                PTRArray.push(this.financialObj.get(key).totalRevenue);
                PGPArray.push(this.financialObj.get(key).p_GrossProfit);
                PEBITArray.push(this.financialObj.get(key).p_EBIT);
                PEBITDAArray.push(this.financialObj.get(key).p_EBITDA);
                PEBTArray.push(this.financialObj.get(key).p_EBT);
                PNIArray.push(this.financialObj.get(key).p_NetInCome);
                lastKey = key;
        }
        this.PTROptions = {
          chart: {type: 'column',animation:false},
          title: {text: 'Total Revenue'},  
          yAxis: {title: { text: 'USD'}},
          xAxis: {categories: this.yearsArray},
           plotOptions: {
            series: {stickyTracking: false},
            column: {stacking: "normal",minPointLength: 2},
            line: {cursor: "ns-resize"}},
          tooltip: {split: true,valueSuffix: ' millions'},
          credits: {enabled: false},
          exporting: {enabled: false},
          series: [{data:PTRArray}],
          legend: false
        };
        this.PGPOptions = {
          chart: {type: 'column',animation:false},
          title: {text: 'Gross Profit'},  
          yAxis: {title: {text: 'USD'}},
          xAxis: {categories: this.yearsArray},
           plotOptions: {
            series: {stickyTracking: false},
            column: {stacking: "normal",minPointLength: 2},
            line: {cursor: "ns-resize"}},
          tooltip: {split: true,valueSuffix: ' millions'},
          credits: {enabled: false},
          exporting: {enabled: false},
          series: [{data:PGPArray}],
          legend: false
        }; 
        this.PEBITOptions = {
          chart: {type: 'column',animation:false},
          title: {text: 'EBIT'},  
          yAxis: {title: {text: 'USD'}},
          xAxis: {categories: this.yearsArray},
           plotOptions: {
            series: {stickyTracking: false},
            column: {stacking: "normal",minPointLength: 2},
            line: {cursor: "ns-resize"}},
          tooltip: {split: true,valueSuffix: ' millions'},
          credits: {enabled: false},
          exporting: {enabled: false},
          series: [{data:PEBITArray}],
          legend: false
        }; 
        this.PEBITDAOptions = {
          chart: {type: 'column',animation:false},
          title: {text: 'EBITDA'},  
          yAxis: {title: {text: 'USD'}},
          xAxis: {categories: this.yearsArray},
           plotOptions: {
            series: {stickyTracking: false},
            column: {stacking: "normal",minPointLength: 2},
            line: {cursor: "ns-resize"}},
          tooltip: {split: true,valueSuffix: ' millions'},
          credits: {enabled: false},
          exporting: {enabled: false},
          series: [{data:PEBITDAArray}],
          legend: false
        }; 
        this.PEBTOptions = {
          chart: {type: 'column',animation:false},
          title: {text: 'EBT'},  
          yAxis: {title: {text: 'USD' }},
          xAxis: {categories: this.yearsArray},
           plotOptions: {
            series: {stickyTracking: false},
            column: {stacking: "normal",minPointLength: 2},
            line: {cursor: "ns-resize"}},
          tooltip: {split: true,valueSuffix: ' millions'},
          credits: {enabled: false},
          exporting: {enabled: false},
          series: [{data:PEBTArray}],
          legend: false
        }; 
        this.PNIOptions = {
          chart: {type: 'column',animation:false},
          title: {text: 'Net Income'},  
          yAxis: {title: {text: 'USD'}},
          xAxis: {categories: this.yearsArray},
           plotOptions: {
            series: {stickyTracking: false},
            column: {stacking: "normal",minPointLength: 2},
            line: {cursor: "ns-resize"}},
          tooltip: {split: true,valueSuffix: ' millions'},
          credits: {enabled: false},
          exporting: {enabled: false},
          series: [{data:PNIArray}],
          legend: false
        }; 
       
  }

  
  saveScenario(){
  let inputArray=[];
  let inputArrayJSON;
  for (let [key, value] of this.financialObj) {
      let inputObj:any = {};
     
        if(typeof this.financialObj.get(key).COGS !== 'undefined'){
          inputObj.asof = key.toString();
          inputObj.cogs = this.financialObj.get(key).p_COGS;
          inputObj.cogspercent = this.financialObj.get(key).COGS;
          inputObj.companyname = this.companyName;
          inputObj.da = this.financialObj.get(key).p_DAndA;
          inputObj.dapercent = this.financialObj.get(key).DAndA;
          inputObj.ebit = this.financialObj.get(key).p_EBIT;
          inputObj.ebitda = this.financialObj.get(key).p_EBITDA
          inputObj.ebitdamargin = Math.round((this.financialObj.get(key).p_EBITDA / this.financialObj.get(key).totalRevenue) * 100);
          inputObj.ebitmargin = Math.round((this.financialObj.get(key).p_EBIT / this.financialObj.get(key).totalRevenue) * 100);
          inputObj.ebt = this.financialObj.get(key).p_EBT;
          inputObj.ebtmargin = Math.round((this.financialObj.get(key).p_EBT / this.financialObj.get(key).totalRevenue) * 100);
          inputObj.grossprofit = this.financialObj.get(key).p_GrossProfit;
          inputObj.grossprofitmargin = Math.round((this.financialObj.get(key).p_GrossProfit / this.financialObj.get(key).totalRevenue) * 100);
          inputObj.latest = this.financialObj.get(key).latest; 
          inputObj.netincome = this.financialObj.get(key).p_NetInCome;
          inputObj.netincomemargin = Math.round((this.financialObj.get(key).p_NetInCome / this.financialObj.get(key).totalRevenue) * 100);
          inputObj.netinterest =  this.financialObj.get(key).netinterest;
          inputObj.netinterestdollars = this.financialObj.get(key).netIterestExpense; /****/
          inputObj.otherincome = this.financialObj.get(key).p_OIOrE;
          inputObj.otherincomepercent = this.financialObj.get(key).otherIncomeOrExpense;
          inputObj.revenuepercent = this.financialObj.get(key).revenueGrowth;
          inputObj.scenario = this.scenario;
          inputObj.sga = this.financialObj.get(key).p_SGAndA;
          inputObj.sgapercent = this.financialObj.get(key).SGAndA;
          inputObj.taxes = this.financialObj.get(key).p_taxes;
          inputObj.taxespercent = this.financialObj.get(key).taxes;
          inputObj.totalrevenue = this.financialObj.get(key).totalRevenue;
          inputArray.push(inputObj);
          inputArrayJSON=JSON.stringify(inputArray);
        }
    }
    this.apiService.postData(this.urlConfig.getIsProjectionsAPIPOST()+this.companyName,inputArrayJSON).subscribe((res:any)=>{
      if(true){
        this._snackBar.openFromComponent(uploadSnackBarComponent, {
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
        }
        else{
          this._snackBar.openFromComponent(uploadFailureSnackBarComponent, {
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition
          });
        }
    });
    this.ngOnInit();
    } 
    //end of save
    addScenario(){
      let existingScenarios = this.UserDetailModelService.getScenarioNumber();
      if(existingScenarios.length < 9){
        this.scenario = existingScenarios.length ;
        console.log("this.scenario",this.scenario);
        this.ngOnInit();
      }
    }
    loadScenario(index:number){
      if(index != 0){
        this.scenario = index;
        this.ngOnInit();
      }
    }
}

@Component({
  selector: 'snackBar',
  templateUrl: 'snackBar.html',
  styles: [`
    .snackBar{
      color: #fff;
    }
    b{
      color:#fff !important;
    }
    .material-icons{
      color:lightgreen;
    }
  `],
})
export class uploadSnackBarComponent {}

@Component({
  selector: 'snackBar',
  templateUrl: 'snackBar.html',
  styles: [`
    .snackBar{
      color: #fff;
    }
    b{
      color:#fff !important;
    }
    .material-icons{
      color:lightgreen;
    }
  `],
})
export class uploadFailureSnackBarComponent {}