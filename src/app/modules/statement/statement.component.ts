import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { RMIAPIsService } from '../../shared/rmiapis.service';
import { UrlConfigService } from 'src/app/shared/url-config.service';
import { UserDetailModelService } from 'src/app/shared/user-detail-model.service';
import { MatDialog } from '@angular/material/dialog';
import { TutorialComponent } from 'src/app/modules/tutorial/tutorial.component'
import { AuthService } from '../../auth.service';
import { ExcelService } from 'src/app/shared/excel.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
export interface PeriodicElement {
  name: string;
  position: number;
  company: string;
  industry: string;
  createdOn: any;
  createdBy: string;
  download: string;
  delete: string;
  filename: any;
type: string;
}
const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class StatementComponent implements OnInit {
	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  progressBar: boolean;
  editModeOn: boolean = false;
  selectedRowIndex = -1;
  dataset: any = [];
  downloadLink: any;
  downloadAction: any;
  url: string;
  companiesArray: any = [];
  statementResponse: any;
  expandedElement: PeriodicElement | null;
  displayedColumns: string[] = [
    'position',
    'name',
    'company',
    'industry',
    'createdOn',
    'createdBy',
    'type',
    'download',
    'delete',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('downloadForm', { static: true }) downloadForm: any;
  public downloadGroup = this.formBuilder.group({});
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(
    private apiService: RMIAPIsService,
    private userDetailModelService: UserDetailModelService,
    private urlConfig: UrlConfigService,
    public dialog: MatDialog,
	  public formBuilder: FormBuilder,
	  public authService: AuthService,
	  private _snackBar: MatSnackBar,
	  public excelService : ExcelService,
  ) {}
	  ngOnInit(): void {
	  this.excelService.selectedDashboardMenu == 'MyCompanies'
	this.authService.passwordChangeSubscriber.subscribe( res => {
    if(this.authService.firstTimeLogin){
      let dialogRef = this.dialog.open(TutorialComponent, { 
        width: '70%',
        height:'80%' 
      }); 
    
      dialogRef.afterClosed().subscribe(result => { 
        // this.animal = result; 
      }); 
     }
   })




	ELEMENT_DATA.length=0;
	  const nickname = localStorage.getItem('nickname');
	  const employer = localStorage.getItem('employer');
    this.progressBar = true;
    const val = this.urlConfig.getStatementAPI() + employer;
    this.apiService
      .getData(this.urlConfig.getStatementAPI() + employer)
      .subscribe((res: any) => {
		   if (res == '') {
			    this.progressBar = false;
              this._snackBar.openFromComponent(snackBarStatementFailure, {
				 
                duration: 9000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
            }
			else{
        const data = res.map((el, index) => ({
          ...el,
          position: index + 1,
          action: null,
        }));
        this.dataset = data;
        for (let index = 0; index < data.length; index++) {
          var pushData = {
            position: index + 1,
            name: data[index].companyname,
            company: data[index].company,
            industry: data[index].industry,
            createdOn: data[index].createdon,
	    createdBy: data[index].createdby,
	    type: data[index].statementtype,
            download: 'download',
            delete: 'delete',
            filename: data[index].filename,
          };
          ELEMENT_DATA.push(pushData);
          this.dataSource.paginator = this.paginator;

          this.dataSource._updateChangeSubscription();
          this.progressBar = false;
        }
			}
      });
  }
  deleteDialogBox(element: any) {
    const dialogRef = this.dialog.open(DialogElementsExampleDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.deleteStatement(element);
      }
    });
    this.ngOnInit();
  }
  deleteStatement(element: any) {
    this.apiService
      .getData(this.urlConfig.getDeleteStatementAPI() + element.name)
      .subscribe((res: any) => {
        ELEMENT_DATA.splice(element.position - 1, 1);
        this.dataSource._updateChangeSubscription();
        this.dataSource._renderChangesSubscription;
           
          });
  }

  downloadStatement(element: any) {
    this.downloadAction =
      this.urlConfig.getDownloadStatementAPI() + element.name;
    this.downloadForm.nativeElement.submit();
  }

  loadvisualsIS() {
    this.userDetailModelService.getSelectedCompany();
  }
  incomeStatement(element: any) {
    localStorage.setItem('companySelected', element.name);
    localStorage.setItem('selectedCompanyName', element.company);
    this.userDetailModelService.setSelectedCompany(element.name);
    this.userDetailModelService.setSelectedScenario(0);
  }
  balanceStatement(element: any) {
    localStorage.setItem('companySelected', element.name);
    localStorage.setItem('selectedCompanyName', element.company);
    this.userDetailModelService.setSelectedCompany(element.name);
    this.userDetailModelService.setSelectedScenario(0);
  }
  cashFlowStatement(element: any) {
    localStorage.setItem('companySelected', element.name);
    localStorage.setItem('selectedCompanyName', element.company);
    this.userDetailModelService.setSelectedCompany(element.name);
    this.userDetailModelService.setSelectedScenario(0);
  }
  saveCompanyName(compObj, index) {
    // APICALL to save the comp Name
  }
}

@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: 'dialogbox.html',
  styleUrls: ['./statement.component.scss'],
})
export class DialogElementsExampleDialog {}
@Component({
  selector: 'snackBarStatementsLoadFailure',
  templateUrl: 'snackBarStatementsLoadFailure.html',
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
export class snackBarStatementFailure {}
