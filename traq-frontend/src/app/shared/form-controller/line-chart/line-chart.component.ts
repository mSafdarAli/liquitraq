import {
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {


  @Input() data: any;
  @Input() dataCategory: any;
  pietype: any;
  graphdata: any[];
  public chart: any = {};

  ngOnInit(): void {
    this.chart['data'] = this.data
    this.chart['type'] = 'LineChart';
    this.chart['columnNames'] = ["Month", "Resold", "Recycled", "disposed", "Retuen To Customer"];
    this.chart['options'] = {
      is3D: true,
      // legend: 'none',
      legend: {
        textStyle: {
          color: "white"
        }
      },
      width: 1400,
      height: 500,
      backgroundColor: "transparent",
      colors: ['#5cb85c', '#f0ad4e', '#d9534f', '#5bc0de', '#f6c7b6'],
      hAxis: {
        title: 'Month',
        textStyle: { color: '#FFF' },
        titleTextStyle:{
          color:"#FFF"
        }
      },
      vAxis: {
        title: 'Price',
        textStyle: { color: '#FFF' },
        gridlines: {
          color: '#3A407E',
        },
        titleTextStyle: {
          color: "#FFF"
        }
      },
      pointSize: 5,
      chartAre: {
        width: "90%"
      },

    };
  }
}

