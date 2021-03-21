import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { RMIAPIsService } from '../../shared/rmiapis.service';
import { ExcelService } from 'src/app/shared/excel.service';
import { AuthService } from 'src/app/auth.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  @ViewChild('uploadFile', { static: false }) uploadFile: ElementRef;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
   firstname: any;
   nickname:any;
  lastname: any;
  email:any;
  userid:any;
  title: any;
  industryInput: any;
  zipcode: any;
  address: any;
  city: any;
  gender: any[] = [
    'Male',
    'Female',
    'Others',
    'I prefer not to say',
  ];
  country: any;
  capitalisation: any;
  state: any;
  geographyInput: any;
  company: any;
  selectedGender: 'Gender'
  revenueInput: any;
  companysizeInput: any;
  contact: any;
  capatializationInput: any;
  inprogress: boolean = false;
  form = new FormGroup({
    userid: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    email: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    firstname: new FormControl('',[Validators.required]),
    lastname: new FormControl('',[Validators.required]),
    contactnumber: new FormControl('',[Validators.required]),
    gender: new FormControl(null),
    company:new FormControl( null),
    title: new FormControl(null),
    address:new FormControl( null),
    country:new FormControl( null),
    zipcode:new FormControl(null),
    state: new FormControl(null),
    city:new FormControl( null),
    industry:new FormControl(null),
    geography: new FormControl(null),
    companysize: new FormControl(null),
    capatialization:new FormControl( null),
    revenue:new FormControl(null),
  });
  constructor(
    private RMIAPIsService: RMIAPIsService,
    private UrlConfigService: UrlConfigService,
    private _snackBar: MatSnackBar,
    private router : Router,
private excelService : ExcelService,
    private authService :AuthService
  ) {}

  ngOnInit(): void {



    this.nickname = localStorage.getItem('nickname');
    this.email = localStorage.getItem('email');
    this.userid = this.nickname;
    this.RMIAPIsService.getData(
      this.UrlConfigService.getuserProfileDetail() +
        this.nickname +
        '&email=' +
        this.email
    ).subscribe((res: any) => {
      console.log(res);
      this.firstname = res[0]? res[0].firstname != "null" ? res[0].firstname: '' :'';
      this.lastname = res[0]?res[0].lastname != "null" ? res[0].lastname : '' : '';
      this.title = res[0]?res[0].title:'';
      this.selectedGender = res[0]?res[0].gender != null ? res[0].gender : '':'';
      this.industryInput = res[0]?res[0].industry:'';
      this.zipcode = res[0]?res[0].zipcode:'';
      this.address = res[0]?res[0].address:'';
      this.city = res[0]?res[0].city:'';
      this.country = res[0]?res[0].country:'';
      this.capatializationInput = res[0]?res[0].capitalisation:'';
      this.state = res[0]?res[0].state:'';
      this.geographyInput = res[0]?res[0].geography:'';
      this.company = res[0]?res[0].companyname:'';
      this.revenueInput = res[0]?res[0].revenue:'';
      this.companysizeInput = res[0]?res[0].companysize:'';
      this.contact = res[0]?res[0].contact:'';
    });
  }

changePassword(){
    const popUpMsg = "To change your password click on Confirm. On Confirmation you will receive an email with instructions to change your password."
    const dialogRef = this.excelService.showConfirmMessage(popUpMsg, "Confirm", "Cancel", '600px', '160px')
    dialogRef.afterClosed().subscribe(action => {
      if(action == "Yes"){
        this.authService.changePassword(this.email).subscribe( success => {
          console.log("Sent password chnage email", success)
        }, error => {
          console.log("Sent password chnage email", error)
        })
      }
    })
  }


  hasError(field: string, error: string) {
    const control = this.form.get(field);
    return control.dirty && control.hasError(error);
  }

  submit() {
    const nickname = localStorage.getItem('nickname');
    if (!this.form.valid) {
      markAllAsDirty(this.form);
      return;
    }
    var postForm = new FormData();
       postForm.append('userid', nickname);
    postForm.append('email', this.email);
    postForm.append('firstname', this.form.value.firstname);
    postForm.append('lastname', this.form.value.lastname);
    postForm.append('contactnumber', this.form.value.contactnumber);
    postForm.append('gender', this.form.value.gender);
    postForm.append('company', this.company);
    postForm.append('title', this.title);
    postForm.append('address', this.address);
    postForm.append('country', this.country);
    postForm.append('zipcode', this.zipcode);
    postForm.append('state', this.state);
    postForm.append('city', this.city);
    postForm.append('industry', this.industryInput);
    postForm.append('geography', this.geographyInput);
    postForm.append('companysize', this.companysizeInput);
    postForm.append('capatialization', this.capatializationInput);
    postForm.append('revenue', this.revenueInput);
    console.log(JSON.stringify(postForm));

    postForm.forEach((value, key) => {
      console.log(key + ' ' + value);
    });

    this.inprogress = true;
    this.RMIAPIsService.uploadUserData(
      this.UrlConfigService.getuserDetailAPI(),
      postForm
    ).subscribe((res: any) => {
      this.inprogress = false;
    });
  }

  goToProfile(){
    this.router.navigate(['/profile'])
  }
}

export function markAllAsDirty(form: FormGroup) {
  for (const control of Object.keys(form.controls)) {
    form.controls[control].markAsDirty();
  }
}
export function resetForm(form: FormGroup) {
  form.reset({
    file: '',
  });
  form.get('file').markAsUntouched();
}
