import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, filter, switchMap } from 'rxjs';
import { Pagination } from 'src/_models/pagination';
import { AuthService } from 'src/_services/auth.service';
import { MessageService } from 'src/_services/message.service';
import { PaginationService } from 'src/_services/pagination.service';
import { PermissionService } from 'src/_services/permission.service';
import { FurnitureService } from 'src/_services/rest/furniture.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit ,OnDestroy{


  searchForm: FormGroup;
  data: any = [];
  paginationHide: boolean;
  pager: Pagination;
  routeSub: Subscription;
  params: Params;
  userInfo: any;
  dispositionCounts: any[] = [];
  statusCounts: any[] = [];
  statusGraph={};
  priceGraph={};
  overViewGraph={};
  totalRecords:any;
  status = { 'completed': 'Completed', 'originalState': 'Original State', 'in-progress': 'In Progress' }
  depoStatus = { 'resold': 'Resold', 'recycled': 'Recycled', 'disposed': 'Disposed', 'returnToCustomer': 'Return To Customer' }
  constructor(
    private formBuilder: FormBuilder,
    private _productServices: FurnitureService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    public ps: PermissionService,
    private userDetail: AuthService,
    private pagination: PaginationService
  ) {

    this.routeSub = this.route.queryParams.subscribe((queryParams) => {
      this.params = queryParams;
      if (queryParams['q']) {
        this.getAllIT({q:queryParams['q']});
      }  
      else if(Object.keys(this.params).length>0){
        this.getAllIT(queryParams);
      }
      else{
        this.getAllIT();
      } 
    });
  }

  ngOnInit(): void {
    
    this.getGraphData();
    this.userInfo = this.userDetail.userDetails;
  }
  checkObjectLength(val){
    return Object.keys(val).length>0
  }
  getAllIT(params = null) {
    const sub = this._productServices.getAllFurniture('IT', params).subscribe({
      next: (res) => {
        if(res['data'].length>0){
        this.data = res['data'];
        this.totalRecords=res['pagination'].total;
        this.paginationHide = this.data.length < 1 ? true : false;
        this.pager = this.pagination.compile(
          Object.assign({}, this.params, { count: res['pagination'].total })
        );
      }else{
        this.data=[];
        this.totalRecords=0;
      }
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  deleteIt(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this._productServices.deleteProduct(id, '');
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllIT();
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }
  getGraphData() {
    const sub = this._productServices.getGraphData('IT').subscribe({
      next: (res) => {
        this.dispositionCounts = res['data'].result[0].dispositionCounts;
        this.statusCounts = res['data'].result[0].statusCounts;
        this.statusGraph = res['data'].statusGraph;
        this.priceGraph = res['data'].priceGraph;
        this.overViewGraph = res['data'].overviewGraph;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
}
ngOnDestroy(): void {
  this.routeSub.unsubscribe();
}
}
