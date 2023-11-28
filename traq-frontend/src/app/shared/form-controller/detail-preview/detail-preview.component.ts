import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { FurnitureService } from 'src/_services/rest/furniture.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-detail-preview',
  templateUrl: './detail-preview.component.html',
  styleUrls: ['./detail-preview.component.scss']
})
export class DetailPreviewComponent implements OnInit {
  @Input() assetType = '';
  form: FormGroup;
  data: string = '';
  id: string = '';
  picturesFirst: any;
  routSub: Subscription = null;
  pictures: any[] = [];
  extraPictures: any[] = [];
  payload: any[] = [];
  selectType: lookupdata[] = [];
  selectJobNo: lookupdata[] = [];
  selectStatus: lookupdata[] = [];
  selectDisposition: lookupdata[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private lookupService: LookUpService,
    private furnitureService: FurnitureService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService
  ) {
    this.routSub = this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
    this.form = this.formBuilder.group({
      assetName: ['', Validators.required],
      serial: ['', Validators.required],
      type: ['', Validators.required],
      job: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      quantity: ['', Validators.required],
      weight_each: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      status: ['', Validators.required],
      disposition: [''],
      date: ['', Validators.required],
      who: [, Validators.required],
      ticketInfo: [''],
      shippingInfo: [''],
      pictures: [''],
    });

    if (this.id) {
      const sub = this.furnitureService.getSingleProduct(this.id).subscribe({
        next: (res) => {
          this.form.patchValue({
            assetName: res['data']?.assetName ? res['data']?.assetName : '',
            serial: res['data']?.serial ? res['data']?.serial : '',
            type: res['data']?.type ? res['data']?.type : '',
            job: res['data']?.job ? res['data']?.job : '',
            price: res['data']?.price ? res['data']?.price : '',
            description: res['data']?.description
              ? res['data']?.description
              : '',
            quantity: res['data']?.quantity ? res['data']?.quantity : '',
            weight_each: res['data']?.weight_each
              ? res['data']?.weight_each
              : '',
            make: res['data']?.make ? res['data']?.make : '',
            model: res['data']?.model ? res['data']?.model : '',
            status: res['data']?.status ? res['data']?.status : '',
            pictures: res['data']?.pictures ? res['data']?.pictures : '',
            disposition: res['data']?.disposition['data'].type
              ? res['data']?.disposition['data'].type
              : '',
            date: res['data']?.disposition['data'].date
              ? res['data']?.disposition['data'].date
              : '',
            who: res['data']?.disposition['data'].who
              ? res['data']?.disposition['data'].who
              : '',
            ticketInfo: res['data']?.disposition['data'].ticketInfo
              ? res['data']?.disposition['data'].ticketInfo
              : '',
            shippingInfo: res['data']?.disposition['data'].shippingInfo
              ? res['data']?.disposition['data'].shippingInfo
              : '',
          });

          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }

    // this.selectJobNo=this.lookupService.getAllTypes();
    this.selectStatus = this.lookupService.getAllStatus();
    this.selectDisposition = this.lookupService.getAllDispositions();
  }
  ngOnInit() {
    this.getAllTypes(this.assetType);
    this.getAllJobs();
  }
  selectTemplate(event) {
    const file = event.target.files[0];
    this.payload.push(file);
    var fileAmount = event.target.files.length;
    for (let index = 0; index < fileAmount; index++) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        if (this.pictures.length < 5) {
          if(index == 0){
            this.picturesFirst = event.target.result
          }else{
            this.pictures.push(event.target.result);
          }
        }
      };
      reader.readAsDataURL(event.target.files[index]);
    }
  }
  // removeFile(file, image=false) {
  //   if(image){
  //     this.picturesFirst = '';
  //   }
  //   const ind = this.pictures.indexOf(file);
  //   this.pictures.splice(ind, 1);
  // }
  getAllTypes(category) {
    const sub = this.lookupService.getAllTypes(category).subscribe({
      next: (res) => {
        this.selectType = res;

        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getAllJobs() {
    const sub = this.lookupService.getAllJobs().subscribe({
      next: (res) => {
        this.selectJobNo = res;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getExtraElement(){
    this.extraPictures =[]
    if(this.pictures.length<4){
      const length = (4 - this.pictures.length)
      for (let index = 0; index < length; index++) {
        this.extraPictures.push(index)
      }
    }
    return this.extraPictures;
  }
}
