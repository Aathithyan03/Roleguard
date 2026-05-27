// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { AuthResponse, LoginRequest, User } from '../../shared/models/user.model';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'rg_token';
const USER_KEY = 'rg_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private _currentUser$ = new BehaviorSubject<User | null>(this.loadStoredUser());
  readonly currentUser$ = this._currentUser$.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  get currentUser(): User | null {
    return this._currentUser$.value;
  }

  get isAdmin(): boolean {
    return this._currentUser$.value?.role === 'admin';
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this._currentUser$.next(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._currentUser$.next(null);
    this.router.navigate(['/auth/login']);
  }

  /** Called via APP_INITIALIZER to rehydrate user on bootstrap */
  initialize(): Observable<User | null> {
    if (!this.token) return of(null);
    return this.http.get<User>(`${this.apiUrl}/me`).pipe(
      tap((user) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this._currentUser$.next(user);
      }),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }

  private loadStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}
