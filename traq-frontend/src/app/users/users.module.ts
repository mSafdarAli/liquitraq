import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserListingComponent } from './user-listing/user-listing.component';
import { UsersRoutingModule } from './users-routing.module';
import { NewListingPopupComponent } from './user-listing/new-listing-popup/new-listing-popup.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';
import { PaginationModule } from '../shared/pagination/pagination.module';
import { UpdateComponent } from './update/update.component';
import { PreviewComponent } from './preview/preview.component';


@NgModule({
  declarations: [
    UserListingComponent,
    NewListingPopupComponent,
    UpdateComponent,
    PreviewComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormControllerModule,
    PaginationModule
    
  ]
})
export class UsersModule { }
