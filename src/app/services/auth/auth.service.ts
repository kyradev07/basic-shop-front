import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { catchError, map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
  ) {
  }

  login(email: string, password: string): Observable<boolean> {
    return this.userService.findByEmail(email).pipe(
      map(user => {
        return password === user.password
      }),
      tap((isValidPassword: boolean) => {
        if (isValidPassword) {
          sessionStorage.setItem('mock_token', isValidPassword.toString());
        } else {
          throw new Error('', { cause: 404 });
        }
      }),
      catchError((err) => {
        if (err?.status === 404 || err.cause === 404) {
          throw new Error('Credenciales incorrectas');
        }
        throw err;
      }),
    );
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('mock_token');
  }

  logout(): void {
    sessionStorage.removeItem('mock_token');
    this.router.navigate(['/login']).then();
  }
}
