import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {TooltipPosition} from '@angular/material/tooltip';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {UserDetailModelService} from '../../user-detail-model.service';
import { AuthService } from '../../../auth.service';
import {RMIAPIsService} from '../../rmiapis.service';
import {UrlConfigService} from '../../url-config.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  myControl = new FormControl();
  options: string[] = [];
  picture:any;
  filteredOptions: Observable<string[]>;
  constructor( private apiService:RMIAPIsService,
    private urlConfig:UrlConfigService,public auth: AuthService) { }

  ngOnInit() {
    this.auth.profileSubscriber.subscribe(() => {
      this.picture = localStorage.getItem('picture');
    })
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
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
