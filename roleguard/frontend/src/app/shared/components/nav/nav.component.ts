// src/app/shared/components/nav/nav.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: false,
  template: `
    <nav class="sidebar" *ngIf="currentUser$ | async as user">
      <div class="sidebar-brand">
        <span class="brand-icon">⬡</span>
        <span>RoleGuard</span>
      </div>

      <div class="nav-links">
        <a class="nav-link" routerLink="/dashboard" routerLinkActive="nav-link--active">
          <span class="nav-icon">⊞</span> Dashboard
        </a>
        <a class="nav-link" routerLink="/admin"
          *ngIf="user.role === 'admin'"
          routerLinkActive="nav-link--active">
          <span class="nav-icon">⚙</span> User Management
        </a>
      </div>

      <div class="sidebar-footer">
        <div class="user-chip">
          <div class="chip-avatar">{{ user.avatar }}</div>
          <div class="chip-info">
            <span class="chip-name">{{ user.firstName }}</span>
            <span class="chip-role">{{ user.role === 'admin' ? 'Admin' : 'General User' }}</span>
          </div>
        </div>
        <button class="logout-btn" (click)="logout()">Sign out</button>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 220px;
      min-height: 100vh;
      background: #0f0f1a;
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
      flex-shrink: 0;
      font-family: 'DM Sans', sans-serif;
    }
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #fff;
      font-weight: 700;
      font-size: 1rem;
      margin-bottom: 2.5rem;
      padding: 0 0.5rem;
    }
    .brand-icon { font-size: 1.4rem; color: #7c6dfa; }
    .nav-links { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 10px;
      color: #8888aa;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      transition: all 0.15s;
    }
    .nav-link:hover { background: rgba(255,255,255,0.06); color: #fff; }
    .nav-link--active { background: rgba(124,109,250,0.15); color: #a78bfa; }
    .nav-icon { font-size: 1rem; }
    .sidebar-footer { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1rem; margin-top: 1rem; }
    .user-chip {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .chip-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #7c6dfa;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.72rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .chip-info { display: flex; flex-direction: column; }
    .chip-name { font-size: 0.82rem; font-weight: 600; color: #fff; }
    .chip-role { font-size: 0.72rem; color: #8888aa; }
    .logout-btn {
      width: 100%;
      padding: 8px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      color: #8888aa;
      font-size: 0.82rem;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s;
    }
    .logout-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
  `]
})
export class NavComponent {
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    this.authService.logout();
  }
}
