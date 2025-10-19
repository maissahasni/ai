import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: false,
  templateUrl: './signin.html',
  styleUrl: './signin.scss'
})
export class Signin {
email = '';
  loading = false;
  error?: string;

  constructor(private auth: AuthService) {}

  signIn() {
    this.error = undefined;
    if (!this.email || !this.email.includes('@')) {
      this.error = 'Please enter a valid email.';
      return;
    }
    this.loading = true;
    this.auth.signInByEmail(this.email).subscribe(ok => {
      this.loading = false;
      if (!ok) this.error = 'Email not found.';
    });
  }
}
