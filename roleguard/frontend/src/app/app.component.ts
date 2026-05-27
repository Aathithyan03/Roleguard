// src/app/app.component.ts
import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { LoadingService } from './core/services/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <div class="app-shell">
      <!-- Global loading bar -->
      <div class="global-loader" *ngIf="loading$ | async">
        <div class="loader-bar"></div>
      </div>

      <!-- Sidebar only when logged in -->
      <app-nav *ngIf="isLoggedIn$ | async"></app-nav>

      <!-- Main content area -->
      <main class="app-main" [class.app-main--full]="!(isLoggedIn$ | async)">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      min-height: 100vh;
      background: #f8f8fc;
    }
    .app-main {
      flex: 1;
      overflow-y: auto;
    }
    .app-main--full {
      width: 100%;
    }
    .global-loader {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      z-index: 9999;
    }
    .loader-bar {
      height: 100%;
      background: #7c6dfa;
      animation: loadProgress 1.5s ease-in-out infinite;
    }
    @keyframes loadProgress {
      0%   { width: 0%; margin-left: 0; }
      50%  { width: 70%; margin-left: 15%; }
      100% { width: 0%; margin-left: 100%; }
    }
  `]
})
export class AppComponent {
  loading$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService
  ) {
    this.loading$ = this.loadingService.loading$;
    this.isLoggedIn$ = new Observable(obs => {
      this.authService.currentUser$.subscribe(user => obs.next(!!user));
    });
  }
}
