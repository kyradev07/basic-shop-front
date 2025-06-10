import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly url = environment.apiUrl + 'user';

  constructor(private readonly http: HttpClient) {
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.url, user);
  }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  updateUser(id: number, User: User): Observable<User> {
    return this.http.patch<User>(`${this.url}/${id}`, User);
  }

  findByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.url}/login/${email}`);
  }
}
