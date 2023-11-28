import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { lookupdata } from 'src/_models/lookup';
import { FurnitureService } from 'src/_services/rest/furniture.service';
import { LookUpService } from 'src/_services/rest/lookup.service';
import { ToastrService } from 'ngx-toastr';
import { changeDateToApiFormat } from 'src/_services/utility';
@Component({
  selector: 'app-asset-form',
  templateUrl: './asset-form.component.html',
  styleUrls: ['./asset-form.component.scss'],
})
export class AssetFormComponent implements OnInit, OnDestroy {
  @Input() assetType = '';
  form: FormGroup;
  data: string = '';
  id: string = '';
  picturesFirst: any;
  serialImage: any;
  routSub: Subscription = null;
  queryParams: Subscription = null;
  pictures: any[] = [];
  extraPictures: any[] = [];
  payload: any[] = [];
  serialPayload:any[]=[];
  selectType: lookupdata[] = [];
  selectJobNo: lookupdata[] = [];
  selectStatus: lookupdata[] = [];
  selectDisposition: lookupdata[] = [];
  query: Params = {};
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
    this.queryParams = this.route.queryParams.subscribe((qparams) => {
      this.query = qparams;
    });
    this.form = this.formBuilder.group({
      assetName: ['', Validators.required],
      pictureSerial: ['', Validators.required],
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
      notes: [''],
    });
    if (this.id) {
      const sub = this.furnitureService.getSingleProduct(this.id).subscribe({
        next: (res) => {
          if (res['data'].pictures != null && res['data'].pictures.length > 0) {
            this.picturesFirst = res['data']?.pictures[0];
            this.pictures = res['data']?.pictures.slice(1);
          }
          if (res['data'].serial != null && res['data'].serial.length > 0) {
            this.serialImage = res['data']?.serial[0];

          }
          this.form.patchValue({
            assetName: res['data']?.assetName ? res['data']?.assetName : '',
            notes: res['data']?.notes ? res['data']?.notes : '',
            serial: res['data']?.serial ? res['data']?.serial : '',
            pictureSerial: res['data']?.pictureSerial ? res['data']?.pictureSerial : '',
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
            disposition: res['data']?.disposition['data'].type ? res['data']?.disposition['data'].type
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

    this.selectStatus = this.lookupService.getAllStatus();
    this.selectDisposition = this.lookupService.getAllDispositions();
  }
  ngOnInit() {
    this.getAllTypes(this.assetType);
    this.getAllJobs();
  }
  selectTemplate(event) {
    const file = event.target.files[0];
    for (let i = 0; i < event.target.files.length; i++) {

      this.payload.push(event.target.files[i])
    }
    var fileAmount = event.target.files.length;
    for (let index = 0; index < fileAmount; index++) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        if (this.pictures.length < 5) {
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
  // selectSerialImage(event) {
  //   const file = event.target.files[0];
  //   this.serialPayload.push(file);

  //   var fileAmount = event.target.files.length;
  //   for (let index = 0; index < fileAmount; index++) {
  //     const reader = new FileReader();
  //     reader.onload = (event: any) => {
  //       this.serialImage = event.target.result;
  //     };
  //     reader.readAsDataURL(event.target.files[index]);
  //   }
  // }
  removeFile(file, image = false) {
    if (image) {
      this.picturesFirst = '';
    }
    const ind = this.pictures.indexOf(file);
    this.pictures.splice(ind, 1);
  }
  removeSerial() {
    this.serialImage='';
  }
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
  submit() {
    if (this.form.value) {
      if (this.id) {
        const data = Object.assign({}, this.form.value);
        data.category = this.assetType;
        data.date = changeDateToApiFormat(data.date)
        data.pictures = this.pictures;
        const sub = this.furnitureService
          .updateProduct(this.id, this.payload, data)
          .subscribe({
            next: (res) => {
              this.toaster.success(this.assetType, 'Updated');
              if (this.assetType === 'Furniture') {
                this.router.navigate(['/furniture'], { queryParams: this.query });
              } else if (this.assetType === 'Infrastructure') {
                this.router.navigate(['/infra'], { queryParams: this.query });
              } else {
                this.router.navigate(['/it'], { queryParams: this.query });
              }
              sub.unsubscribe();
            },
            error: (res) => {
              sub.unsubscribe();
            },
          });
      } else {
        const data = Object.assign({}, this.form.value);
        data.category = this.assetType;
        data.pictures = this.pictures;
       
        data.date = changeDateToApiFormat(data.date);
        const sub = this.furnitureService.createProduct(this.payload, data).subscribe({
          next: (res) => {
            this.toaster.success(this.assetType, 'Created');
            if (this.assetType === 'Furniture') {
              this.router.navigate(['/furniture'], { queryParams: this.query });
            } else if (this.assetType === 'Infrastructure') {
              this.router.navigate(['/infra'], { queryParams: this.query });
            } else {
              this.router.navigate(['/it'], { queryParams: this.query });
            }
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
    this.extraPictures = []
    if (this.pictures.length < 4) {
      const length = (4 - this.pictures.length)

      for (let index = 0; index < length; index++) {
        this.extraPictures.push(index)
      }
    }
    return this.extraPictures;
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
    this.queryParams.unsubscribe();
  }
}
