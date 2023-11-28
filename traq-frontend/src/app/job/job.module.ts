import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobRoutingModule } from './job-routing.module';
import { ListComponent } from './list/list.component';
import { UpdateComponent } from './update/update.component';
import { MatInputModule } from '@angular/material/input';
import { FormControllerModule } from './../../app/shared/form-controller/form-controller.module';
import { PreviewComponent } from './preview/preview.component';
import { PaginationModule } from '../shared/pagination/pagination.module';
@NgModule({
  declarations: [
    ListComponent,
    UpdateComponent,
    PreviewComponent
  ],
  imports: [
    CommonModule,
    JobRoutingModule,
    MatInputModule,
    FormControllerModule,
    PaginationModule
  ]
})
export class JobModule { }
