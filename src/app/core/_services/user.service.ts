import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../_models/usuario'
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private http: HttpClient) { }

  errorHandler(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
 }

  getAll(): Observable<any> {
    return this.http.get<Usuario[]>(`${environment.apiUrl}GetUsers`) .pipe(
      catchError(this.errorHandler)
    );
  }

  Add(data): Observable<any> {
    return this.http.post<Usuario>(`${environment.apiUrl}AddUser`, JSON.stringify(data))
    .pipe(
      catchError(this.errorHandler)
    )
  }  

  Update(data): Observable<any> {
    return this.http.put(`${environment.apiUrl}UpdUser`, data);
  }
}
