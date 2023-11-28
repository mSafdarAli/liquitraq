import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { JobService } from 'src/_services/rest/jobs.service';
import { LookUpService } from 'src/_services/rest/lookup.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  id: string = '';
  form: FormGroup;
  routSub: Subscription = null;
  picturesFirst: any;
  pictures: any[] = [];
  extraPictures: any[] = [];
  payload: any[] = [];
  selectStatus: lookupdata[] = [];
  nextJobNumber:any
  data: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private lookupService: LookUpService,
  ) {
    this.routSub = this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.nextJobNumber = params['nextJobNumber'];
    });
    this.form = this.formBuilder.group({
      job_name: ['', Validators.required],
      job_no: this.nextJobNumber,
      client: ['', Validators.required],
      address: ['', Validators.required],
      status: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      pictures:['']
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
  ngOnInit(): void {

  }

  selectTemplate(event) {
    const file = event.target.files[0];
    this.payload.push(file);
    var fileAmount = event.target.files.length;
    for (let index = 0; index < fileAmount; index++) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        if(this.pictures.length<5){
          if (index == 0) {
            this.picturesFirst = event.target.result
          } else {
            this.pictures.push(event.target.result);
          }
        }
      };
      reader.readAsDataURL(event.target.files[index]);
    }
  }
  removeFile(file) {
    const ind = this.pictures.indexOf(file);
    this.pictures.splice(ind, 1);
  }
  getExtraElement() {
    this.extraPictures = []
    if (this.pictures.length < 4) {
      const length = (4 - this.pictures.length)
      for (let index = 0; index < length; index++) {
        this.extraPictures.push(index)
      }
    }
    return this.extraPictures;
  }
}
