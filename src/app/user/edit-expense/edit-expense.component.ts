import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common'
import { FormBuilder, FormGroup, FormControl, FormArray, ValidatorFn } from '@angular/forms';
import * as _ from 'underscore';
import { AuthenticationService } from 'src/app/authentication.service';
import { SocketService } from 'src/app/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-expense',
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.css'],
  providers : [SocketService]
})
export class EditExpenseComponent implements OnInit, OnDestroy {

  public expenseId : string;
  public loading :boolean;
  public found : boolean;
  public expense : any;
  public users : any;
  public group : any;
  public membersForm : FormGroup;
  public updating : boolean;
  public socketObserver : Subscription;
  public userId : string;

  constructor(
    private router : ActivatedRoute,
    private userService : UserService,
    private _snackBar : MatSnackBar,
    private _router : Router,
    private location : Location,
    private formBuilder : FormBuilder,
    private authService : AuthenticationService,
    private socketService : SocketService
  ) {
    this.found=false;
    this.loading = true;
    this.updating = false;
    this.expenseId = router.snapshot.paramMap.get('expenseId');
    this.userId = localStorage.getItem('userId');
    console.log(this.expenseId);
  }
  ngOnDestroy(): void {
    this.socketObserver.unsubscribe();
  }


  ngOnInit(): void {
    this.authService.setLoginStatus(true);
    this.getExpense();
  }

  setUpSocketListener(){
    this.socketObserver = this.socketService.listenToEvent(this.userId).subscribe(
      (data)=>{
        if(data.userId != this.userId && data.expenseId != this.expenseId){
          this._snackBar.open(data.Message,"Dismiss",{ duration : 3000 });
        }else if(data.expenseId == this.expenseId){
          this.getExpense();
        }
      },
      (error)=>{
        this._snackBar.open("Something went Wrong","Dismiss",{ duration :3000 });
      }
    )
  }

  getExpense(){
    this.loading = true;
    this.found = false;
    let apiData = {
      authToken : localStorage.getItem('authToken'),
      expenseId : this.expenseId
    }
    this.userService.getExpenseById(apiData).subscribe(
      (data)=>{
        if(data['Error']){
          this.found = false;
          this._snackBar.open(data["Message"],"Dismiss",{ duration : 3000 });
          this.location.back();
        }else{
          this.expense = data['Result'];
          this.getGroupMembers(this.expense.groupId);
        }
      },
      (error)=>{
        this.found =false;
        this.loading = false;
        this._snackBar.open('Eomthing went wrong','Dismiss', { duration : 3000 });
        this.location.back();
      }
    );
  }

  getGroupMembers(groupId){
    let apiData={
      authToken : localStorage.getItem('authToken'),
      groupId : groupId
    }
    this.userService.getGroupInfo(apiData).subscribe(
      (data)=>{
        this.loading =false;
        if(data['Error']){
          this.found = false;
          this._snackBar.open(data["Message"],"Dismiss",{ duration : 3000 });
          this.location.back();
        }else{
          this.found = true;
          this.group = data['Result'];
          console.log(this.group);
          this.createForm();
        }
      },
      (error)=>{
        this.loading = false;
        this.found = false;
        this._snackBar.open('Eomthing went wrong','Dismiss', { duration : 3000 });
        this.location.back();
      }
    );
  }

  createForm(){
    this.users = [];
    for(let x of this.group.members){
      this.users.push({id : x.userId, name : x.userName});
    }

    const controls = this.users.map(c => new FormControl(this.isPresent(c)));
    
    this.membersForm = this.formBuilder.group({
      users : new FormArray(controls,this.minSelectedCheckboxes(2)),
    });

  }

  get formData() { return <FormArray>this.membersForm.get('users'); }
  

  minSelectedCheckboxes(min) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + next : prev, 0);
  
      return totalSelected >= min ? null : { required: true };
    };
  
    return validator;
  }

  isPresent(data){
    for(let x of this.expense.members){
      if(data.id == x.userId){
        return true;
      }
    }
    return false;
  }

  goBack(){
    this.location.back();
  }

  update(){
    this.updating =true;
    console.log(this.expense.paidBy.userId);
    const selectedUsers = this.membersForm.value.users
      .map((v, i) => v ? this.users[i].id : null)
      .filter(v => v !== null);
    
      console.log(selectedUsers);
      console.log(_.contains(selectedUsers,this.expense.paidBy.userId));
    if(_.contains(selectedUsers,this.expense.paidBy.userId) && this.expense.expenseAmount !=0 && this.expense.expenseAmount !="" && this.expense.expenseAmount!=undefined && this.expense.expenseAmount!=null){
      let apiData = {
        authToken : localStorage.getItem('authToken'),
        userWhoModified : localStorage.getItem('userName'),
        paidBy : this.expense.paidBy.userId,
        expenseAmount : this.expense.expenseAmount,
        members : selectedUsers,
        expenseId : this.expenseId,
        expenseName : this.expense.expenseName
      }
      this.userService.updateExpense(apiData).subscribe(
        (data)=>{
          this._snackBar.open(data["Message"],"Dismiss",{ duration : 3000});
          let socketData = {
            expenseId : this.expenseId,
            userId : this.userId,
            expenseName : data["Result"].expenseName
          }
          this.socketService.emit('expenseUpdated',socketData);
          this.location.back();
        },
        (error)=>{
          this._snackBar.open("Something went Wrong","Dismiss",{ duration : 3000});
          this.location.back();
        }
      )
    }else{
      this._snackBar.open('Invalid Paid BY or Amount Selection','Dismiss',{duration : 3000});
    }
  }
}
