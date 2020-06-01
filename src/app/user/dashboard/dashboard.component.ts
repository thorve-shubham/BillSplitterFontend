import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public userName : string;
  public mobile : string;
  public country : string;
  public email : string; 
  public userId : string;
  public loading : boolean;
  public found : boolean;
  public groups : [];

  constructor(
    private userService : UserService,
    private authService : AuthenticationService
  ) { 
    this.loading = true;
    this.found = false;
    this.userName = localStorage.getItem('userName');
    this.mobile = "+"+localStorage.getItem('countryCode')+" "+localStorage.getItem('mobile');
    this.country = localStorage.getItem('country');
    this.userId = localStorage.getItem('userId');
    this.email = localStorage.getItem('email');
  }

  ngOnInit(): void {
    this.authService.setLoginStatus(true);
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
