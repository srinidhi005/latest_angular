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
  selector: 'app-visuals-bs',
  templateUrl: './visuals-bs.component.html',
  styleUrls: ['./visuals-bs.component.scss']
})

export class VisualsBsComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  inprogress: boolean = true;
  progressBar:boolean;
  DSOOptions:{};
  IDOptions:{};
  OCAOptions:{};
  DPOOptions:{};
  ALOptions:{};
  OCLOptions:{};
  TCAOptions:{};
  TAOptions:{};
  TCLOptions:{};
  TLOptions:{};
  TSEOptions:{};
  TLSEOptions:{};
  yearsArray=[];
  scenarioArray=[];
  scenario=this.UserDetailModelService.getSelectedScenario();
  companyName=this.UserDetailModelService.getSelectedCompany();
  BsfinancialObj = new Map();
  Highcharts = Highcharts;
  constructor(
    private urlConfig:UrlConfigService,
    private apiService:RMIAPIsService,
    private UserDetailModelService:UserDetailModelService,
    private _snackBar: MatSnackBar,
    ) { 
    }
 
  ngOnInit() {

  let that=this;
  const DSOArray=[];
  const IDArray=[];
  const OCAArray=[];
  const DPOArray=[];
  const ALArray=[];
  const OCLArray=[];

      this.apiService.getData(this.urlConfig.getBsActualsAPI()+this.companyName).subscribe((res:any)=>{
      this.progressBar=true;
       for (let j=0; j<res.length; j++) {
           this.BsfinancialObj.set(res[j].asof,{
               "totalcurrentassets": res[j].totalcurrentassets,
               "totalassets": res[j].totalassets,
               "totalcurrentliabilities": res[j].totalcurrentliabilities,
               "totalliabilities": res[j].totalliabilities,
               "totalshareholdersequity": res[j].totalshareholdersequity,
               "totalliabilitiesandequity": res[j].totalliabilitiesandequity,
               "dso":res[j].dso,
               "inventorydays": res[j].inventorydays,
               "othercurrentassetspercent":res[j].othercurrentassetspercent,
               "dpo": res[j].dpo,
               "accruedliabilitiespercent": res[j].accruedliabilitiespercent,
               "othercurrentliabilitiespercent": res[j].othercurrentliabilitiespercent,
               "ppe":res[j].ppe,
               "goodwill":res[j].goodwill,
               "intangibleassets":res[j].intangibleassets,
               "otherassets":res[j].otherassets,
               "currentportionlongtermdebt" : res[j].currentportionlongtermdebt,
               "longtermdebt":res[j].longtermdebt,
               "otherliabilities":res[j].otherliabilities
               //"totalshareholdersequity":res[j].totalshareholdersequity
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
      this.apiService.getData(this.urlConfig.getBsProjectionsAPIGET()+this.companyName+"&scenario="+scenarioNumber).subscribe((res:any)=>{
        this.progressBar=false;
        if(Array.isArray(res)){ 
          for (let j=0; j<res.length; j++) {
            this.BsfinancialObj.set(res[j].asof,{
                "totalcurrentassets": res[j].totalcurrentassets,
                "totalassets": res[j].totalassets,
                "totalcurrentliabilities": res[j].totalcurrentliabilities,
                "totalliabilities": res[j].totalliabilities,
                "totalshareholdersequity": res[j].totalshareholdersequity,
                "totalliabilitiesandequity": res[j].totalliabilitiesandequity,
                "dso":res[j].dso,
                "inventorydays": res[j].inventorydays,
                "othercurrentassetspercent":res[j].othercurrentassetspercent,
                "dpo": res[j].dpo,
                "accruedliabilitiespercent": res[j].accruedliabilitiespercent,
                "othercurrentliabilitiespercent": res[j].othercurrentliabilitiespercent,
                "scenario": res[j].scenario,
                "otherliabilities":res[j].otherliabilities,
                "longtermdebt": res[j].longtermdebt,
                "othercurrentliabilities":res[j].othercurrentliabilities,
                "accruedliabilities": res[j].accruedliabilities,
                "accountspayable": res[j].accountspayable,
                "currentportionlongtermdebt": res[j].currentportionlongtermdebt,
                "otherassets":res[j].otherassets,
                "goodwill":res[j].goodwill,
                "intangibleassets":res[j].intangibleassets,
                "ppe":res[j].ppe,
                "inventories":res[j].inventories,
                "accountsreceivable":res[j].accountsreceivable,
                "cashequivalents":res[j].cashequivalents,
                "cogs" : res[j].ic_cogs,
                "netincome" : res[j].ic_netincome,
                "totalrevenue" : res[j].ic_totalrevenue,
                "memocheck": res[j].memocheck,
                "othercurrentassets":res[j].othercurrentassets,
                "latest":res[j].latest,                            
        });
    }
      }
          this.BsfinancialObj.forEach((v,k) => {
            this.yearsArray.push(k);
            DSOArray.push((v.dso == undefined)?0: v.dso);
            IDArray.push((v.inventorydays == undefined)?0: v.inventorydays);
            OCAArray.push((v.othercurrentassetspercent == undefined)?0: v.othercurrentassetspercent);
            DPOArray.push((v.dpo == undefined)?0: v.dpo);
            ALArray.push((v.accruedliabilitiespercent == undefined)?0: v.accruedliabilitiespercent);
            OCLArray.push((v.othercurrentliabilitiespercent == undefined)?0: v.othercurrentliabilitiespercent);
          });
          this.DSOOptions = {
          chart: {type: 'column',animation:false},
          title: {text: 'Days Sales Outstanding'},  
          yAxis: {title: {text: 'In Percentage %'}},
          xAxis: {categories: this.yearsArray},
          colors: ['skyblue','skyblue','grey','grey','grey','grey'],
           plotOptions: {
            series: {stickyTracking: true,
              dragDrop: {draggableY: true},
              point: {
                events: {
                    drag: function (e) {
                        // console.log("drag",e);
                    },
                    drop: function (e) {  
                      that.BsfinancialObj.get(e.target.category).dso = e.target.y;
                      that.updateProjection();
                    }
                }
            },
            }, 
          column: {stacking: "normal",minPointLength: 2,colorByPoint: true},
          line: {cursor: "ns-resize"}},
          tooltip: {split: true,valueSuffix: ' millions'},
          credits: {enabled: false},
          exporting: {enabled: false},
          series: [{data:DSOArray, dragDrop: {draggableY: true},minPointLength: 2}],
          legend: false
        };   
        this.IDOptions = {
            chart: {type: 'column',animation:false},
            title: {text: 'Inventory Days'},  
            yAxis: {title: {text: 'Days'}},
            xAxis: {categories: this.yearsArray},
            colors: ['skyblue','skyblue','grey','grey','grey','grey'],
             plotOptions: {
              series: {stickyTracking: false,
                dragDrop: {draggableY: true},
                point: {
                  events: {
                      drag: function (e) {
                          // console.log("drag",e);
                      },
                      drop: function (e) {  
                        that.BsfinancialObj.get(e.target.category).inventorydays = e.target.y;
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
            series: [{data:IDArray, dragDrop: {draggableY: true}}],
            legend: false
          };
          this.OCAOptions = {
            chart: {type: 'column',animation:false},
            title: {text: 'Other Current Assets'},  
            yAxis: {title: {text: 'As % of Revenue'}},
            xAxis: {categories: this.yearsArray},
            colors: ['skyblue','skyblue','grey','grey','grey','grey'],
             plotOptions: {
              series: {stickyTracking: false,
                dragDrop: {draggableY: true},
                point: {
                  events: {
                      drag: function (e) {
                          // console.log("drag",e);
                      },
                      drop: function (e) {  
                        that.BsfinancialObj.get(e.target.category).othercurrentassetspercent = e.target.y;
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
            series: [{data:OCAArray, dragDrop: {draggableY: true}}],
            legend: false
          };
          this.DPOOptions = {
            chart: {type: 'column',animation:false},
            title: {text: 'Days Payable Outstanding'},  
            yAxis: {title: {
            text: 'As % of Revenue'}},
            xAxis: {categories: this.yearsArray},
            colors: ['skyblue','skyblue','grey','grey','grey','grey'],
             plotOptions: {
              series: {stickyTracking: false,
                dragDrop: {draggableY: true},
                point: {
                  events: {
                      drag: function (e) {
                          // console.log("drag",e);
                      },
                      drop: function (e) {  
                        that.BsfinancialObj.get(e.target.category).dpo = e.target.y;
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
            series: [{data:DPOArray, dragDrop: {draggableY: true}}],
      
            legend: false
          };
          this.ALOptions = {
            chart: {type: 'column',animation:false},
            title: {text: 'Accrued Liabilities'},  
            yAxis: {title: {text: 'As % of Revenue'}},
            xAxis: {categories:this.yearsArray},
            colors: ['skyblue','skyblue','grey','grey','grey','grey'],
             plotOptions: {
              series: {stickyTracking: false,
                dragDrop: {draggableY: true},
                point: {
                  events: {
                      drag: function (e) {
                          // console.log("drag",e);
                      },
                      drop: function (e) {  
                        that.BsfinancialObj.get(e.target.category).accruedliabilitiespercent= e.target.y;
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
            series: [{data:ALArray, dragDrop: {draggableY: true}}],
            legend: false
          };
          this.OCLOptions = {
            chart: {type: 'column',animation:false},
            title: {text: 'Other Current Liabilities'},  
            yAxis: {title: {text: 'As % of COGS'}},
            xAxis: {categories: this.yearsArray},
            colors: ['skyblue','skyblue','grey','grey','grey','grey'],
             plotOptions: {
              series: {stickyTracking: false,
                dragDrop: {draggableY: true},
                point: {
                  events: {
                      drag: function (e) {
                      },
                      drop: function (e) {  
                        that.BsfinancialObj.get(e.target.category).othercurrentliabilitiespercent = e.target.y;
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
            series: [{data:OCLArray, dragDrop: {draggableY: true}}],
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
    let TCAArray = [];
    let TAArray = [];
    let TCLArray = [];
    let TLArray = [];
    let TSEArray = [];
    let TLSEArray =[];
    let lastKey = 0;
    for (let [key, value] of this.BsfinancialObj) {
      if((this.BsfinancialObj.get(key).latest) > 0){
        this.BsfinancialObj.get(key).currentportionlongtermdebt = this.BsfinancialObj.get(lastKey).currentportionlongtermdebt;
        this.BsfinancialObj.get(key).accountspayable =((this.BsfinancialObj.get(key).dpo)/365)*(this.BsfinancialObj.get(key).cogs);
        this.BsfinancialObj.get(key).accruedliabilities = (this.BsfinancialObj.get(key).accruedliabilitiespercent/100) * this.BsfinancialObj.get(key).cogs;
        this.BsfinancialObj.get(key).othercurrentliabilities = (this.BsfinancialObj.get(key).othercurrentliabilitiespercent/100) * this.BsfinancialObj.get(key).cogs;
        this.BsfinancialObj.get(key).totalcurrentliabilities = this.BsfinancialObj.get(key).currentportionlongtermdebt+this.BsfinancialObj.get(key).accountspayable+this.BsfinancialObj.get(key).accruedliabilities+this.BsfinancialObj.get(key).othercurrentliabilities;
        this.BsfinancialObj.get(key).longtermdebt = this.BsfinancialObj.get(lastKey).longtermdebt;
        this.BsfinancialObj.get(key).otherliabilities = this.BsfinancialObj.get(lastKey).otherliabilities;
        this.BsfinancialObj.get(key).totalliabilities = this.BsfinancialObj.get(key).totalcurrentliabilities+this.BsfinancialObj.get(key).longtermdebt+this.BsfinancialObj.get(key).otherliabilities;
        this.BsfinancialObj.get(key).totalshareholdersequity = this.BsfinancialObj.get(lastKey).totalshareholdersequity + this.BsfinancialObj.get(key).netincome;
        this.BsfinancialObj.get(key).totalliabilitiesandequity = this.BsfinancialObj.get(key).totalliabilities + this.BsfinancialObj.get(key).totalshareholdersequity;
        this.BsfinancialObj.get(key).goodwill = this.BsfinancialObj.get(lastKey).goodwill;
        this.BsfinancialObj.get(key).otherassets = this.BsfinancialObj.get(lastKey).otherassets;
        this.BsfinancialObj.get(key).intangibleassets = this.BsfinancialObj.get(lastKey).intangibleassets;
        this.BsfinancialObj.get(key).ppe = this.BsfinancialObj.get(lastKey).ppe;
        this.BsfinancialObj.get(key).accountsreceivable = ((this.BsfinancialObj.get(key).dso)/365) * this.BsfinancialObj.get(key).totalrevenue;
        this.BsfinancialObj.get(key).inventories = ((this.BsfinancialObj.get(key).inventorydays)/365) * this.BsfinancialObj.get(key).cogs;
        this.BsfinancialObj.get(key).othercurrentassets = ((this.BsfinancialObj.get(key).othercurrentassetspercent)/100)* this.BsfinancialObj.get(key).totalrevenue;
        this.BsfinancialObj.get(key).cashequivalents = this.BsfinancialObj.get(key).totalliabilitiesandequity -( this.BsfinancialObj.get(key).accountsreceivable + this.BsfinancialObj.get(key).inventories + this.BsfinancialObj.get(key).othercurrentassets + this.BsfinancialObj.get(key).ppe + this.BsfinancialObj.get(key).intangibleassets + this.BsfinancialObj.get(key).goodwill + this.BsfinancialObj.get(key).otherassets);
        this.BsfinancialObj.get(key).totalcurrentassets = this.BsfinancialObj.get(key).cashequivalents + this.BsfinancialObj.get(key).accountsreceivable + this.BsfinancialObj.get(key).inventories + this.BsfinancialObj.get(key).othercurrentassets;
        this.BsfinancialObj.get(key).totalassets = this.BsfinancialObj.get(key).totalcurrentassets + this.BsfinancialObj.get(key).ppe + this.BsfinancialObj.get(key).intangibleassets + this.BsfinancialObj.get(key).goodwill + this.BsfinancialObj.get(key).otherassets;
              }
            TCAArray.push(this.BsfinancialObj.get(key).totalcurrentassets);
            TAArray.push(this.BsfinancialObj.get(key).totalassets);
            TCLArray.push(this.BsfinancialObj.get(key).totalcurrentliabilities);
            TLArray.push(this.BsfinancialObj.get(key).totalliabilities);
            TSEArray.push(this.BsfinancialObj.get(key).totalshareholdersequity);
            TLSEArray.push(this.BsfinancialObj.get(key).totalliabilitiesandequity);
            lastKey = key;
        }

        this.TCAOptions = {
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
          series: [{data:TCAArray}],
          legend: false
        };
        this.TAOptions = {
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
          series: [{data:TAArray}],
          legend: false
        }; 
        this.TCLOptions = {
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
          series: [{data:TCLArray}],
          legend: false
        }; 
        this.TLOptions = {
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
          series: [{data:TLArray}],
          legend: false
        }; 
        this.TSEOptions = {
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
          series: [{data:TSEArray}],
          legend: false
        }; 
        this.TLSEOptions = {
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
          series: [{data:TLSEArray}],
          legend: false
        }; 
       
  }
  
  saveScenario(){
  let inputArray=[];
  for (let [key, value] of this.BsfinancialObj) {
      let inputObj:any = {};
        if((this.BsfinancialObj.get(key).latest) > 0){
          inputObj.accountspayable = this.BsfinancialObj.get(key).accountspayable;
          inputObj.accountsreceivable = this.BsfinancialObj.get(key).accountsreceivable;
          inputObj.accruedliabilities = this.BsfinancialObj.get(key).accruedliabilities;
          inputObj.accruedliabilitiespercent= this.BsfinancialObj.get(key).accruedliabilitiespercent;
          inputObj.asof =  key.toString();
          inputObj.cashequivalents = this.BsfinancialObj.get(key).cashequivalents;
          inputObj.companyname =  this.companyName;
          inputObj.currentportionlongtermdebt = this.BsfinancialObj.get(key).currentportionlongtermdebt;
          inputObj.dpo = this.BsfinancialObj.get(key).dpo;
          inputObj.dso = this.BsfinancialObj.get(key).dso;
          inputObj.goodwill = this.BsfinancialObj.get(key).goodwill;
          inputObj.cogs= this.BsfinancialObj.get(key).cogs;
          inputObj.netincome= this.BsfinancialObj.get(key).netincome;
          inputObj.totalrevenue= this.BsfinancialObj.get(key).totalrevenue;
          inputObj.intangibleassets = this.BsfinancialObj.get(key).intangibleassets;
          inputObj.inventories = this.BsfinancialObj.get(key).inventories;
          inputObj.inventorydays = this.BsfinancialObj.get(key).inventorydays;
          inputObj.latest = this.BsfinancialObj.get(key).latest;
          inputObj.longtermdebt = this.BsfinancialObj.get(key).longtermdebt;
          inputObj.memocheck = this.BsfinancialObj.get(key).memocheck;
          inputObj.otherassets = this.BsfinancialObj.get(key).otherassets;
          inputObj.othercurrentassets = this.BsfinancialObj.get(key).othercurrentassets;
          inputObj.othercurrentassetspercent = this.BsfinancialObj.get(key).othercurrentassetspercent;
          inputObj.othercurrentliabilities = this.BsfinancialObj.get(key).othercurrentliabilities;
          inputObj.othercurrentliabilitiespercent = this.BsfinancialObj.get(key).othercurrentliabilitiespercent;
          inputObj.otherliabilities = this.BsfinancialObj.get(key).otherliabilities;
          inputObj.ppe = this.BsfinancialObj.get(key).ppe;
          inputObj.scenario = this.scenario;
          inputObj.totalassets = this.BsfinancialObj.get(key).totalassets;
          inputObj.totalcurrentassets = this.BsfinancialObj.get(key).totalcurrentassets;
          inputObj.totalcurrentliabilities = this.BsfinancialObj.get(key).totalcurrentliabilities;
          inputObj.totalliabilities = this.BsfinancialObj.get(key).totalliabilities;
          inputObj.totalliabilitiesandequity = this.BsfinancialObj.get(key).totalliabilitiesandequity;
          inputObj.totalshareholdersequity = this.BsfinancialObj.get(key).totalshareholdersequity;
          inputArray.push(inputObj);
        }
    }
    this.apiService.postData(this.urlConfig.getBsProjectionsAPIPOST()+this.companyName,JSON.stringify(inputArray)).subscribe((res:any)=>{
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
    addScenario(){
      let existingScenarios = this.UserDetailModelService.getScenarioNumber();
      if(existingScenarios.length < 9){
        this.scenario = existingScenarios.length ;
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