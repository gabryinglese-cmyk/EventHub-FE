import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, AuthState, AuthUser, LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/auth`;


  private readonly authStateSubject =
    new BehaviorSubject<AuthState>({
      isAuthenticated: false,
      user: null
    });


  readonly auth$ =
    this.authStateSubject.asObservable();


  get currentState(): AuthState {
    return this.authStateSubject.value;
  }


  get isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }


  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<ApiResponse<LoginResponse>>(
        `${this.apiUrl}/login`,
        credentials
      )
      .pipe(
        map(response => response.data),
        tap(response => {
          this.setAuthenticatedUser(response);
        })
      );
  }

  register(data: RegisterRequest): Observable<LoginResponse> {
    return this.http
      .post<ApiResponse<LoginResponse>>(
        `${this.apiUrl}/register`,
        data
      )
      .pipe(
        map(response => response.data),
        tap(response => {
          this.setAuthenticatedUser(response);
        })
      );
  }


  refresh(): Observable<LoginResponse> {

    return this.http
      .post<ApiResponse<LoginResponse>>(
        `${this.apiUrl}/refresh`,
        {}
      )
      .pipe(
        map(response => response.data),
        tap(response => {
          this.setAuthenticatedUser(response);
        }),
        catchError((error: HttpErrorResponse) => {
          this.clearAuthentication();
          return throwError(() => error);
        })
      );
  }


  logout(): Observable<void> {
    return this.http
      .post<ApiResponse<string>>(
        `${this.apiUrl}/logout`,
        {}
      )
      .pipe(
        tap(() => {
          this.clearAuthentication();
        }),
        map(() => void 0)
      );
  }


  private setAuthenticatedUser(response: LoginResponse): void {
    const user: AuthUser = {
      id: response.userId,
      email: response.email
    };

    this.authStateSubject.next({
      isAuthenticated: true,
      user
    });
  }


  private clearAuthentication(): void {
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null
    });
  }
}