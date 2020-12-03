import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { Subscription } from 'rxjs';
import {
  abbreviateNumber,
  RMIAPIsService,
} from 'src/app/shared/rmiapis.service';

const projectionColor = {
  linearGradient: {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 1,
  },
  stops: [
    [0, '#5a656c'],
    [0.2, '#5f777e'],
    [1, '#164a5b'],
  ],
};
const actualColor = {
  linearGradient: {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 1,
  },
  stops: [
    [0, 'rgb(133, 225, 252)'],
    [0.3, 'rgb(105, 185, 234)'],
    [0.6, 'rgb(103, 181, 233)'],
    [1, 'rgb(100, 175, 225)'],
  ],
};
const tooltip = {
  backgroundColor: '#5A6574',
  style: {
    color: '#FFFFFF',
  },
  borderWidth: 0,
  borderRadius: 5,
  // tslint:disable-next-line:object-literal-shorthand
  formatter() {
    return this.x
      ? this.series.chart.title.textStr +
          ' for <b>' +
          this.x +
          '</b> is <b>' +
          abbreviateNumber(this.y) +
          '</b>'
      : this.series.chart.title.textStr +
          ': <b>' +
          abbreviateNumber(this.y) +
          '</b>';
  },
};
@Component({
  selector: 'app-company-matrics',
  templateUrl: './company-matrics.component.html',
  styleUrls: ['./company-matrics.component.scss'],
})
export class CompanyMatricsComponent implements OnInit, OnDestroy {
  @Input() companyName: string;
  @Input() scenario: string | number;
  companyActualName: string;
  Highcharts = Highcharts;
  /**
   * Define total revenue options
   */
  totalRevenueOptions = {
    chart: {
      type: 'column',
      height: 250,
      width: 260,
    },
    title: { text: 'Total Revenue', align: 'left' },
    yAxis: {
      title: { text: 'In Millions', style: { display: 'none' } },
      gridLineWidth: 0,
      // visible: false,
    },
    xAxis: {
      categories: [],
      gridLineWidth: 0,
    },
    plotOptions: {
      series: {
        stickyTracking: true,
        colorByPoint: true,
      },
      column: {
        pointWidth: 15,
        colors: [
          actualColor,
          actualColor,
          projectionColor,
          projectionColor,
          projectionColor,
        ],
        borderRadius: 5,
      },
    },
    tooltip,
    credits: { enabled: false },
    exporting: { enabled: false },
    series: [
      {
        data: [],
      },
    ],
    legend: false,
  };
  /**
   * Define gross profit options
   */
  grossProfitOptions = {
    chart: {
      type: 'spline',
      height: 250,
      width: 260,
    },
    title: { text: 'Gross Profit', align: 'left' },
    yAxis: {
      title: { text: 'In Millions', style: { display: 'none' } },
      gridLineWidth: 0,
      // visible: false,
    },
    xAxis: {
      categories: [],
      gridLineWidth: 0,
    },
    plotOptions: {
      series: {
        stickyTracking: true,
        colorByPoint: true,
      },
      spline: {
        colors: [
          actualColor,
          actualColor,
          projectionColor,
          projectionColor,
          projectionColor,
        ],
        borderRadius: 5,
      },
    },
    tooltip,
    credits: { enabled: false },
    exporting: { enabled: false },
    series: [
      {
        data: [],
      },
    ],
    legend: false,
  };
  /**
   * Define options for EBITDA
   */
  EBITDAOptions = {
    chart: {
      type: 'spline',
      height: 250,
      width: 260,
    },
    title: { text: 'EBITDA', align: 'left' },
    yAxis: {
      title: { text: 'In Millions', style: { display: 'none' } },
      gridLineWidth: 0,
      // visible: false,
    },
    xAxis: {
      categories: [],
      gridLineWidth: 0,
    },
    plotOptions: {
      series: {
        stickyTracking: true,
        colorByPoint: true,
        fillColor: {
          linearGradient: [0, 0, 0, 300],
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [
              1,
              Highcharts.color(Highcharts.getOptions().colors[0])
                .setOpacity(0)
                .get('rgba'),
            ],
          ],
        },
      },
      spline: {
        colors: [
          actualColor,
          actualColor,
          projectionColor,
          projectionColor,
          projectionColor,
        ],
        borderRadius: 5,
      },
    },
    tooltip,
    credits: { enabled: false },
    exporting: { enabled: false },
    series: [
      {
        data: [],
      },
    ],
    legend: false,
  };
  /**
   * Define options for Net income
   */
  netIncomeOptions = {
    chart: {
      type: 'column',
      height: 250,
      width: 260,
    },
    title: { text: 'Net Income', align: 'left' },
    yAxis: {
      title: { text: 'In Millions', style: { display: 'none' } },
      gridLineWidth: 0,
      // visible: false,
    },
    xAxis: {
      categories: [],
      gridLineWidth: 0,
    },
    plotOptions: {
      series: {
        stickyTracking: true,
        colorByPoint: true,
      },
      column: {
        pointWidth: 15,
        colors: [
          actualColor,
          actualColor,
          projectionColor,
          projectionColor,
          projectionColor,
        ],
        borderRadius: 5,
      },
    },
    tooltip,
    credits: { enabled: false },
    exporting: { enabled: false },
    series: [
      {
        data: [],
      },
    ],
    legend: false,
  };
  updateTotalRevenue = false;
  updateGrossProfit = false;
  updateEBDITA = false;
  updateNetIncome = false;
  isLoading = true;
  GetCompanyMetricsSubscription: Subscription;
  constructor(private rmiApiService: RMIAPIsService) {}

  ngOnInit() {
    HC_exporting(Highcharts);
    this.getCompanyMetrics();
    window.addEventListener('resize', this.setChartWidth);
  }
  setChartWidth = () => {
    this.totalRevenueOptions.chart.width =
      document.getElementById('total-revenue-container').clientWidth - 35;
    this.updateTotalRevenue = true;
    this.grossProfitOptions.chart.width =
      document.getElementById('gross-profit-container').clientWidth - 35;
    this.updateGrossProfit = true;
    this.EBITDAOptions.chart.width =
      document.getElementById('ebitda-container').clientWidth - 35;
    this.updateEBDITA = true;
    this.netIncomeOptions.chart.width =
      document.getElementById('net-income-container').clientWidth - 35;
    this.updateNetIncome = true;
  };
  /**
   *
   */
  getCompanyMetrics = (): void => {
    this.isLoading = true;
    this.GetCompanyMetricsSubscription = this.rmiApiService
      .getData(
        `companymetrics?company=${this.companyName}&scenario=${this.scenario}`
      )
      .subscribe((data: any) => {
        this.setTotalRevenue(data.totalRevenue);
        this.setGrossProfitData(data.grossProfit);
        this.setEBITDA(data.ebita);
        this.setNetIncome(data.netIncome);
        this.companyActualName = data.company;
        this.isLoading = false;
      });
  };
  /**
   *
   * @param totalRevenue array of any
   */
  setTotalRevenue = (totalRevenue: any[]) => {
    const data = [];
    const colors = [];
    const categories = [];
    totalRevenue.forEach((value) => {
      data.push(value.amount);
      colors.push(value.isProjected ? projectionColor : actualColor);
      categories.push(value.year);
    });
    this.totalRevenueOptions.series = [
      {
        data,
      },
    ];
    this.totalRevenueOptions.xAxis.categories = categories;
    this.totalRevenueOptions.plotOptions.column.colors = colors;
    this.totalRevenueOptions.chart.width =
      document.getElementById('total-revenue-container').clientWidth - 35;
    this.updateTotalRevenue = true;
  };
  /**
   *
   * @param grossProfit array of any
   */
  setGrossProfitData = (grossProfit: any[]) => {
    const data = [];
    const colors = [];
    const categories = [];
    grossProfit.forEach((value) => {
      data.push(value.amount);
      colors.push(value.isProjected ? projectionColor : actualColor);
      categories.push(value.year);
    });
    this.grossProfitOptions.series = [
      {
        data,
      },
    ];
    this.grossProfitOptions.xAxis.categories = categories;
    this.grossProfitOptions.plotOptions.spline.colors = colors;
    this.grossProfitOptions.chart.width =
      document.getElementById('gross-profit-container').clientWidth - 35;
    this.updateGrossProfit = true;
  };
  /**
   *
   * @param ebitda array of any
   */
  setEBITDA = (ebitda: any[]) => {
    const data = [];
    const colors = [];
    const categories = [];
    ebitda.forEach((value) => {
      data.push(value.amount);
      colors.push(value.isProjected ? projectionColor : actualColor);
      categories.push(value.year);
    });
    this.EBITDAOptions.series = [
      {
        data,
      },
    ];
    this.EBITDAOptions.xAxis.categories = categories;
    this.EBITDAOptions.plotOptions.spline.colors = colors;
    this.EBITDAOptions.chart.width =
      document.getElementById('ebitda-container').clientWidth - 35;
    this.updateEBDITA = true;
  };
  /**
   *
   * @param netIncome array of any
   */
  setNetIncome = (netIncome: any[]) => {
    const data = [];
    const colors = [];
    const categories = [];
    netIncome.forEach((value) => {
      data.push(value.amount);
      colors.push(value.isProjected ? projectionColor : actualColor);
      categories.push(value.year);
    });
    this.netIncomeOptions.series = [
      {
        data,
      },
    ];
    this.netIncomeOptions.xAxis.categories = categories;
    this.netIncomeOptions.plotOptions.column.colors = colors;
    this.netIncomeOptions.chart.width =
      document.getElementById('net-income-container').clientWidth - 35;
    this.updateNetIncome = true;
  };
  ngOnDestroy() {
    if (this.GetCompanyMetricsSubscription) {
      this.GetCompanyMetricsSubscription.unsubscribe();
    }
    window.removeEventListener('resize', () => {});
  }
}
