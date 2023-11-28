import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  public changePassword(data) {
    return this.http.post(environment.api + 'user//change/password', data).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public getAllUsers(params) {
    return this.http.get(environment.api + 'user', { params: params }).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public getUserbyId(id: string) {
    return this.http.get(environment.api + 'user/' + id).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public getRoles() {
    return this.http.get(environment.api + 'lookup/get-roles').pipe(
      map((res) => {
        if (res) {
          var DataList: lookupdata[] = [];
          res['data'].map((e) => {
            DataList.push({
              name: e.name,
              value: e._id,
            });
          });
          return DataList;
        }
        return null;
      })
    );
  }

  public createOrUpdateUser(data: Object) {
    return this.http.post(environment.api + 'user', data).pipe(
      map((res) => {
        return res;
      })
    );
  }
  public updateUser(id: string, data: Object) {
    return this.http.post(environment.api + 'user/' + id, data).pipe(
      map((res) => {
        return res;
      })
    );
  }

  public deleteUser(id: number,data:Object) {
    return this.http.put(environment.api + 'user/' + id,data).pipe(
      map((res) => {
        return res;
      })
    );
  }
}
