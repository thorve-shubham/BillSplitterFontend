import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private loginStatus = new BehaviorSubject<boolean>(this.checkAuthToken());

  constructor(
    private _http : HttpClient
  ) { 
    
  }

  checkAuthToken(){
    const authToken = localStorage.getItem('authToken');
    if(authToken == undefined || authToken == null || authToken == ""){
      localStorage.clear();
      return false;
    }else{
      this._http.post("http://localhost:3000/token/verify",{authToken}).subscribe(
        (data)=>{
          if(data['Error']){
            localStorage.clear();
            return false;
          }else{
            return true;
          }
        }
      );
    }
  }

  verifyToken(authToken){
    return this._http.post("http://localhost:3000/token/verify",{authToken});
  }

  login(data){
    return this._http.post("http://localhost:3000/user/login",data);
  }

  signup(data){
    return this._http.post("http://localhost:3000/user/create",data);
  }

  setLoginStatus(status: boolean) {
    this.loginStatus.next(status);
  }

  get isLoggedIn() {
    return this.loginStatus.asObservable();
  }

  sendMail(data){
    return this._http.post("http://localhost:3000/user/forgotPassword",data);
  }

  changePassword(data){
    return this._http.post("http://localhost:3000/user/changePassword",data);
  }
}
