// src/app/modules/dashboard/dashboard.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../../core/guards/auth.guard';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterModule.forChild([
      { path: '', component: DashboardComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class DashboardModule {}
