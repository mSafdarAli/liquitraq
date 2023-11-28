import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateComponent } from './update/update.component';
import { ListComponent } from './list/list.component';
import { PreviewComponent } from '../infra/preview/preview.component';

const routes: Routes = [
  {
    path:'',
    component:ListComponent
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
  exports: [RouterModule]
})
export class InfraRoutingModule { }
