import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/_services/auth.guard';
import { FullWindowComponent } from './full-window/full-window.component';
import { ChangePasswordPopupComponent } from './narrow-window/change-password-popup/change-password-popup.component';
import { NarrowWindowComponent } from './narrow-window/narrow-window.component';

const routes: Routes = [
  {
    path: '',
    component: FullWindowComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: '',
    component: NarrowWindowComponent,
    children: [
      // {
      //   path: 'change-password',
      //   component: ChangePasswordPopupComponent,
      //   canActivate: [AuthGuard],
      // },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'furniture',
        loadChildren: () =>
          import('./furniture/furniture.module').then((m) => m.FurnitureModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'infra',
        loadChildren: () =>
          import('./infra/infra.module').then((m) => m.InfraModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'it',
        loadChildren: () => import('./it/it.module').then((m) => m.ItModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'job',
        loadChildren: () => import('./job/job.module').then((m) => m.JobModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
