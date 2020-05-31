import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.css']
})
export class ViewGroupComponent implements OnInit {

  public groupId : string;
  public loading : boolean;

  constructor(
    private router: ActivatedRoute,
    private userService : UserService
  ) {
    this.loading = true;
    this.groupId = router.snapshot.paramMap.get('groupId');
    console.log(this.groupId);
   }

  ngOnInit(): void {
    let apiData = {
      authToken : localStorage.getItem('authToken'),
      groupId : this.groupId
    }
    console.log("ala");
    this.userService.getExpense(apiData).subscribe(
      (data)=>{
        this.loading =false;
        console.log(data);
      },
      (error)=>{
        console.log("Somethin went Wrong");
      }
    )
  }

}
