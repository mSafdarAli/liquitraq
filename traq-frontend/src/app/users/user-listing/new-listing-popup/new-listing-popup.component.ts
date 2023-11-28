import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { lookupdata } from 'src/_models/lookup';
import { MustMatch } from 'src/_services/must-match.validator';
import { UserService } from 'src/_services/rest/user.service';

@Component({
  selector: 'app-new-listing-popup',
  templateUrl: './new-listing-popup.component.html',
  styleUrls: ['./new-listing-popup.component.scss'],
})
export class NewListingPopupComponent implements OnInit {
  form: FormGroup;
  userId: any;
  roleOptions: lookupdata[] = [];
  passwordHide: boolean = true;
  confirmHide: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewListingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private _userService: UserService,
    private toaster: ToastrService
  ) {
    this.userId = data.id;
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required,Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      roleId: [''],
      active: [true],
    },
    {
      validator: MustMatch('password', 'confirmPassword'),
    });
  }

  ngOnInit(): void {
    
    this.getRoles();
    if (this.userId != null) {
      this.clearValidators();
      const sub = this._userService.getUserbyId(this.userId).subscribe({
        next: (res) => {
          this.form.patchValue({
            name: res['data'].name ? res['data'].name : '',
            email: res['data'].email ? res['data'].email : '',
            password: res['data'].password ? res['data'].password : '',
            confirmPassword: res['data'].confirmPassword
              ? res['data'].confirmPassword
              : '',
            roleId: res['data'].roleId ? res['data'].roleId : '',
            active: res['data'].active ? res['data'].active : true,
          });
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

  getRoles() {
    const sub = this._userService.getRoles().subscribe({
      next: (res) => {
        this.roleOptions = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  clearValidators(){
    this.form.get('password').clearValidators();
    this.form.get('confirmPassword').clearValidators();
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.userId) {
        const data = Object.assign({}, this.form.value);
        delete data.confirmPassword;
        // delete data.password;
        const sub = this._userService.updateUser(this.userId, data).subscribe({
          next: (res) => {
            this.toaster.success('User Updated Successfully', 'Success');
            this.dialogRef.close();
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      } else {
        const data = Object.assign({}, this.form.value);
        delete data.confirmPassword;
        const sub = this._userService.createOrUpdateUser(data).subscribe({
          next: (res) => {
            this.toaster.success('User Created Successfully', 'Success');
            this.dialogRef.close();
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
    }
    else{
      this.form.markAllAsTouched();
    }
  }
}
