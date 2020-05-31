import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  public loggedIn$: Observable<boolean>;

  constructor(
    private authService : AuthenticationService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.loggedIn$ = this.authService.isLoggedIn;
  }

  logout(){
    localStorage.clear();
    this.authService.setLoginStatus(false);
    this.router.navigate(['auth/login']);
  }
}
