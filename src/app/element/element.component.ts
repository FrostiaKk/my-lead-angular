import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ItemService} from '../_services/item.service';

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.css']
})
export class ElementComponent implements OnInit {
  id = '';
  description = '';
  name = '';
  img = '';
  loading = false;
  error = '';
  prices = '';
  priceText = 'Price';
  constructor(private router: Router,
              private route: ActivatedRoute,
              private itemService: ItemService) { }

  ngOnInit() {
    // Get element id.
    this.id = this.route.snapshot.params.id;
    if (this.id) {
      this.loading = true;
      // Fetch element with id.
      this.itemService.getById(this.id).pipe(first())
        .subscribe(result => {
            if (result.success) {
              this.description = result.item.description;
              this.name = result.item.name;
              this.img = result.item.file.path;
              for (const price of result.item.prices) {
                if (this.prices !== '') {
                  this.prices += ', ';
                }
                this.prices += price.amount;
              }
              if (result.item.prices.length > 1) {
                this.priceText = 'Prices';
              }
              this.loading = false;
            } else {
              this.error = 'Failed to load item';
              this.loading = false;
            }
          },
          error => {
            this.error = error;
            this.loading = false;
          });
    }
  }
  return() {
    this.router.navigateByUrl('/home');
  }

}
