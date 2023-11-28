import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class LookUpService {
  constructor(private http: HttpClient) {}

  
  public getAllJobStatus() {
    return [
      { name: 'In Progress', value: 'in-progress' },
      { name: 'Completed', value: 'completed' }
    ];
  }
  public getAllStatus() {
    return [
      { name: 'Original State', value: 'originalState' },
      { name: 'In Progress', value: 'in-progress' },
      { name: 'Completed', value: 'completed' }
    ];
  }
  public getAllDispositions() {
    return [
      { name: 'Resold', value: 'resold' },
      { name: 'Recycled', value: 'recycled' },
      { name: 'Disposed', value: 'disposed' },
      { name: 'Return to Customer', value: 'returnToCustomer' }
    ];
  }
  
  public getRoleTypes() {
    return [
      { name: 'Admin', value: 'Admin' },
      { name: 'User', value: 'User' }
    ];
  }
  
  public getAllTypes(category) {
    return this.http
      .get(environment.api + 'types/'+ category)
      .pipe(
        map((res) => {
          if (res) {
            var DataList: lookupdata[] = [];
            res['data'].map((e) => {
              DataList.push({
                name: e.name,
                value: e.value,
              });
            });
            return DataList;
          }
          return null;
        })
      );
  }

  public getAllJobs() {

    return this.http
      .get(environment.api + 'jobs/read/jobs')
      .pipe(
        map((res) => {
          if (res) {
            var DataList: lookupdata[] = [];
            res['data'].map((e) => {
              DataList.push({
                name: e.name ,
                value: e.value,
              });
            });
            return DataList;
          }
          return null;
        })
      );
  }
}
