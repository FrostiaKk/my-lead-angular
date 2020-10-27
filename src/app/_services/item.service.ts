import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../_models/user';
import {baseUrl} from '../../environments/environment';
import {Item} from '../_models/Item';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Item[]>(`${baseUrl}item`);
  }

  storeItem(data): Observable<any> {
    return this.http.post(`${baseUrl}item`, data);
  }

  updateItem(data, id): Observable<any> {
    return this.http.post(`${baseUrl}item/` + id, data);
  }

  deleteItem(id): Observable<any> {
    return this.http.delete(`${baseUrl}item/` + id);
  }

  getById(id): Observable<any> {
    return this.http.get(`${baseUrl}item/` + id);
  }

  // sorted, filtered and paginated item data.
  getAllSorted(sort: string, order: string, page: number, filter: string, pagination: number): Observable<ApiIssue> {
    const href = `${baseUrl}item`;
    if (sort === 'created') {
      sort = 'id';
    }
    if (order === 'desc') {
      sort = '-' + sort;
    }
    const requestUrl =
      `${href}?sort=${sort}&page=${page + 1}&filter[name]=${filter}&include=prices,file&pagination=${pagination}`;
    return this.http.get<ApiIssue>(requestUrl);
  }
}
export interface ApiIssue {
  data: Item[];
  total: number;
}
