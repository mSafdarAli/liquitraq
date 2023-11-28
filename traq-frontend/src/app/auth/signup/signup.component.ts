import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/_services/auth.service';
import { NewListingPopupComponent } from 'src/app/users/user-listing/new-listing-popup/new-listing-popup.component';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from 'src/_services/must-match.validator';
import { changeDateToApiFormat } from 'src/_services/utility';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  id: string;
  loginForm: FormGroup;
  userId: any;
  roleOptions: lookupdata[] = [];
  passwordHide: boolean = true;
  confirmHide: boolean = true;
  routSub: Subscription = null;
  start_date: any = ''
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewListingPopupComponent>,
    private userServices: AuthService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private router:Router,
  ) {
    this.routSub = this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
    this.loginForm = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required]],
        company_name: ['', [Validators.required]],
        contact: ['', [Validators.required,Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)]],
        corporate_address: ['', [Validators.required]],
        location_address: ['', [Validators.required]],
        start_date: [''],
        password: ['', [Validators.required,Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        image:'',
        active: [true],
        isDeleted:false
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }
  ngOnInit(): void {
    this.start_date = new Date() 

  }
  onSubmit() {
    if (this.loginForm.value) {
  
        const data=Object.assign({},this.loginForm.value);
        data.start_date=changeDateToApiFormat(this.start_date);
        delete data.confirmPassword;
        const sub = this.userServices.registerUser(data)
          .subscribe({
            next: (res) => {
              this.toaster.success('Registered');
              this.loginForm.reset();
              this.router.navigateByUrl('login');
              sub.unsubscribe();
            },
            error: (res) => {
              sub.unsubscribe();
            },
          });
      }
    }
  }

