import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/app/authentication.service';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-view-expense',
  templateUrl: './view-expense.component.html',
  styleUrls: ['./view-expense.component.css'],
  providers : [SocketService]
})
export class ViewExpenseComponent implements OnInit,OnDestroy {

  public expenseId : string;
  public loading :boolean;
  public found : boolean;
  public expense : any;
  public pageNo : number;
  public history : any;
  public foundHistory : boolean;
  public loadingHistory : boolean;
  public socketObserver : Subscription;
  public userId : string;

  constructor(
    private router : ActivatedRoute,
    private userService : UserService,
    private _snackBar : MatSnackBar,
    private _router : Router,
    private location : Location,
    private authService : AuthenticationService,
    private socketService : SocketService
  ) {
    this.pageNo = 0;
    this.loading = true;
    this.found = false;
    this.foundHistory = false;
    this.loadingHistory = false;
    this.expenseId = router.snapshot.paramMap.get('expenseId');
    this.userId = localStorage.getItem('userId');
  }
  ngOnDestroy(): void {
    this.socketObserver.unsubscribe();
  }

  ngOnInit(): void {
    this.authService.setLoginStatus(true);
    this.setUpSocketListener();
    this.getExpense();
    this.getHistory(this.pageNo);
  }

  setUpSocketListener(){
    this.socketObserver = this.socketService.listenToEvent(this.userId).subscribe(
      (data)=>{
        if(data.userId != this.userId && data.expenseId != this.expenseId){
          this._snackBar.open(data.Message,"Dismiss",{ duration : 3000 });
        }else if(data.expenseId == this.expenseId){
          this.getExpense();
          this.pageNo = 0;
          this.getHistory(this.pageNo);
        }
      },
      (error)=>{
        this._snackBar.open("Something went Wrong","Dismiss",{ duration :3000 });
      }
    )
  }

  getHistory(pageNo){
    this.loadingHistory = true;
    this.foundHistory = false;
    let apiData = {
      authToken : localStorage.getItem('authToken'),
      pageNo : pageNo,
      expenseId : this.expenseId
    }

    this.userService.getHistory(apiData).subscribe(
      (data)=>{
        this.loadingHistory = false;
        if(data['Error']){
          this._snackBar.open(data['Message'],"Dismiss",{ duration  : 3000});
          this.foundHistory = false;
          this.history = [];
        }else{
          this.foundHistory = true;
          this.history = data["Result"];
        }
      },
      (error)=>{
        this.loadingHistory = false;
        this.foundHistory = false;
        this._snackBar.open("Something went wrong","Dismiss",{ duration : 3000});
      }
    )

  }

  goBack(){
    this.location.back();
  }

  getNextHistory(){
    if(this.history.length == 0){
      return;
    }
    this.pageNo++;
    this.getHistory(this.pageNo);
  }

  getPrevHistory(){
    if(this.pageNo == 0){
      return
    }
    this.pageNo--;
    this.getHistory(this.pageNo);
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
        this.loading = false;
        if(data["Error"]){
          this._snackBar.open(data["Message"],"Dismiss",{ duration : 3000 });
          this._router.navigate(['user/dashboard']);
        }else{
          this.found = true;
          this.expense = data["Result"];
        }
      },
      (error)=>{
        this.loading = false;
      }
    )
  }
}
