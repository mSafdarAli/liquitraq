import {
  Component,
  Input,
  OnInit,
} from '@angular/core';


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnInit {
  @Input() data: any; 
  @Input() dataCategory: any;
  pietype:any;
  graphdata: any[];
  public chart: any  = {};

  ngOnInit(): void {
    console.log(this.data)
    this.chart['data'] = Object.keys(this.data).map(e => {return [e, this.data[e]]});
    this.chart['type'] = 'PieChart';
    this.chart['options'] = {
      is3D: true,
      legend: 'none',
      width: 300,
      height: 300,
      backgroundColor: "transparent"
    };
  }

 
}
