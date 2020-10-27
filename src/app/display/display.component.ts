import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Item} from '../_models/Item';
import {ItemService} from '../_services/item.service';
import {MatPaginator, MatSort} from '@angular/material';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {storageUrl} from '../../environments/environment';
import {merge} from 'rxjs';
import {catchError, first, map, startWith, switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements AfterViewInit {
  columnsToDisplay = ['img', 'name', 'description'];
  data;
  exampleDatabase: ItemService;
  filter = '';
  loading = false;
  error = '';
  success = '';
  pagination = 5;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  storagePath = `${storageUrl}`;


  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private itemService: ItemService,
              private router: Router,
              private httpClient: HttpClient) {
  }

  ngAfterViewInit() {
    this.exampleDatabase = new ItemService(this.httpClient);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // @ts-ignore
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          // Fetch
          return this.exampleDatabase.getAllSorted(
            this.sort.active, this.sort.direction, this.paginator.pageIndex, this.filter, this.pagination);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total;

          return data.data;
        }),
        catchError(error => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return error;
        })
      ).subscribe(data => this.data = data);
  }
  showItem(id) {
    this.router.navigateByUrl('/home/' + id);
  }
  // Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.filter !== filterValue.trim().toLowerCase()) {
      this.filter = filterValue.trim().toLowerCase();
      this.ngAfterViewInit();
    }
  }
}
