import { Injectable } from '@angular/core';
import {  HttpClient, HttpEvent, HttpEventType, HttpResponse, HttpHeaders  } from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { pipe } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})


export class RMIAPIsService {
  data: Object[];
  GETheaders:any;
  POSTheaders:any;
  uploadHeaders:any;
  constructor(private http: HttpClient ) {
    this.GETheaders = new HttpHeaders({      
      'Content-Type': 'application/json',
      "Content-Encoding": 'none',
      "authorization": "Basic cm1pX3VzZXI6cm1pMzIxIUAj",
      "cache-control": "no-cache",
      "postman-token": "648dcbfa-30ef-3359-f29a-31b2038f29ac"
    });
    this.uploadHeaders= new HttpHeaders({
      "authorization": "Basic cm1pX3VzZXI6cm1pMzIxIUAj",
    });
    this.POSTheaders= new HttpHeaders({
      "authorization": "Basic cm1pX3VzZXI6cm1pMzIxIUAj",
      "Content-Type":"application/json"
    });
   }
   
getData(url:string){
  return this.http.get(url,{headers:this.GETheaders})
  .pipe(
    catchError(err => {
      console.log('Handling error getData', err);
      return throwError(err);
  })
  );
}

  uploadData(url:string,input:Object){
    return this.http.post(url,input,{headers:this.uploadHeaders})
    .pipe(
      catchError(err => {
        console.log('Handling error getData', err);
        return throwError(err);
    })
      );
  }
  uploadUserData(url:string,input:Object){
    return this.http.post(url,input,{headers:this.uploadHeaders})
    .pipe(
      catchError(err => {
        console.log('Handling error getData', err);
        return throwError(err);
    })
      );
  }
  postData(url:string,input:Object){
    return this.http.post(url,input,{headers:this.POSTheaders})
    .pipe(
      catchError(err => {
        console.log('Handling error getData', err);
        return throwError(err);
    })
      );
  }
}
export function toResponseBody<T>() {
  return pipe(
    filter((event: HttpEvent<T>) => event.type === HttpEventType.Response),
    map((res: HttpResponse<T>) => res.body)
  );
}