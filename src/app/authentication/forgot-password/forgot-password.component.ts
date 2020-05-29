import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public fpFormGroup: FormGroup;
  public email : string;
  public sending : boolean;

  constructor(
    private authService: AuthenticationService,
    private formBuilder : FormBuilder,
    private _router : Router,
    private _snackBar : MatSnackBar
  ) { 
    this.sending = false;
  }

  ngOnInit(): void {
    this.fpFormGroup = this.formBuilder.group({
      email: [this.email,[Validators.required,Validators.email]]
    });
  }

  sendMail(data){
    this.sending = true;
    this.authService.sendMail(data).subscribe(
      (data)=>{
        this.sending = false;
        if(data['Error']){
          this._snackBar.open(data['Message'],"Dismiss",{ duration : 3000 });
        }else{
          this._snackBar.open(data['Message'],"Dismiss",{ duration : 3000 });
          this._router.navigate(['auth/login']);
        }
        
      },
      (error)=>{
        this.sending = false;
        this._snackBar.open("Something went Wrong",'Dismiss',{ duration : 3000});
      }
    )
  }

}
