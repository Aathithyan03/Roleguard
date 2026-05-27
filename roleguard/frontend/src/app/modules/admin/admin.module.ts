// src/app/modules/admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

import { UserManagementComponent } from './user-management/user-management.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';

@NgModule({
  declarations: [UserManagementComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSnackBarModule,
    MatButtonModule,
    RouterModule.forChild([
      { path: '', component: UserManagementComponent, canActivate: [AuthGuard, RoleGuard] }
    ])
  ]
})
export class AdminModule {}
