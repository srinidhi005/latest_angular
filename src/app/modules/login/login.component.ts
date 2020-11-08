import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-login',

  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  inprogress: boolean = false;

  // constructor(private router:Router,
  // private route: ActivatedRoute) { }
    constructor() {}

  ngOnInit() {
  }

  submit() {
    console.log("this.username.value",this.username.value);
    console.log("this.password.value",this.password.value);
    if(this.username.value == 'admin' && this.password.value == 'admin'){
      console.log("yes");
  //  this.router.navigate(['/statement'],{ relativeTo: this.route });
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
