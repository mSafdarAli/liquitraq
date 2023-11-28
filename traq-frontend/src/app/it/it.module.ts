import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItRoutingModule } from './it-routing.module';
import { ListComponent } from './list/list.component';
import { UpdateComponent } from './update/update.component';
import { FormControllerModule } from '../shared/form-controller/form-controller.module';
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
    ItRoutingModule,
    FormControllerModule,
    PaginationModule
  ]
})
export class ItModule { }
