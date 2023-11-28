import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter, Subscription, switchMap } from 'rxjs';
import { Pagination } from 'src/_models/pagination';
import { MessageService } from 'src/_services/message.service';
import { PaginationService } from 'src/_services/pagination.service';
import { PermissionService } from 'src/_services/permission.service';
import { UserService } from 'src/_services/rest/user.service';
import { NewListingPopupComponent } from './new-listing-popup/new-listing-popup.component';
import { AuthService } from 'src/_services/auth.service';

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss'],
})
export class UserListingComponent implements OnInit,OnDestroy {
  searchForm: FormGroup;
  data: any = [];
  paginationHide: boolean;
  pager: Pagination;
  routeSub: Subscription;
  params: Params;
  userInfo:any;
  totalRecords:any;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewListingPopupComponent>,
    private dialog: MatDialog,
    private pagination: PaginationService,
    private _userService: UserService,
    private messageService: MessageService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private userDetail:AuthService,
    public ps: PermissionService,
  ) {
    
    this.routeSub = this.route.queryParams.subscribe((queryParams) => {
      this.params=queryParams;
      if (queryParams['q']) {
        this.getAllUsers({q:queryParams['q']});
      }   
      else if(Object.keys(this.params).length>0){
        this.getAllUsers(queryParams);
      } 
      else{
        this.getAllUsers();
      }
    });
  }

  ngOnInit(): void {
    
    this.userInfo = this.userDetail.userDetails;
  }
 

  getAllUsers(params = null) {
    const sub = this._userService.getAllUsers(params).subscribe({
      next: (res) => {
        this.data = res['data'];
        this.totalRecords=res['pagination'].total;  
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

  newDialog(id = null) {
    const DialogRef = this.dialog.open(NewListingPopupComponent, {
      data: { id: id },
      minWidth: '50%',
      minHeight: '60%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getAllUsers();
      sub.unsubscribe();
    });
  }

  deleteUser(id: number) {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this._userService.deleteUser(id,'');
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllUsers();
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
