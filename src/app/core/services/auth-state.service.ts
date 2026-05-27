import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, map } from 'rxjs';
import { AuthUser, Role } from '../models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly authService = inject(AuthService);
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(null);
  private readonly loadingSubject = new BehaviorSubject(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  readonly currentUser$ = this.userSubject.asObservable();
  readonly isLoading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();
  readonly isAuthenticated$ = this.currentUser$.pipe(map((user) => !!user));
  readonly userRole$ = this.currentUser$.pipe(map((user) => user?.role ?? null));

  readonly currentUser = toSignal(this.currentUser$, { initialValue: null });
  readonly isAuthenticated = toSignal(this.isAuthenticated$, { initialValue: false });
  readonly userRole = toSignal(this.userRole$, { initialValue: null });

  get snapshot(): AuthUser | null {
    return this.userSubject.value;
  }

  setLoading(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }

  setError(message: string | null): void {
    this.errorSubject.next(message);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  setUser(user: AuthUser | null): void {
    this.userSubject.next(user);
    if (user) {
      this.authService.persistUser(user);
    }
  }

  patchUser(changes: Partial<AuthUser>): void {
    const current = this.userSubject.value;
    if (!current) {
      return;
    }

    this.setUser({ ...current, ...changes });
  }

  logout(): void {
    this.userSubject.next(null);
    this.errorSubject.next(null);
    this.loadingSubject.next(false);
    this.authService.clearSession();
  }

  /** @description Ensure a patients row exists for the logged-in user. .NET backend handles this on register. */
  async ensurePatientRecord(): Promise<void> {
    return; // .NET handles patient record creation server-side
  }

  clearState(): void {
    this.userSubject.next(null);
    this.errorSubject.next(null);
    this.loadingSubject.next(false);
  }

  clearUser(): void {
    this.userSubject.next(null);
  }

  hasRole(roles: Role[]): boolean {
    const user = this.userSubject.value;
    return !!user && roles.includes(user.role);
  }
}
