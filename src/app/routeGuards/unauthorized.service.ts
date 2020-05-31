import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UnauthorizedService {

  public authToken : string;

  constructor(
    private authService : AuthenticationService,
    private router : Router
  ) { }

  canActivate(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): 
  | boolean
  | import('@angular/router').UrlTree
  | import('rxjs').Observable<boolean | import('@angular/router').UrlTree>
  | Promise<boolean | import('@angular/router').UrlTree> {
    this.authToken = localStorage.getItem('authToken');
    if(this.authToken == undefined || this.authToken == null || this.authToken == ""){
      this.authService.setLoginStatus(false);
      return true;
    }else{
      try{
        const decode = jwt_decode(this.authToken);
        this.authService.setLoginStatus(true);
        this.router.navigate(['user/dashboard'])
        return false;
      }catch(err){
        this.authService.setLoginStatus(false);
        return true;
      }
      // this.authService.verifyToken(this.authToken).subscribe(
      //   (data)=>{
      //     if(data['Error']){
      //       console.log("log");
      //       this.router.navigate(['auth/login']);
      //       return false;
      //     }else{
      //       console.log('ala');
      //       return true;
      //     }
      //   },
      //   (error)=>{
      //     console.log("log");
      //     this.router.navigate(['auth/login']);
      //     return false;
      //   }
      // );
    }
  }

}
