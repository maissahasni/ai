import {Component, OnInit} from '@angular/core';
import {ThemeOptions} from '../../../../../theme-options';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
  standalone: false,})
export class UserBoxComponent implements OnInit {

  constructor(public globals: ThemeOptions,public auth: AuthService) {
  }

  ngOnInit() {
  }
  get user() { return this.auth.currentUser; }
  signOut() { this.auth.signOut(); }

}
