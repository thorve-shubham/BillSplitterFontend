import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as jwt_decode from 'jwt-decode';
import { AuthenticationService } from 'src/app/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  public authToken : string;
  public password:string;
  public confirmPassword: string;
  public cpFormGroup: FormGroup;
  public loading : boolean;
  public verified : boolean;
  public tokenData : any;

  constructor(
    // private _router: Route,
    private router: ActivatedRoute,
    private formBuilder : FormBuilder,
    private authService : AuthenticationService,
    private _snackBar : MatSnackBar
  ) {
    this.verified = false;
    this.loading = false;
    this.authToken = router.snapshot.paramMap.get('authToken');
    this.tokenData = jwt_decode(this.authToken);
  }

  ngOnInit(): void {

    this.authService.verifyToken(this.authToken).subscribe(
      (data)=>{
        this.loading = false;
        if(data['Error']){
          this.verified = false;
        }else{
          this.verified = true;
          
        }
      },
      (error)=>{
        this.loading = false;
      }
    )

    this.cpFormGroup = this.formBuilder.group({
      password : [this.password,[Validators.required,this.validatePassword]],
      confirmPassword : [this.confirmPassword,[Validators.required]]
    },{
      validators : this.matchPassword
    })
    
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

  changePassword(data){
    this.loading = true;
    let apiData = {
      userId : this.tokenData.userId,
      email : this.tokenData.email,
      password : data.password,
      authToken : this.authToken
    }
    this.authService.changePassword(apiData).subscribe(
      (data)=>{
        this.loading = false;
        if(data['Error']){
          this._snackBar.open(data['Message'],"Dismiss",{ duration : 3000 });
        }else{
          this._snackBar.open(data['Message'],"Dismiss",{ duration : 3000 });
        }
      },
      (error)=>{
        this.loading = false;
        this._snackBar.open("Something went wrong","Dismiss",{ duration : 3000 });   
      }
    );
  }

}
