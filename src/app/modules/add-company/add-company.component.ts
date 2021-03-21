import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { Router } from '@angular/router';
import { RMIAPIsService } from '../../shared/rmiapis.service';
import {MatSnackBar,MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { ExcelService } from 'src/app/shared/excel.service';
@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})

export class AddCompanyComponent implements OnInit {
  @ViewChild('uploadFile',{static: false}) uploadFile: ElementRef;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  companyname: any;
  createdby: any;
  period:any[]=['Monthly', 'Quarterly', 'Yearly'];
  //accessType:any[]=['Public', 'Private'];
  statementType:any[]=['Private','Public'];
  //industry:any[]=['Communications', 'Consumer & Retail','Distribution & Logistics', 'Energy & Natural Resources','Entertainment & Media','Financial Institutions & Sponsors', 'Food & Beverage', 'General Services', 'Healthcare','Hospitality','Industrials','Power, Infrastructure & Utilities','Real Estate','Technology','Telecommunications','Transportation']
  industry:any[]= ['Communication Services', 'Consumer Discretionary', 'Consumer Staples', 'Energy', 'Financials', 'Healthcare', 'Industrials', 'Information Technology', 'Materials', 'Pharmaceuticals', 'Real Estate', 'Utilities']
  inprogress: boolean = false;
  form = new FormGroup({
    file: new FormControl(null, [Validators.required]),
    companyname: new FormControl(null, [Validators.required]),
    period: new FormControl(null, [Validators.required]),
    statementType: new FormControl(null, [Validators.required]),
    industry: new FormControl(null, [Validators.required]),
    // accessType: new FormControl(null, [Validators.required])
  });
  constructor(private RMIAPIsService: RMIAPIsService,
    private UrlConfigService:UrlConfigService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public excelService: ExcelService
  ) { }




  ngOnInit():void{}

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
    if(this.form.value.period == "Yearly"){
      this.form.value.period ="Y";
    } 
    else if(this.form.value.period == "Quarterly"){
      this.form.value.period ="Q";
    }
    else{
      this.form.value.period ="M";
    }
    var postForm = new FormData();
    postForm.append("file", this.form.value.file);
    postForm.append("statementType", this.form.value.statementType);
    postForm.append("companyname", this.form.value.companyname);
    postForm.append("createdby", nickname);
    postForm.append("period", this.form.value.period);
    postForm.append("industry", this.form.value.industry);
    // postForm.append("accessType", this.form.value.accessType);
    postForm.append("employer", localStorage.getItem("employer")); //
    console.log(JSON.stringify(postForm));

   postForm.forEach((value,key) => {
      console.log(key+" "+value)
    });
    
    this.inprogress = true;
    this.RMIAPIsService.uploadData(this.UrlConfigService.getuploadStatementAPI(),postForm)
    .subscribe((res:any)=>{
      console.log(res.Result,"res upload")
      if(res.Result == "File Uploaded Successfully"){
      this.inprogress = false;
      this.router.navigate(['/statement']);
      this._snackBar.openFromComponent(uploadSnackBarStatementComponent, {
        duration: 8000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      });
      }
      else if(res.Result == "Company Name Exist Already, Try Other"){
        this.inprogress = false;
        this._snackBar.openFromComponent(snackBarCompanyNameExists, {
          duration: 8000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });

      }
      else if(res.Result == "Extraction Failed"){
        this.inprogress = false;
        this._snackBar.openFromComponent(uploadFailureSnackBarStatementComponent, {
          duration: 8000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition
        });
      }
    });
  }
  }

export function markAllAsDirty(form: FormGroup) {
  for (const control of Object.keys(form.controls)) {
    form.controls[control].markAsDirty();
  }
}
export function resetForm(form: FormGroup) {
  form.reset({
    file: "",
  });
  form.get("file").markAsUntouched();
}


@Component({
  selector: 'snackBar',
  templateUrl: 'snackBar.html',
  styles: [`
    .snackBar{
      color: #fff;
    }
    b{
      color:#fff !important;
    }
    .material-icons{
      color:lightgreen;
    }
  `],
})
export class uploadSnackBarStatementComponent {}

@Component({
  selector: 'snackBarFailure',
  templateUrl: 'snackBarFailure.html',
  styles: [`
    .snackBar{
      color: #fff;
    }
    b{
      color:#fff !important;
    }
    .material-icons{
      color:lightgreen;
    }
  `],
})
export class uploadFailureSnackBarStatementComponent {}

@Component({
  selector: 'snackBarCompanyNameExists',
  templateUrl: 'snackBarCompanyNameExists.html',
  styles: [`
    .snackBar{
      color: #fff;
    }
    b{
      color:#fff !important;
    }
    .material-icons{
      color:lightgreen;
    }
  `],
})
export class snackBarCompanyNameExists {}
