import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-front-header',
  standalone: false,
  templateUrl: './front-header.html',
  styleUrl: './front-header.scss'
})
export class FrontHeader {
  constructor(public auth: AuthService, private router: Router) {}

  get user() {
    return this.auth.currentUser;
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  signOut() {
    this.auth.signOut();
  }

}
