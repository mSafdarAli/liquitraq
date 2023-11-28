import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/_services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private _auth: AuthService,
    private router: Router,
    private toaster: ToastrService
  ) {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      oldpassword: ['', Validators.required],
      newpassword: ['', Validators.required],
      confirmpassword: ['', Validators.required],
    });
  
  }

  ngOnInit(): void {}
  submit() {
    if (this.form.valid) {
      const sub = this._auth
        .changePassword(this.form.value)
        .subscribe({
          next: (res) => {
            this.toaster.success('Your Password is changed');
            this.router.navigateByUrl['/login'];
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
    }
  }
}
