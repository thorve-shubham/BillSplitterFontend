import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  public loggedIn$: Observable<boolean>;

  constructor(
    private authService : AuthenticationService
  ) { }

  ngOnInit(): void {
    this.loggedIn$ = this.authService.isLoggedIn;
  }

}
