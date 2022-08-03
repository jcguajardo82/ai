import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rol } from '../_models/rol'
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SetMenuRol } from '../_models/set-menu-rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private http:HttpClient) { }

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
    return this.http.get<Rol[]>(`${environment.apiUrl}GetRoles/true`) .pipe(
      catchError(this.errorHandler)
    );
  }

  getRol(idRol): Observable<any> {
    return this.http.get<Rol>(`${environment.apiUrl}GetRol/${idRol}`) .pipe(
      catchError(this.errorHandler)
    );
  }

  getMenuRol(idRol): Observable<any> {
    return this.http.get<Rol>(`${environment.apiUrl}GetMenuRol/${idRol}`) .pipe(
      catchError(this.errorHandler)
    );
  }

  setMenuRol(data): Observable<any> {
    return this.http.post<SetMenuRol>(`${environment.apiUrl}SetMenuRol`, JSON.stringify(data))
    .pipe(
      catchError(this.errorHandler)
    )
  }  

  addRol(data): Observable<any> {
    return this.http.post<Rol>(`${environment.apiUrl}AddRol`, JSON.stringify(data))
    .pipe(
      catchError(this.errorHandler)
    )
  } 

  updRol(data): Observable<any> {
    return this.http.put<Rol>(`${environment.apiUrl}UpdRol`, JSON.stringify(data))
    .pipe(
      catchError(this.errorHandler)
    )
  } 
}
