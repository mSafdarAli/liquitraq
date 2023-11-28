import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private message=new BehaviorSubject(true);
  getMessage=this.message.asObservable();
  constructor(private http: HttpClient) {}

  setValue(message:boolean){
    this.message.next(message);
  }
  
}
