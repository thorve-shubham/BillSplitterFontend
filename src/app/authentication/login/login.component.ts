import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginFormGroup: FormGroup;
  public email: string;
  public password: string;
  public loading: boolean;

  constructor(
    public formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    private _router: Router,
    private authService: AuthenticationService
  ) {
    this.loading = false;
  }


  ngOnInit(): void {
    this.loginFormGroup = this.formBuilder.group({
      email: [this.email,[Validators.required,Validators.email]],
      password: [this.email,[Validators.required]]
    });
  }

  login(data){
    this.loading = true;
    console.log(data);
    this.authService.login(data).subscribe(
      (data)=>{
        this.loading = false;
        if(data["Error"]){
          this._snackBar.open(data['Message'],'Dismiss',{ duration : 2000 });
        }else{
          this.setLocalStorage(data['Result']);
          this.authService.setLoginStatus(true);
          this._router.navigate(['user/dashboard'])
        }
      },
      (error)=>{
        this.loading = false;
        this._snackBar.open("Something went wrong","Dismiss",{ duration : 2000 });
      }
    );
  }

  setLocalStorage(data){
    localStorage.setItem('authToken',data.authToken);
    localStorage.setItem('userName',data.firstName+" "+data.lastName);
    localStorage.setItem('userId',data.userId);
    localStorage.setItem('email',data.email);
    localStorage.setItem('mobile',data.mobile);
    localStorage.setItem('country',data.country);
    localStorage.setItem('countryCode',data.countryCode);
  }

}
