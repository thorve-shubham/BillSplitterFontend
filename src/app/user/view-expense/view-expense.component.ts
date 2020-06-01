import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-view-expense',
  templateUrl: './view-expense.component.html',
  styleUrls: ['./view-expense.component.css']
})
export class ViewExpenseComponent implements OnInit {

  public expenseId : string;
  public loading :boolean;
  public found : boolean;
  public expense : any;

  constructor(
    private router : ActivatedRoute,
    private userService : UserService,
    private _snackBar : MatSnackBar,
    private _router : Router,
    private location : Location,
    private authService : AuthenticationService
  ) {
    this.loading = true;
    this.found = false;
    this.expenseId = router.snapshot.paramMap.get('expenseId');
    console.log(this.expenseId);
  }

  ngOnInit(): void {
    this.authService.setLoginStatus(true);
    this.getExpense();
  }

  goBack(){
    this.location.back();
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
