import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {catchError, first, map, startWith, switchMap} from 'rxjs/operators';
import {Item} from '../../_models/Item';
import {ItemService} from '../../_services/item.service';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {MatPaginator, MatSort} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {merge} from 'rxjs';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements AfterViewInit {
  columnsToDisplay = ['id', 'name', 'description', 'action'];
  data;
  exampleDatabase: ItemService;
  filter = '';
  loading = false;
  error = '';
  success = '';
  pagination = 10;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private itemService: ItemService,
              private router: Router,
              private httpClient: HttpClient) { }

  ngAfterViewInit() {
    this.exampleDatabase = new ItemService(this.httpClient);
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.filter !== filterValue.trim().toLowerCase()) {
      this.filter = filterValue.trim().toLowerCase();
      this.ngAfterViewInit();
    }
  }
  addItem() {
    this.router.navigateByUrl('/admin/item');
  }
  deleteItem(id) {
    this.itemService.deleteItem(id).pipe(first())
      .subscribe(result => {
          if (result.success) {
            this.success = result.success;
            this.error = '';
            this.loading = false;
            this.ngAfterViewInit();
          } else {
            this.loading = false;
          }
        },
        error => {
          this.error = error;
          this.success = '';
          this.loading = false;
        });
  }

}


