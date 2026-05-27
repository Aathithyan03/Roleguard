// src/app/modules/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  // Quick-fill demo credentials
  readonly demoCredentials = [
    { label: 'Admin', userId: 'admin', password: 'password123', role: 'Admin' },
    { label: 'General User', userId: 'priya', password: 'password123', role: 'User' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.form = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  fillDemo(cred: { userId: string; password: string }): void {
    this.form.patchValue({ userId: cred.userId, password: cred.password });
    this.error = '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = '';

    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate([res.user.role === 'admin' ? '/admin' : '/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  get userId() { return this.form.get('userId'); }
  get password() { return this.form.get('password'); }
}
