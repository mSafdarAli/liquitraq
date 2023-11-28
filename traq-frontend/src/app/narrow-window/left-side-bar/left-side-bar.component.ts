import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Optional, Output, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/_services/auth.service';
import { LeftMenuService } from 'src/_services/rest/leftMenu.service';
import { environment } from 'src/environments/environment';
// import { AuthService } from 'src/_services/common/auth.service';
// import { MessageService } from 'src/_services/common/message.service';

import { ChangePasswordPopupComponent } from '../change-password-popup/change-password-popup.component';
import { PermissionService } from 'src/_services/permission.service';
import { MenuService } from 'src/_services/rest/menu.service';

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss'],
})
export class LeftSideBarComponent implements OnInit {
  userInfo: any;
  localMenu = [];
  leftMenuData: any[] = [];
  icons = [
    {
      title: 'Land',
      icon: 'bi-gear-fill',
    },
  ];
  topmenu: boolean = false;

  companyName: string = null;
  userName: string = null;
  activeUrl = '';
  reportUrl = '';
  constructor(
    @Optional() private dialogRef: MatDialogRef<ChangePasswordPopupComponent>,
    private dialog: MatDialog,
    private _authService: AuthService,
    private _leftMenuService: LeftMenuService,
    private router: Router,
    private renderer: Renderer2,
    public ps: PermissionService,
    private menuService:MenuService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.activeUrl = this.router.url;
    // this.getReport();
  }
  navigateChild(url: string, event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigateByUrl(url);
  }
  ngOnInit(): void {
  
  }
  getIcon(title: string): string {
    const d = this.icons.filter((e) => e.title == title);
    if (d.length > 0) {
      return d[0].icon;
    }
    return '';
  }
  getUrl(group: string, item: string): string {
    const d = this.localMenu.filter((e) => e.item == item && e.group == group);
    if (d.length > 0) {
      return d[0].url;
    }
    return '';
  }
  newDialog() {
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
  getChilds(item: any[]): any[] {
    return item.filter((e) => e.roleAllowed);
  }
  removeClass() {
   this.menuService.setValue(true);
    this.renderer.removeClass(this.document.body, 'sidebar-enable');
    
  }
  openMenu(index, childIndex = -1) {
    this.leftMenuData.forEach((e, i) => {
      if (i != index) {
        e.open = false;
      }
      this.leftMenuData[index]['menuGroups'].forEach((c, x) => {
        if (x != childIndex) {
          c.open = false;
        }
      });
    });
    if (childIndex > -1) {
      this.leftMenuData[index]['menuGroups'][childIndex]['open'] =
        !this.leftMenuData[index]['menuGroups'][childIndex]['open'];
    } else {
      this.leftMenuData[index]['open'] = !this.leftMenuData[index]['open'];
    }
  }
  getLeftMenuData(userId: string) {
    const sub = this._leftMenuService.leftMenuData(userId).subscribe({
      next: (res) => {
        this.leftMenuData = res['data'];
        this.leftMenuData.forEach((e) => {
          e['menuGroups'].forEach((b) => {
            this.getChilds(b.menuItems).forEach((c) => {
              if (this.getUrl(b.group, c.item) == this.activeUrl) {
                b.open = true;
                e.open = true;
              }
            });
          });
        });
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getReport() {
    const sub = this._leftMenuService.getReportUrl().subscribe({
      next: (res) => {
        this.reportUrl = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
}
