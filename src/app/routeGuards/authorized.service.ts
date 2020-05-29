import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthorizedService implements CanActivate {

  public authToken : string;

  constructor(
    private authService : AuthenticationService,
    private router : Router,
  ) { }
  canActivate(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): 
  | boolean
  | import('@angular/router').UrlTree
  | import('rxjs').Observable<boolean | import('@angular/router').UrlTree>
  | Promise<boolean | import('@angular/router').UrlTree> {
    console.log("ala");
    this.authToken = localStorage.getItem('authToken');
    if(this.authToken == undefined || this.authToken == null || this.authToken == ""){
      this.router.navigate(['auth/login']);
      console.log("log");
      return false;
    }else{
      this.authService.verifyToken(this.authToken).subscribe(
        (data)=>{
          if(data['Error']){
            console.log("log");
            this.router.navigate(['auth/login']);
            return false;
          }else{
            console.log('ala');
            return true;
          }
        },
        (error)=>{
          console.log("log");
          this.router.navigate(['auth/login']);
          return false;
        }
      );
    }
    console.log("pdha");
  }
}
