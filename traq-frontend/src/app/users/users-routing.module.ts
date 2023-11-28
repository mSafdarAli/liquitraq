import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListingComponent } from './user-listing/user-listing.component';
// import { NewListingPopupComponent } from './user-listing/new-listing-popup/new-listing-popup.component';
import { UpdateComponent } from './update/update.component';
import { PreviewComponent } from './preview/preview.component';

const routes: Routes = [
  {
    path: '',
    component: UserListingComponent,
  },
  {
    path:'new',
    component:UpdateComponent
  },
  {
    path:'edit/:id',
    component:UpdateComponent
  },
  {
    path:'preview/:id',
    component:PreviewComponent
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
