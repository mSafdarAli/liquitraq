import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getPropertyJob(params = null) {

    return this.http
      .get(environment.api + 'dashboard/jobs',)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

   getItemChart(params = null) {

    return this.http
      .get(environment.api + 'dashboard/itemchart',)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getPropertyStatus(params = null) {
    return this.http
      .get(environment.api + 'dashboard/status',)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getPropertyDisposition(params = null) {
    return this.http
      .get(environment.api + 'dashboard/disposition',)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getPropertyPrice(params = null) {
    return this.http
      .get(environment.api + 'dashboard/price',)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  // getPropertybyid(id: string) {
  //   return this.http.get(environment.api + 'properties/' + id).pipe(
  //     map((res) => {
  //       return res;
  //     })
  //   );
  // }

  // public salesTotal(data: Object) {
  //     return this.http.post(environment.api + 'Dashboard/salesTotals', data).pipe(map(res => {
  //         return res;
  //     }));
  // }
  // public salesPerRep(data: Object) {
  //     return this.http.post(environment.api + 'Dashboard/salesPerRep', data).pipe(map(res => {
  //         return res;
  //     }));
  // }
  // public salesVsTarget(data: Object) {
  //     return this.http.post(environment.api + 'Dashboard/salesVsTargetsAnnual', data).pipe(map(res => {
  //         return res;
  //     }));
  // }
  // public getRep(userId: string) {
  //     return this.http.get(environment.api + 'users/getUsersWithLinkedContacts/' + userId).pipe(map(res => {
  //         if(res['statusDescription']=='Ok'){
  //             var DataList : lookupdata[] = [];
  //             res['data'].map(e => {
  //                 DataList.push({name : e.firstName + ' ' + e.lastName , value : e.id.toString()});

  //             });
  //             return DataList;
  //         }
  //         return null
  //     }));
  // }
}
