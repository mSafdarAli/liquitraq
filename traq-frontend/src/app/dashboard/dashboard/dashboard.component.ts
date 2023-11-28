import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Pagination } from 'src/_models/pagination';
import { PermissionService } from 'src/_services/permission.service';
import { DashboardService } from 'src/_services/rest/dashboard.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  title: string = 'title';
  searchForm: FormGroup;
  data: any = [];
  paginationHide: boolean;
  pager: Pagination;
  routeSub: Subscription;
  params: Params;
  jobData: any[];
  statusData: any[];
  priceData: any[];
  dispositionData :string
  countArray: any[] = [];
  chartItem: any[] = [];
  status={'completed':'Item Inventories','in-progress':'Items in Process','originalState':'Items Not Processed'};
  jobStatus={'completed':'Jobs Completed','in-progress':'Job in Progress'};
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _DasboardService: DashboardService,
    public ps:PermissionService
  ) {
    this.searchForm = this.formBuilder.group({
      q: [''],
    });
  }
  searchByName(q) {
    this.data = [];
    const param = { ...q };
    this.router.navigate([], { queryParams: param });
  }

  ngOnInit(): void {
    this.getDashboardjob();
    this.getDashboardStatus();
    this.getDashboardDisposition();
    this.getDashboardPrice();
    this.getDashboardItemChart();
  }

  getDashboardjob() {
    const sub = this._DasboardService.getPropertyJob().subscribe({
      next: (res) => {
        this.jobData = res['data']
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getDashboardStatus() {
    const sub = this._DasboardService.getPropertyStatus().subscribe({
      next: (res) => {
        this.statusData = res['data'].statusCounts;
        this.countArray = res['data'].countList
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });

  }
  extractCountValues<T>(array: T[]): number[] {
    return array.map(item => (item as any).count);
  }
  getDashboardDisposition() {
    const sub = this._DasboardService.getPropertyDisposition().subscribe({
      next: (res) => {
        this.dispositionData = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getDashboardPrice() {
    const sub = this._DasboardService.getPropertyPrice().subscribe({
      next: (res) => {
        this.priceData = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getDashboardItemChart() {
    const sub = this._DasboardService.getItemChart().subscribe({
      next: (res) => {
        this.chartItem = res['data']
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
}
