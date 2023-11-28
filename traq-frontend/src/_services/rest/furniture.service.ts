import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { lookupdata } from 'src/_models/lookup';

@Injectable({
  providedIn: 'root',
})
export class FurnitureService {
  constructor(private http: HttpClient) {}

  getAllFurniture(category,params=null) {
    return this.http
      .get(environment.api + 'products/'+category,{params:params} )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
  getSingleProduct(id: string) {
    return this.http.get(environment.api + 'products/get/' + id).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getGraphData(category: string) {
    return this.http.get(environment.api + 'products/product/' + category).pipe(
      map((res) => {
        return res;
      })
    );
  }
  public createProduct(files,data) {
		const uploadData = new FormData();
		if (files.length > 0) {
			files.forEach(el => {
				uploadData.append('file', el, el.name);
			});
		}
    
		// if (serial.length > 0) {
		// 	serial.forEach(el => {
		// 		uploadData.append('serial', el, el.name);
		// 	});
		// }
		uploadData.append("assetName", data["assetName"]);
    uploadData.append("serial", data["serial"]);
    uploadData.append("pictureSerial", data["pictureSerial"]);
		uploadData.append("type", data["type"]);
    uploadData.append("job", data["job"]);
    uploadData.append("price", data["price"]);
    uploadData.append("description", data["description"]);
    uploadData.append("quantity", data["quantity"]);
    uploadData.append("weight_each", data["weight_each"]);
    uploadData.append("make", data["make"]);
    uploadData.append("model", data["model"]);
    uploadData.append("status", data["status"]);
    uploadData.append("disposition", data["disposition"]);
    uploadData.append("date", data["date"]);
    uploadData.append("who", data["who"]);
    uploadData.append("ticketInfo", data["ticketInfo"]);
    uploadData.append("shippingInfo", data["shippingInfo"]);
    uploadData.append("category", data["category"]);
    uploadData.append("notes", data["notes"]);
		return this.http.post(environment.api + 'products/create', uploadData).pipe(map(res => {
				return res;
		}));
	}

  public updateProduct(id,files,data) {
    const uploadData = new FormData();
		if (files.length > 0) {
			files.forEach(el => {
				uploadData.append('file', el, el.name);
			});
		}
    // if (serial.length > 0) {
		// 	serial.forEach(el => {
		// 		uploadData.append('serial', el, el.name);
		// 	});
		// }
    uploadData.append("assetName", data["assetName"]);
    uploadData.append("serial", data["serial"]);
    uploadData.append("pictureSerial", data["pictureSerial"]);
		uploadData.append("type", data["type"]);
    uploadData.append("job", data["job"]);
    uploadData.append("price", data["price"]);
    uploadData.append("description", data["description"]);
    uploadData.append("quantity", data["quantity"]);
    uploadData.append("weight_each", data["weight_each"]);
    uploadData.append("make", data["make"]);
    uploadData.append("model", data["model"]);
    uploadData.append("status", data["status"]);
    uploadData.append("disposition", data["disposition"]);
    uploadData.append("date", data["date"]);
    uploadData.append("who", data["who"]);
    uploadData.append("ticketInfo", data["ticketInfo"]);
    uploadData.append("shippingInfo", data["shippingInfo"]);
    uploadData.append("category", data["category"]);
    uploadData.append("notes", data["notes"]);
   return this.http.put(environment.api + 'products/'+id,uploadData).pipe(
      map((res) => {
        return res;
      })
    );
  }
  
  public deleteProduct(id: number,data:Object) {
    return this.http.post(environment.api + 'products/' + id,data).pipe(
      map((res) => {
        return res;
      })
    );
  }
  
}
