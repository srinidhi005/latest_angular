import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/shared/excel.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {

  constructor(private excelService: ExcelService, public authService: AuthService) { }

  ngOnInit(): void {
  }

  progressMsg = ""
  imageLoadComplete = false;

  index = 1;
  changePassword(){
      this.initChangePassword();
    }


initChangePassword(){
  this.authService.changePassword(this.authService.loggedInUserDetails?.email).subscribe(res => {
    console.log("Sent a mail to update the password", res);
    // this.openSnackBar("We have sent a link to your Email to update your password")
    // this.excelService.showMessage("We have sent an Email with a Link to Update your Password", "Ok", '350px', '160px')
    this.progressMsg = "We have sent you an email to update your password "
  }, error => {
    console.log("Failed to send a mail to update the password", error);
    // this.excelService.showMessage("We have sent an Email with a Link to Update your Password", "Ok", '350px', '160px');
    if(error.status == 200){
      this.progressMsg = "We have sent you an email to update your password"
    }
    else{
      this.progressMsg = "Failed to send an Email. Please Contact your Admin";
    }
  })
}

  goToNextSlide(){
    this.imageLoadComplete = false
    if(this.index >0 && this.index < 7){
      this.index ++; 
    }
    else{
      this.excelService.closeAllPopups();
    }
  }

  goToPrevSlide(){
    if(this.index > 1){
      this.index--;
    }
  }

  imageLoaded(){
    this.imageLoadComplete = true;
  }

  closeTutDialog(){
    this.excelService.closeAllPopups();
  }

}
