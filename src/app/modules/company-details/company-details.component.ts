import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { RMIAPIsService } from '../../shared/rmiapis.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {


 @ViewChild('uploadFile', { static: false }) uploadFile: ElementRef;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  userid: any;
  nickname: any;
  email: any;
  geography: any[] = ['APAC', 'EMEA', 'LATAM', 'NA'];
  companysize: any[] = ['1-10', '11-100', '101-1000', '1001-10000', '10000+'];
industry:any[]= ['Communication Services', 'Consumer Discretionary', 'Consumer Staples', 'Energy', 'Financials', 'Healthcare', 'Industrials', 'Information Technology', 'Materials', 'Pharmaceuticals', 'Real Estate', 'Utilities'];
  capatialization: any[] = ['USD 1M+', 'USD 10M+', 'USD 100M+'];
  revenue: any[] = [
    'Above USD 1M',
    'Above USD 10M',
    'Above USD 50M',
    'Above USD 100M',
  ];
  firstname: any;
  lastname: any;
  title: any;
  industryInput: any;
  zipcode: any;
  address: any;
  city: any;
  country: any;
  capitalisation: any;
  state: any;
  geographyInput: any;
  company: any;
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
    firstname: new FormControl(null),
    lastname: new FormControl(null),
    contactnumber: new FormControl(null),
    company: new FormControl(null, [Validators.required]),
    title: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
    country: new FormControl(null, [Validators.required]),
    zipcode: new FormControl(null, [Validators.required]),
    state: new FormControl(null, [Validators.required]),
    city: new FormControl(null, [Validators.required]),
    industry: new FormControl(null, [Validators.required]),
    geography: new FormControl(null, [Validators.required]),
    companysize: new FormControl(null, [Validators.required]),
    capatialization: new FormControl(null, [Validators.required]),
    revenue: new FormControl(null, [Validators.required]),
  });
  constructor(
    private RMIAPIsService: RMIAPIsService,
    private UrlConfigService: UrlConfigService,
    private _snackBar: MatSnackBar,
    private router :Router
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
      this.firstname = res[0]?res[0].firstname:'';
      this.lastname = res[0]?res[0].lastname:'';
      this.title = res[0]?res[0].title:'';
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
    postForm.append('firstname', this.firstname);
    postForm.append('lastname', this.lastname);
    postForm.append('contactnumber', this.contact);
    postForm.append('company', this.form.value.company);
    postForm.append('title', this.form.value.title);
    postForm.append('address', this.form.value.address);
    postForm.append('country', this.form.value.country);
    postForm.append('zipcode', this.form.value.zipcode);
    postForm.append('state', this.form.value.state);
    postForm.append('city', this.form.value.city);
    postForm.append('industry', this.form.value.industry);
    postForm.append('geography', this.form.value.geography);
    postForm.append('companysize', this.form.value.companysize);
    postForm.append('capatialization', this.form.value.capatialization);
    postForm.append('revenue', this.form.value.revenue);

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
