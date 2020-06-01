import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import * as _ from 'underscore';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { Location } from '@angular/common';
import { AuthorizedService } from 'src/app/routeGuards/authorized.service';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-create-expense',
  templateUrl: './create-expense.component.html',
  styleUrls: ['./create-expense.component.css']
})
export class CreateExpenseComponent implements OnInit {

  public groupId : string;
  public group : any;
  public loading : boolean;
  public adding : boolean;
  public users =[];
  public expenseFormGroup : FormGroup;

  public expenseName : string;
  public expenseAmount : number;
  public paidByForm : string;
  public paidBy : string;

  constructor(
    private router: ActivatedRoute,
    private _router : Router,
    private userService : UserService,
    private _snackbar : MatSnackBar,
    private formBuilder : FormBuilder,
    private location : Location,
    private authService : AuthenticationService
  ) {
    this.loading = true;
    this.paidByForm = null;
    this.groupId = this.router.snapshot.paramMap.get('groupId');
    console.log(this.groupId);
  }

  goBack(){
    this.location.back();
  }

  ngOnInit(): void {
    this.authService.setLoginStatus(true);
    let apiData = {
      authToken : localStorage.getItem('authToken'),
      groupId : this.groupId
    }
    this.userService.getGroupInfo(apiData).subscribe(
      (data)=>{
        this.loading = false;
        if(!data["Error"]){
          this.group = data["Result"];
          console.log(this.group);
          this.prepareForm();
        }else{
          this._snackbar.open(data["Message"],"Dismiss",{ duration : 3000});
          this._router.navigate(['user/dashboard']);
        }
      },
      (error)=>{
        this.loading = false;
        this._snackbar.open("Something went Wrong","Dismiss",{ duration : 3000});
        this._router.navigate(['user/dashboard']);
      }
    );
  }

  prepareForm(){
    for(let x of this.group.members){
      this.users.push({id : x.userId, name : x.userName});
    }

    const controls = this.users.map(c => new FormControl(false));
    controls[0].setValue(true);

    this.expenseFormGroup = this.formBuilder.group({
      expenseName : [this.expenseName,Validators.required],
      expenseAmount : [this.expenseAmount,[Validators.required]],
      users : new FormArray(controls,this.minSelectedCheckboxes(2)) 
    })
  }

  get formData() { return <FormArray>this.expenseFormGroup.get('users'); }

  minSelectedCheckboxes(min) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + next : prev, 0);
  
      return totalSelected >= min ? null : { required: true };
    };
  
    return validator;
  }

  createExpense(data){
    console.log(data);
    this.adding = true;
    const selectedUsers = this.expenseFormGroup.value.users
      .map((v, i) => v ? this.users[i].id : null)
      .filter(v => v !== null);

    if(_.contains(selectedUsers,this.paidByForm)){
      let apiData = {
        authToken : localStorage.getItem('authTken'),
        expenseName : data.expenseName,
        expenseAmount : data.expenseAmount,
        paidBy : this.paidByForm,
        members : selectedUsers,
        groupId : this.groupId
      }
      this.userService.createExpense(apiData).subscribe(
        (data)=>{
          this.adding = false;
          this._snackbar.open(data['Message'],"Dismiss",{ duration : 3000 });
          this._router.navigate(['user/viewGroup',this.groupId]);
        },
        (error)=>{
          this.adding = false;
        }
      )

    }else{
      this._snackbar.open("The user who paid should be member of expense","Dismiss",{ duration : 2000 });
    }
  }
}
