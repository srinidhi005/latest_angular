import { Component, OnInit, Output, EventEmitter,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import {TooltipPosition} from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import { Router } from '@angular/router';
import {map, startWith} from 'rxjs/operators';
import {UserDetailModelService} from '../../user-detail-model.service';
import { AuthService } from '../../../auth.service';
import {RMIAPIsService} from '../../rmiapis.service';
import '../../../../../node_modules/chargebee/lib/chargebee.js';
import {UrlConfigService} from '../../url-config.service';
declare var Chargebee: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
 
export class HeaderComponent implements OnInit {
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  myControl = new FormControl();
  options: string[] = [];
	  currentUser;
	  loggedInUserId;
  nickname:any;
  email:any;
  picture:any;
  filteredOptions: Observable<string[]>;
  @ViewChild('script') script: ElementRef;
  

  constructor( private apiService:RMIAPIsService,private router : Router,
    private urlConfig:UrlConfigService,public auth: AuthService) {
	//	this.loadScripts()
	}
	
	
	
	  ngOnInit() {
	  this.loggedInUserId = localStorage.getItem('loggedInUserId');
	  this.auth.userProfileSubject$.subscribe((res:any)=>{
      console.log("res for profile",res);
      localStorage.setItem('nickname',res.nickname);
      localStorage.setItem('email',res.email);
      localStorage.setItem('picture',res.picture);
    });
	 this.nickname = localStorage.getItem('nickname');
    this.email = localStorage.getItem('email');
	  // this.picture = localStorage.getItem('picture');
	  
	 this.auth.getUserById(this.loggedInUserId).subscribe( res => {
      console.log("USER", res);
      this.currentUser = res.body;
      if(this.currentUser && this.currentUser.user_metadata){
        if(this.currentUser.user_metadata && this.currentUser.user_metadata.picture){
	  this.picture = this.currentUser.user_metadata.picture
	  this.auth.userPicture=this.picture
          
        }
        else{
	  this.picture = localStorage.getItem('picture');
	  this.auth.userPicture=this.picture
         

        }
      }
      else{
	  this.picture = localStorage.getItem('picture');
	  this.auth.userPicture=this.picture
        

      }
    }, error => {
      console.log(error);
	  this.picture = localStorage.getItem('picture');
	  this.auth.userPicture=this.picture
      
    })
 
	  
    //this.auth.profileSubscriber.subscribe(() => {
      //this.picture = localStorage.getItem('picture');
    //})
    //this.filteredOptions = this.myControl.valueChanges.pipe(
     // startWith(''),
      //map(value => this._filter(value))
    //);
      }
	    subscribe() {
    // see https://www.chargebee.com/checkout-portal-docs/drop-in-tutorial.html#simulating-drop-in-script-functionality-with-your-button
     let cbInstance = Chargebee.getInstance();
    let cart = cbInstance.getCart();
    let product = cbInstance.initializeProduct("accounting-firms");
    cart.replaceProduct(product);
    cart.proceedToCheckout();
  }
	  SmallBusiness() {
	  this.router.navigate(['/subscribe']);
    // see https://www.chargebee.com/checkout-portal-docs/drop-in-tutorial.html#simulating-drop-in-script-functionality-with-your-button
	  // let cbInstance = Chargebee.getInstance();
	  // let cart = cbInstance.getCart();
	  // let product = cbInstance.initializeProduct("small-business-owner");
	  // cart.replaceProduct(product);
	  // cart.proceedToCheckout();
  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  

  
}
