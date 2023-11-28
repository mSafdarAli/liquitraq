import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private http: HttpClient) {}

  getAlljobs(params=null) {
    return this.http
      .get(environment.api + 'jobs/',{params:params})
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getSinglejob(id: string) {
    return this.http.get(environment.api + 'jobs/' + id).pipe(
      map((res) => {
        return res;
      })
    );
  }
  public createjob(files, data: Object) {
    const uploadData = new FormData();
    if (files.length > 0) {
      files.forEach((el) => {
        uploadData.append('file', el, el.name);
      });
    }
    uploadData.append('job_name', data['job_name']);
    uploadData.append('job_no', data['job_no']);
    uploadData.append('client', data['client']);
    uploadData.append('address', data['address']);
    uploadData.append('status', data['status']);
    uploadData.append('start_date', data['start_date']);
    uploadData.append('end_date', data['end_date']);
    return this.http.post(environment.api + 'jobs/create', uploadData).pipe(
      map((res) => {
        return res;
      })
    );
  }
  public updatejob(id, files, data) {
    const uploadData = new FormData();
    if (files.length > 0) {
      files.forEach((el) => {
        uploadData.append('file', el, el.name);
      });
    }
    uploadData.append('job_name', data['job_name']);
    uploadData.append('job_no', data['job_no']);
    uploadData.append('client', data['client']);
    uploadData.append('address', data['address']);
    uploadData.append('status', data['status']);
    uploadData.append('start_date', data['start_date']);
    uploadData.append('end_date', data['end_date']);
    return this.http.post(environment.api + 'jobs/' + id, uploadData).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public deletejob(id: number, data: Object) {
    return this.http.put(environment.api + 'jobs/' + id, data).pipe(
      map((res) => {
        return res;
      })
    );
  }
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
