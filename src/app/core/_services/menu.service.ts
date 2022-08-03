import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Menu } from '../_models/menu'
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MenuService {

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

 Add(data): Observable<any> {
  return this.http.post<Menu>(`${environment.apiUrl}AddMenu`, JSON.stringify(data))
  .pipe(
    catchError(this.errorHandler)
  )
}  

Update(data): Observable<any> {
  return this.http.put<Menu>(`${environment.apiUrl}UpdMenu`, JSON.stringify(data))
  .pipe(
    catchError(this.errorHandler)
  )
}  

  getMenusRol(): Observable<any> {
    return this.http.get<any[]>(`${environment.apiUrl}GetMenusRol`) .pipe(
      catchError(this.errorHandler)
    );
  }

  getMenu(idMenu): Observable<any> {
    return this.http.get<Menu>(`${environment.apiUrl}GetMenu/${idMenu}`) .pipe(
      catchError(this.errorHandler)
    );
  }

  getMenusPadre(): Observable<any> {
    return this.http.get<Menu[]>(`${environment.apiUrl}GetMenusPadre`) .pipe(
      catchError(this.errorHandler)
    );
  }

  
  getMenusHijos(padreId): Observable<any> {
    return this.http.get<Menu[]>(`${environment.apiUrl}GetMenusHijos/${padreId}`) .pipe(
      catchError(this.errorHandler)
    );
  }

  delMenuSub(menuId): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}DelMenuSub/${menuId}`) .pipe(
      catchError(this.errorHandler)
    );
  }

  delMenu(menuId): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}DelMenu/${menuId}`) .pipe(
      catchError(this.errorHandler)
    );
  }
}
