import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from 'src/app/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public signupFormGroup: FormGroup;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public confirmPassword: string;
  public mobile : string;
  public loading: boolean;
  public countryCode: string;
  public country: string;


  constructor(
    private _http: HttpClient,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private _snackBar : MatSnackBar,
    private router: Router
  ) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.signupFormGroup = this.formBuilder.group({
      firstName : [this.firstName,[Validators.required]],
      lastName : [this.lastName,[Validators.required]],
      email : [this.email,[Validators.required,Validators.email]],
      password : [this.password,[Validators.required,this.validatePassword]],
      confirmPassword : [this.confirmPassword,[Validators.required]],
      mobile : [this.mobile,[Validators.required,Validators.pattern("^[0-9]{10}$")]]
    },
    { validators : this.matchPassword }
    );
  }

  matchPassword(control: AbstractControl){
    let password = control.get('password').value;
    let cPassword = control.get('confirmPassword').value;
    if (password != cPassword) {
      control.get('confirmPassword').setErrors({ confirmPassword: true });
    } else {
      return null;
    }
  }

  validatePassword(control: AbstractControl){
    if (!control.value) {
      return null;
    } else {
      const regex = new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'
      );
      const valid = regex.test(control.value);
      return valid ? null : { invalidPassword: true };
    }
  }

  signup(data){
    this.loading = true;
    data.countryCode = this.countryCode;
    data.country = this.country;
    this.authService.signup(data).subscribe(
      (data)=>{
        this.loading = false;
        if(data['Error']){
          this._snackBar.open(data["Message"],"Dismiss",{ duration : 2000 });
        }else{
          this._snackBar.open(data["Message"],"Dismiss",{ duration : 2000 });
          this.router.navigate(['auth/login']);
        }
      },
      (error)=>{
        this.loading = false;
        this._snackBar.open("Something went wrong","Dismiss",{ duration : 2000});
      }
    )
    
  }

  telInputObject(obj) {
    this.countryCode = obj.s.dialCode;
    this.country = obj.s.name;
  }

  onCountryChange(obj){
    this.countryCode = obj.dialCode;
    this.country = obj.name;
  }  

}
