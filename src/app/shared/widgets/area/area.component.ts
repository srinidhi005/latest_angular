import { Component, OnInit, Input } from '@angular/core';
// const Draggable = require("highcharts/modules/draggable-points.js");
// Draggable(Highcharts);
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';


@Component({
  selector: 'app-widget-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  RGOptions: {};
  COGSOptions: {};
  @Input() data: any = [];
  @Input() COGSdata: any = [];
  Highcharts = Highcharts;
  constructor() { }

  ngOnInit() {
    this.RGOptions = {
      chart: {type: 'column',animation:false},
      title: {text: 'Revenue Growth'},  
      yAxis: {min : -50,max :50},
      xAxis: {categories: [2017,2018,2019,2020,2021,2022]},
       plotOptions: {
        series: {stickyTracking: false,
          dragDrop: {draggableY: true},
          point: {
            events: {
                drag: function (e) {
                    // console.log("drag",e);
                },
                drop: function (e) {  
                  console.log("drop",e);
                }
            }
        },
        },
        column: {stacking: "normal",minPointLength: 2},
        line: {cursor: "ns-resize"}},
      tooltip: {split: true,valueSuffix: ' millions'},
      credits: {enabled: false},
      exporting: {enabled: false},
      series: this.data,
      legend: false
    };

    this.COGSOptions = {
      chart: {type: 'column',animation:false},
      title: {text: 'COGS'},  
      yAxis: {min : -50,max :50},
      xAxis: {categories: [2017,2018,2019,2020,2021,2022]},
       plotOptions: {
        series: {stickyTracking: false,
          dragDrop: {draggableY: true},
          point: {
            events: {
                drag: function (e) {
                    // console.log("drag",e);
                },
                drop: function (e) {  
                  console.log("drop",e);
                }
            }
        },
        },
        column: {stacking: "normal",minPointLength: 2},
        line: {cursor: "ns-resize"}},
      tooltip: {split: true,valueSuffix: ' millions'},
      credits: {enabled: false},
      exporting: {enabled: false},
      series: this.COGSdata,
      legend: false
    };

    HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

}
