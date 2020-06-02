import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import * as _ from 'underscore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/app/authentication.service';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit,OnDestroy {

  public userName : string;
  public userId : string;
  public mobile : string;
  public country : string;
  public email : string; 
  public loading : boolean;
  public found : boolean;
  public users : any;
  public usersHtml = [];
  public groupFormGroup : FormGroup;
  public creating : boolean;
  public socketObserver : Subscription;

  public groupName : string;

  constructor(
    private userService : UserService,
    private formBuilder : FormBuilder,
    private _snackBar : MatSnackBar,
    private router : Router,
    private location : Location,
    private authService : AuthenticationService,
    private socketService : SocketService
  ) { 
    this.found = false;
    this.creating = false;
    this.userName = localStorage.getItem('userName');
    this.mobile = "+"+localStorage.getItem('countryCode')+" "+localStorage.getItem('mobile');
    this.country = localStorage.getItem('country');
    this.email = localStorage.getItem('email');
    this.userId = localStorage.getItem('userId');
  }
  ngOnDestroy(): void {
    this.socketObserver.unsubscribe();
  }

  ngOnInit(): void {
    this.authService.setLoginStatus(true);
    this.loading = true;
    this.userService.getUsers().subscribe(
      (data)=>{
        this.loading = false;
        if(data["Error"]){
          this.found = false;
        }else{
          this.users = data["Result"];
          this.createForm();
          this.found = true;
        }
      },
      (error)=>{
        this.loading = false;
        this.found = false;
      }
    )
    this.setUpSocketListener();
  }

  setUpSocketListener(){
    this.socketObserver = this.socketService.listenToEvent(this.userId).subscribe(
      (data)=>{
        if(data.userId != this.userId){
          this._snackBar.open(data.Message,"Dismiss",{ duration : 3000 });
        }
      },
      (error)=>{
        this._snackBar.open("Something went Wrong","Dismiss",{ duration :3000 });
      }
    )
  }

  createForm(){

    for(let x of this.users){
      if(x.userId != this.userId){
        this.usersHtml.push({id : x.userId, name : x.firstName+" "+x.lastName});
      }
    }

    const controls = this.usersHtml.map(c => new FormControl(false));
    controls[0].setValue(true);

    this.groupFormGroup = this.formBuilder.group({
      groupName : [this.groupName,Validators.required],
      usersHtml : new FormArray(controls,this.minSelectedCheckboxes(1))
    });
  }

  minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + next : prev, 0);
  
      return totalSelected >= min ? null : { required: true };
    };
  
    return validator;
  }

  goBack(){
    this.location.back();
  }

  get formData() { return <FormArray>this.groupFormGroup.get('usersHtml'); }

  createGroup(data){
    console.log(data);
    this.creating = true;
    const selectedUsers = this.groupFormGroup.value.usersHtml
      .map((v, i) => v ? this.usersHtml[i].id : null)
      .filter(v => v !== null);

    selectedUsers.push(this.userId);

    let apiData = {
      authToken : localStorage.getItem('authToken'),
      createdBy : this.userId,
      members : selectedUsers,
      groupName : data.groupName,
      userName : localStorage.getItem('userName')
    }

    this.userService.createGroup(apiData).subscribe(
      (data)=>{
        this.creating  =false;
        if(data['Error']){
          this._snackBar.open(data['Message'],"Dismiss",{ duration : 3000});
          this.router.navigate(['user/dashboard']);
        }else{
          this._snackBar.open(data['Message'],"Dismiss",{ duration : 3000});
          this.router.navigate(['user/dashboard']);
        }
      }
    ),
    (error)=>{
      this.creating = false;
      this._snackBar.open("Something went Wrong","Dismiss",{ duration : 3000});
    }
    
  }
}
