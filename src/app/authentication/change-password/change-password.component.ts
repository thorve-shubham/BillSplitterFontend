import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as jwt from 'jwt-decode';
import { AuthenticationService } from 'src/app/authentication.service';


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

  constructor(
    // private _router: Route,
    private router: ActivatedRoute,
    private formBuilder : FormBuilder,
    private authService : AuthenticationService
  ) {
    this.verified = false;
    this.loading = false;
    this.authToken = router.snapshot.paramMap.get('authToken');
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
    this.loading = true
    console.log(data);
  }

}
