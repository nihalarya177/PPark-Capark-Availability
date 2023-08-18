import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from "rxjs/operators"; 
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http:HttpClient) { }

  registerUser(user){
    let headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post('/users/register', user, {headers: headers}).pipe(map((res=> {console.log(res);return JSON.stringify(res);} )));
    
  }

  authenticateUser(user){
    let headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post('/users/authenticate', user, {headers: headers}).pipe(map((res=> {console.log(res);return JSON.stringify(res);} )));
    
  }

  requestReset(user){
    let headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post('/users/req-reset-password', user, {headers: headers}).pipe(map((res=> {console.log(res);return JSON.stringify(res);})));
    
  }
   
  newPassword(user){
    let headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post('/users/new-password', user, {headers: headers}).pipe(map((res=> {console.log(res);return JSON.stringify(res);})));
    
  }


  ValidPasswordToken(body): Observable<any> {
    return this.http.post('/valid-password-token', body);
  }

  changePassword(user){
    let headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post('/users/change-pass', user, {headers: headers}).pipe(map((res=> {console.log(res);return JSON.stringify(res);})));
    
  }

  changeEmail(user){
    let headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post('/users/change-email', user, {headers: headers}).pipe(map((res=> {console.log(res);return JSON.stringify(res);})));
    
  }
  

  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user =  user;
  }

  updateUserData( user){
    localStorage.setItem('user', JSON.stringify(user));
    this.user =  user;
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear()
    
  }

}