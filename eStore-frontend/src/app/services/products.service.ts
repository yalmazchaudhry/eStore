import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private httpClient: HttpClient) {}
  getAllProducts(userId: any, params: any): Observable<any> {
    const queryParams = new HttpParams({ fromObject: params }); // Convert params object to query parameters

    return this.httpClient.get(environment.BASE_URL + 'products', {
      params: queryParams,
    });
  }
  addProduct(data: any): Observable<any> {
    return this.httpClient.post(environment.BASE_URL + 'add-product', data);
  }
  editProduct(data: any, id: any): Observable<any> {
    return this.httpClient.put(
      environment.BASE_URL + 'edit-product/' + id,
      data
    );
  }
  importProducts(data: any, id: any): Observable<any> {
    return this.httpClient.post(
      environment.BASE_URL + 'import-products/' + id,
      data
    );
  }
  deleteProduct(id: any): Observable<any> {
    return this.httpClient.delete(
      environment.BASE_URL + 'delete-product/' + id
    );
  }
}
