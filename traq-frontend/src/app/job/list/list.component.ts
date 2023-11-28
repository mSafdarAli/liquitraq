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
import { JobService } from 'src/_services/rest/jobs.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit,OnDestroy {
  searchForm: FormGroup;
  data: any = [];
  paginationHide: boolean;
  pager: Pagination;
  routeSub: Subscription;
  params: Params;
  userInfo:any;
  lastJobNumber:number;
  nextJobNumber:any;
  totalRecords:any;
  constructor(
    private formBuilder: FormBuilder,
    private _jobServices: JobService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    public ps: PermissionService,
    private userDetail:AuthService,
    private pagination:PaginationService
  ) {
    
    this.routeSub = this.route.queryParams.subscribe((queryParams) => {
      this.params=queryParams;
      if (queryParams['q']) {
        this.getAllJob({q:queryParams['q']});
      }   
      else if(Object.keys(this.params).length>0){
        this.getAllJob(queryParams);
      } 
      else{
        this.getAllJob();
      }
    });
  }
  getAllJob(params = null) {
    const sub = this._jobServices.getAlljobs(params).subscribe({
      next: (res) => {
        this.data = res['data'];
        this.totalRecords=res['pagination'].total;
        if (res['pagination'].total && res['pagination'].total > 0) {
          let lastItem = res['pagination'].total;
          lastItem++;
          this.nextJobNumber = lastItem.toString().padStart(4, '0');
        }
        this.paginationHide = this.data.length < 1 ? true : false;
        this.pager = this.pagination.compile(
          Object.assign({}, this.params, { count: res['pagination'].total })
        );
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  ngOnInit(): void {
    
    this.userInfo = this.userDetail.userDetails;
  }
  searchByName(q) {
    this.data = [];
    const param = { ...q };
    this.router.navigate([], { queryParams: param });
  }
  deletejob(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this._jobServices.deletejob(id,'');
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllJob();
          this.toaster.success('Deleted Successfully', 'Deleted');
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }
  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}
