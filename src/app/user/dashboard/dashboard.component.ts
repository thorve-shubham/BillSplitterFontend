import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketService } from 'src/app/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers : [SocketService]
})
export class DashboardComponent implements OnInit, OnDestroy {

  public userName : string;
  public mobile : string;
  public country : string;
  public email : string; 
  public userId : string;
  public loading : boolean;
  public found : boolean;
  public groups : [];
  public socketObserver: Subscription;

  constructor(
    private userService : UserService,
    private authService : AuthenticationService,
    private _snackBar :MatSnackBar,
    private socketService : SocketService
  ) { 
    this.loading = true;
    this.found = false;
    this.userName = localStorage.getItem('userName');
    this.mobile = "+"+localStorage.getItem('countryCode')+" "+localStorage.getItem('mobile');
    this.country = localStorage.getItem('country');
    this.userId = localStorage.getItem('userId');
    this.email = localStorage.getItem('email');

    
  }
  ngOnDestroy(): void {
    this.socketObserver.unsubscribe();
  }

  setUpSocketListener(){
    this.socketObserver =  this.socketService.listenToEvent(this.userId).subscribe(
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

  ngOnInit(): void {
    this.authService.setLoginStatus(true);
    this.setUpSocketListener();
    let apiData = {
      authToken : localStorage.getItem('authToken'),
      userId : this.userId
    }
    this.userService.getMyGroups(apiData).subscribe(
      (data)=>{
        this.loading = false;
        if(data['Error']){
          this.found = false;
        }else{
          this.found = true;
          this.groups = data["Result"];
        }
      },
      (error)=>{
        this.loading = false;
        this.found = false;
      }
    )
  }

}
