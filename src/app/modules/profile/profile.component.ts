import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  nickname:any;
  email:any;
  picture:any;
  constructor(public auth: AuthService) { }

  ngOnInit(): void {
    this.auth.userProfileSubject$.subscribe((res)=>{
      console.log("res for profile",res);
      localStorage.setItem('nickname',res.nickname);
      localStorage.setItem('email',res.email);
      localStorage.setItem('picture',res.picture);
    });
    this.nickname = localStorage.getItem('nickname');
    this.email = localStorage.getItem('email');
    this.picture = localStorage.getItem('picture');
  }
}