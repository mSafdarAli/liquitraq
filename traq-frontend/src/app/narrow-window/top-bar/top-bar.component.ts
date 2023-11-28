import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/_services/auth.service';
import { ChangePasswordPopupComponent } from '../change-password-popup/change-password-popup.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FurnitureService } from 'src/_services/rest/furniture.service';
import { lookupdata } from 'src/_models/lookup';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { MenuService } from 'src/_services/rest/menu.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit, OnDestroy {

  topmenu: boolean = false;
  menu: boolean = true;
  data: any = [];
  userName: string = 'John Doe';
  profileImage: any;
  searchForm: FormGroup;
  routSub: Subscription = null;
  menuSub: Subscription = null;
  url: any;
  selectType: lookupdata[] = [];
  selectStatus: lookupdata[] = [];
  selectDisposition: lookupdata[] = [];
  selectJobStatus: lookupdata[] = [];
  queryParams: Params;
  filters: boolean = false;
  categories = { 'furniture': 'Furniture', 'infra': 'Infrastructure', 'it': 'IT' };
  constructor(@Inject(DOCUMENT) private document: Document,
    private dialog: MatDialog,
    private _authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private lookupService: LookUpService,
    private route: ActivatedRoute,
    private menuService:MenuService
  ) {
    this.searchForm = this.formBuilder.group({
      q: [null],
      type: [''],
      status: [''],
      "disposition.data.type": [''],
      jobStatus: [''],
    });
    this.routSub = this.route.queryParams.subscribe((params) => {
      this.queryParams = Object.assign({}, params);
      this.menuSub=this.menuService.getMessage.subscribe(msg=>this.menu=msg);
      if(Object.keys(this.queryParams).length >0) {
        this.searchForm.patchValue(this.queryParams);
      } else {
        this.searchForm.reset();
      }
    });
    this.router.events.forEach(el => {
      if (el instanceof NavigationEnd) {

        this.url = el.url.split('/')[1];

        if (this.queryParams) {
          this.url = this.url.split('?')[0];
        }
        if (this.url == 'job') {
          this.selectJobStatus = this.lookupService.getAllJobStatus();
        }
        else if (['furniture', 'infra', 'it'].indexOf(this.url) > -1) {
          this.getAllTypes(this.categories[this.url]);
          this.selectStatus = this.lookupService.getAllStatus();
          this.selectDisposition = this.lookupService.getAllDispositions();
        }

      }
    })
  }

  ngOnInit(): void {
    this.userName = this._authService.userDetails.name;
    this.profileImage = this._authService?.userDetails;
  }
 
  getFilteredData(param) {
    Object.keys(param).forEach(element => {
      if(!param[element]) {
        delete this.queryParams[element];
      } else {
        this.queryParams[element] = param[element]
      }
    });
    this.router.navigate([], { queryParams: this.queryParams });

  }
  getAllTypes(category) {
    this.filters = false;
    const sub = this.lookupService.getAllTypes(category).subscribe({
      next: (res) => {
        this.selectType = res;

        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  clearFilters(){
    this.searchForm.reset();
    this.router.navigate([], { queryParams: {} });
  }
  isObjectEmpty(objectName) {
    const { page, ...restPrams } = objectName;
    return Object.keys(restPrams).length;
  }
  changePassword() {
    const DialogRef = this.dialog.open(ChangePasswordPopupComponent, {
      data: { email: this._authService.userDetails.email },
      minWidth: '30%',
      minHeight: '60%',
      disableClose: true,
    });
  }
  logout() {
    this._authService.logout();
  }
  searchByName(q) {
    this.data = [];
    const param = { ...q };
    this.router.navigate([], { queryParams: param });
  }
  showMenu() {
    if (this.document.body.classList.contains('sidebar-enable')) {
      this.renderer.removeClass(this.document.body, 'sidebar-enable');
      this.menu=true;
    } else {
      this.renderer.addClass(this.document.body, 'sidebar-enable');
      this.menu=false;
    }
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
    this.menuSub.unsubscribe();
  }
}
