// src/app/modules/admin/user-management/user-management.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../../core/services/users.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';

  showForm = false;
  editingUser: User | null = null;
  form!: FormGroup;
  saving = false;

  displayedColumns = ['avatar', 'name', 'userId', 'role', 'department', 'status', 'actions'];

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadUsers();
  }

  buildForm(user?: User): void {
    this.form = this.fb.group({
      firstName:  [user?.firstName || '', Validators.required],
      lastName:   [user?.lastName  || '', Validators.required],
      userId:     [{ value: user?.userId || '', disabled: !!user }, [Validators.required, Validators.minLength(3)]],
      email:      [user?.email     || '', [Validators.required, Validators.email]],
      password:   [user ? '' : '', user ? [] : [Validators.required, Validators.minLength(6)]],
      role:       [user?.role      || 'user', Validators.required],
      department: [user?.department|| ''],
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.usersService.getAll().subscribe({
      next: (res) => { this.users = res.data; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Failed to load users.'; this.loading = false; }
    });
  }

  openCreate(): void {
    this.editingUser = null;
    this.buildForm();
    this.showForm = true;
  }

  openEdit(user: User): void {
    this.editingUser = user;
    this.buildForm(user);
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingUser = null;
  }

  saveUser(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;

    const raw = this.form.getRawValue();
    // Remove empty password when editing
    if (this.editingUser && !raw.password) delete raw.password;

    const op$ = this.editingUser
      ? this.usersService.update(this.editingUser.id, raw)
      : this.usersService.create(raw);

    op$.subscribe({
      next: () => {
        this.saving = false;
        this.closeForm();
        this.loadUsers();
        this.snackBar.open(
          this.editingUser ? 'User updated.' : 'User created.',
          'OK', { duration: 3000 }
        );
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(err?.error?.message || 'Save failed.', 'Dismiss', { duration: 4000 });
      }
    });
  }

  toggleActive(user: User): void {
    this.usersService.update(user.id, { active: !user.active }).subscribe({
      next: () => { this.loadUsers(); this.snackBar.open('User status updated.', 'OK', { duration: 2000 }); },
      error: () => this.snackBar.open('Failed to update status.', 'Dismiss', { duration: 3000 })
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Delete ${user.firstName} ${user.lastName}? This cannot be undone.`)) return;
    this.usersService.delete(user.id).subscribe({
      next: () => { this.loadUsers(); this.snackBar.open('User deleted.', 'OK', { duration: 2000 }); },
      error: (err) => this.snackBar.open(err?.error?.message || 'Delete failed.', 'Dismiss', { duration: 3000 })
    });
  }

  isCurrentUser(user: User): boolean {
    return this.authService.currentUser?.id === user.id;
  }

  get f() { return this.form.controls; }
}
