import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { catchError, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authenticated: boolean = false;

  constructor(
    private readonly userService: UserService
  ) {
  }

  login(email: string, password: string): Observable<boolean> {
    return this.userService.findByEmail(email).pipe(
      map(user => password === atob(user.password)),
      tap((isValidPassword: boolean) => {
        if (isValidPassword) {
          this.authenticated = true;
        } else {
          throw new Error('', { cause: 404 });
        }
      }),
      catchError((err) => {
        if (err?.status === 404 || err.cause === 404) {
          this.authenticated = false;
          throw new Error('Credenciales incorrectas');
        }
        throw err;
      }),
    );
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }
}
