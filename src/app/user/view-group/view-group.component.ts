import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.css']
})
export class ViewGroupComponent implements OnInit {

  public groupId : string;
  public loading : boolean;
  public expenses : any;
  public found : boolean;
  public group : any;
  public groupMembers : any;
  public userId : string;
  public userName : string;

  constructor(
    private router: ActivatedRoute,
    private userService : UserService,
    private _snackbar : MatSnackBar,
    private location : Location,
    private _router : Router,
    private authService : AuthenticationService
  ) {
    this.loading = true;
    this.found = false;
    this.groupId = router.snapshot.paramMap.get('groupId');
    this.userId = localStorage.getItem('userId');
    this.userName = localStorage.getItem('userName');
    console.log(this.groupId);
   }

  ngOnInit(): void {
    this.authService.setLoginStatus(true);
    this.loadExpenses();
  }

  goBack(){
    this.location.back();
  }

  loadExpenses(){
    this.found = false;
    this.loading = true;
    let apiData = {
      authToken : localStorage.getItem('authToken'),
      groupId : this.groupId
    }
    console.log("ala");
    this.userService.getExpense(apiData).subscribe(
      (data)=>{
        this.loading =false;
        if(!data['Error']){
          this.found = true;
          console.log('asdasd');
          this.expenses = data['Result'];
          this.getGroupInfo();
        }
      },
      (error)=>{
        this.loading = false;
        this._snackbar.open("Something went wrong","Dismiss",{ duration : 3000 });
        this._router.navigate(['user/dashboard']);
      }
    );
  }

  getGroupInfo(){
    let apiData ={
      authToken : localStorage.getItem('authToken'),
      groupId : this.groupId
    }

    this.userService.getGroupInfo(apiData).subscribe(
      (data)=>{
        if(data['Error']){
          this._snackbar.open(data["Message"],"Dismiss",{ duration : 3000 });
          this.location.back();
        }else{
          this.group = data["Result"];
          this.groupMembers = this.group.members;
          this.calculate();
        }
      },
      (error)=>{
        this._snackbar.open("Something went Wrong","Dismiss",{ duration : 3000 });
          this.location.back();
      }
    )
  }


  calculate(){
    let data;
    let oweAmount;
    let MyData =[];
    for(let x of this.groupMembers){
      x.owesArray = [];
      x.owes  =0;
    }
    for(let expense of this.expenses){
      if(expense.paidBy.userId == this.userId){
        oweAmount = (expense.expenseAmount/expense.members.length);
        oweAmount = Math.floor(oweAmount);
        for(let member of expense.members){   //modified here
          if(member.userId != this.userId){
            for(let groupMember of this.groupMembers){
              if(member.userId == groupMember.userId){
                groupMember.owes += oweAmount;
              }
            }
          }
        }
      }
      else{
        oweAmount = (expense.expenseAmount/expense.members.length);
        oweAmount = Math.floor(oweAmount);
        for(let user of this.groupMembers){
          if(user.userId == expense.paidBy.userId){
            if(user.owes > 0){
              let newOwe = user.owes - oweAmount;
              if(newOwe > 0 || newOwe == 0){
                user.owes = newOwe;
              }else{
                user.owes = 0;
                for(let r of this.groupMembers){
                  if(r.userId == this.userId){
                    r.owesArray.push({oweAmount : Math.abs(newOwe), owsToName : expense.paidBy.userName, owsToUserId : expense.paidBy.userId})
                  }
                }
              }
            }else{
              for(let x of this.groupMembers){
                if(x.userId == this.userId){
                  x.owesArray.push({oweAmount : oweAmount, owsToName : expense.paidBy.userName, owsToUserId : expense.paidBy.userId});
                }
              }
            }
          }
        }
      }
    }
  }

  delete(expenseId){
    console.log(expenseId);
    let apiData = {
      authToken : localStorage.getItem('authToken'),
      expenseId : expenseId
    }
    this.userService.deleteExpense(apiData).subscribe(
      (data)=>{
        if(data['Error']){
          this._snackbar.open(data['Message'],"Dismiss", {duration : 3000});
        }
        else{
          this._snackbar.open(data['Message'],"Dismiss", {duration : 3000});
          this.loadExpenses();
        }
      },
      (error)=>{
        this._snackbar.open("Something went Wrong","Dismiss", { duration : 3000});
      }
    )
  }

}
