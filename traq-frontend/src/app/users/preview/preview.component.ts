import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { lookupdata } from 'src/_models/lookup';
// import { UserService } from 'src/_services/rest/user.service';
import { NewListingPopupComponent } from '../user-listing/new-listing-popup/new-listing-popup.component';
import { MustMatch } from 'src/_services/must-match.validator';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/_services/rest/user.service';
import { changeDateToApiFormat } from 'src/_services/utility';
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  id: string;
  form: FormGroup;
  userId: any;
  roleOptions: lookupdata[] = [];
  passwordHide: boolean = true;
  confirmHide: boolean = true;
  routSub: Subscription = null;
  image: string | ArrayBuffer | null = null;
  start_date: any = '';
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewListingPopupComponent>,
    private userServices: UserService,
    private router: Router,
    private toaster: ToastrService,
    private route: ActivatedRoute
  ) {
    
    this.routSub = this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
    this.form = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required]],
        company_name: ['', [Validators.required]],
        contact: ['', [Validators.required]],
        corporate_address: ['', [Validators.required]],
        location_address: ['', [Validators.required]],
        start_date: [''],
        password: ['', [Validators.required,Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        image:'',
        active: [true],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );

    if (this.id) {
      const sub = this.userServices.getUserbyId(this.id).subscribe({
        next: (res) => {
          this.image=res['data'].image;
          this.form.patchValue({
            name: res['data']?.name ? res['data']?.name : '',
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
            ? res['data']?.image:'',
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

}
