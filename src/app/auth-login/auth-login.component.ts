import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {

  username = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  inprogress: boolean = false;

  constructor(private router:Router,private route: ActivatedRoute,public auth: AuthService) { }

  ngOnInit() {
  }

  submit() {
    console.log("this.username.value",this.username.value);
    console.log("this.password.value",this.password.value);
    if(this.username.value == 'admin' && this.password.value == 'admin'){
      console.log("yes");
      this.router.navigate(['/statement'],{ relativeTo: this.route });
    }
    else{
        alert("please verify username and password");
    }
    const data = {
      username: this.username.value,
      password: this.password.value
    };

    this.inprogress = true;

  }
}

