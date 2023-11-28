import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { lookupdata } from 'src/_models/lookup';
// import { UserService } from 'src/_services/rest/user.service';
import { NewListingPopupComponent } from '../user-listing/new-listing-popup/new-listing-popup.component';
import { MustMatch } from 'src/_services/must-match.validator';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from 'src/_services/rest/user.service';
import { changeDateToApiFormat } from 'src/_services/utility';
import { LookUpService } from 'src/_services/rest/lookup.service';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
})
export class UpdateComponent implements OnInit, OnDestroy {
  id: string;
  form: FormGroup;
  userId: any;
  selectRole: lookupdata[] = [];
  passwordHide: boolean = true;
  confirmHide: boolean = true;
  routSub: Subscription = null;
  queryParams: Subscription = null;
  query: Params = {};
  image: string | ArrayBuffer | null = null;
  start_date: any = '';
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewListingPopupComponent>,
    private userServices: UserService,
    private router: Router,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private lookupService: LookUpService
  ) {
    this.selectRole = this.lookupService.getRoleTypes();
    this.routSub = this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
    this.queryParams = this.route.queryParams.subscribe((qparams) => {
      this.query = qparams;
    });
    this.form = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required]],
        company_name: ['', [Validators.required]],
        contact: ['', [Validators.required, Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)]],
        corporate_address: ['', [Validators.required]],
        location_address: ['', [Validators.required]],
        start_date: [''],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        image: '',
        active: [true],
        role: ['', [Validators.required]],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );

    if (this.id) {
      const sub = this.userServices.getUserbyId(this.id).subscribe({
        next: (res) => {
          this.image = res['data'].image;
          this.form.patchValue({
            name: res['data']?.name ? res['data']?.name : '',
            role: res['data']?.role ? res['data']?.role : '',
            email: res['data']?.email ? res['data']?.email : '',
            company_name: res['data']?.company_name
              ? res['data']?.company_name
              : '',
            contact: res['data']?.contact
              ? res['data']?.contact
              : '',
            corporate_address: res['data']?.corporate_address
              ? res['data']?.corporate_address
              : '',
            location_address: res['data']?.location_address
              ? res['data']?.location_address
              : '',
            start_date: res['data']?.start_date ? res['data']?.start_date : '',
            active: res['data']?.active ? res['data']?.active : '',
            image: res['data']?.image
              ? res['data']?.image : '',
          });

          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
  }
  ngOnInit(): void {
    this.start_date = new Date()
    if (this.image === null) {
      // this.imageUrl=
    }
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.readImage(file);
    }
  }
  readImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  onSubmit() {
    if (this.form.value) {
      if (this.id) {
        const data = Object.assign({}, this.form.value);
        data.start_date = changeDateToApiFormat(this.start_date);
        data.image = this.image;
        delete data.password;
        delete data.confirmPassword;
        const sub = this.userServices
          .updateUser(this.id, data)
          .subscribe({
            next: (res) => {
              this.toaster.success('User Updated');
              this.router.navigate(['/user'], { queryParams: this.query });
              sub.unsubscribe();
            },
            error: (res) => {
              sub.unsubscribe();
            },
          });
      } else {
        const data = Object.assign({}, this.form.value);
        data.start_date = changeDateToApiFormat(this.start_date);
        data.image = this.image;
        delete data.confirmPassword;

        const sub = this.userServices
          .createOrUpdateUser(data)
          .subscribe({
            next: (res) => {
              this.toaster.success('User Created');
              this.router.navigate(['/user'], { queryParams: this.query });
              sub.unsubscribe();
            },
            error: (res) => {
              sub.unsubscribe();
            },
          });
      }
    }
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
    this.queryParams.unsubscribe();
  }
}
