import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { JobService } from 'src/_services/rest/jobs.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { changeDateToApiFormat } from 'src/_services/utility';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
})
export class UpdateComponent implements OnInit, OnDestroy {
  id: string = '';
  form: FormGroup;
  routSub: Subscription = null;
  queryParams: Subscription = null;
  picturesFirst: any;
  pictures: any[] = [];
  extraPictures: any[] = [];
  payload: any[] = [];
  selectStatus: lookupdata[] = [];
  nextJobNumber: any;
  data: any = [];
  query:Params={};
  constructor(
    private formBuilder: FormBuilder,
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private lookupService: LookUpService
  ) {
    this.routSub = this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.nextJobNumber = params['nextJobNumber'];
    });
    this.queryParams = this.route.queryParams.subscribe((qparams) => {
      this.query = qparams;
    });
    this.form = this.formBuilder.group({
      job_name: ['', Validators.required],
      job_no: this.nextJobNumber,
      client: ['', Validators.required],
      address: ['', Validators.required],
      status: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      pictures: [''],
    });
    if (this.id) {
      const sub = this.jobService.getSinglejob(this.id).subscribe({
        next: (res) => {
          this.form.patchValue({
            job_name: res['data']?.job_name ? res['data']?.job_name : '',
            job_no: res['data']?.job_no ? res['data']?.job_no : '',
            client: res['data']?.client ? res['data']?.client : '',
            address: res['data']?.address ? res['data']?.address : '',
            status: res['data']?.status ? res['data']?.status : '',
            start_date: res['data']?.start_date ? res['data']?.start_date : '',
            end_date: res['data']?.end_date ? res['data']?.end_date : '',
            pictures: res['data']?.pictures ? res['data']?.pictures : '',
          });

          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
    this.selectStatus = this.lookupService.getAllJobStatus();
  }
  ngOnInit(): void {}

  selectTemplate(event) {
    const file = event.target.files[0];
    for (let i = 0; i < event.target.files.length; i++) {
      this.payload.push(event.target.files[i]);
    }
    var fileAmount = event.target.files.length;
    for (let index = 0; index < fileAmount; index++) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        if (this.pictures.length < 5) {
          if (index == 0) {
            this.picturesFirst = event.target.result;
          } else {
            this.pictures.push(event.target.result);
          }
        }
      };
      reader.readAsDataURL(event.target.files[index]);
    }
  }
  removeFile(file, image = false) {
    if (image) {
      this.picturesFirst = '';
    }
    const ind = this.pictures.indexOf(file);
    this.pictures.splice(ind, 1);
  }

  submit() {
    if (this.form.value) {
      const data = Object.assign({}, this.form.value);
      data.pictures = this.pictures;
      data.start_date=changeDateToApiFormat(data.start_date);
      data.end_date=changeDateToApiFormat(data.end_date);
      if (this.id) {
        const sub = this.jobService
          .updatejob(this.id, this.payload, data)
          .subscribe({
            next: (res) => {
              this.toaster.success('Jobs Updated','Success');
              sub.unsubscribe();
              this.router.navigate(['/job'],{queryParams:this.query});
            },
            error: (res) => {
              sub.unsubscribe();
            },
          });
      } else {
        const sub = this.jobService
          .createjob(this.payload, data)
          .subscribe({
            next: (res) => {
              this.toaster.success('Job Created','Success');
              this.router.navigate(['/job'],{queryParams:this.query});
              sub.unsubscribe();
            },
            error: (res) => {
              sub.unsubscribe();
            },
          });
      }
    }
  }
  getExtraElement() {
    this.extraPictures = [];
    if (this.pictures.length < 4) {
      const length = 4 - this.pictures.length;
      for (let index = 0; index < length; index++) {
        this.extraPictures.push(index);
      }
    }
    return this.extraPictures;
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
     this.queryParams.unsubscribe();
  }
}
