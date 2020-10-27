import { Component, OnInit, Input } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthServiceService} from '../../_services/auth-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {first, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {baseUrl} from '../../../environments/environment';
import {User} from '../../_models/user';
import {ItemService} from '../../_services/item.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';

export interface Price {
  name: string;
}

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  itemForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: '/admin/items';
  error = '';
  success = '';
  selectable = true;
  removable = true;
  addOnBlur = true;
  fileImg = '';
  fileName = '';
  id = '';
  title = 'Add item';
  buttonText = 'Add';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  prices: Price[] = [];
  constructor(private authService: AuthServiceService,
              private router: Router,
              private route: ActivatedRoute,
              private itemService: ItemService,
              public fb: FormBuilder) {
    this.itemForm = this.fb.group({
      name: [''],
      price: [''],
      description: [''],
      file: [null]
  }); }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    // Check if Edit or Add. File can't be required in update form.
    if (this.id) {
      this.itemService.getById(this.id).pipe(first())
        .subscribe(result => {
            if (result.success) {
              this.itemForm = new FormGroup({
                name : new FormControl(null, [Validators.required]),
                description : new FormControl(null, [Validators.required]),
                price : new FormControl(null),
                file : new FormControl(null)
              });
              this.itemForm.patchValue({
                name: result.item.name,
                description: result.item.description,
              });
              for (const price of result.item.prices) {
                this.prices.push({name: price.amount});
              }
              this.fileImg = result.item.file.thumbnail;
              this.title = 'Edit item - ' + result.item.name;
              this.buttonText = 'Save changes';
              this.itemForm.get('name').updateValueAndValidity();
              this.itemForm.get('description').updateValueAndValidity();
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
    } else {
      this.itemForm = new FormGroup({
        name : new FormControl(null, [Validators.required]),
        description : new FormControl(null, [Validators.required]),
        price : new FormControl(null, [Validators.required]),
        file : new FormControl(null, [Validators.required])
      });
    }
  }
  // Add chosen file to form.
  uploadFile(event) {
    const filee = (event.target as HTMLInputElement).files[0];
    this.fileName = filee.name;
    this.fileImg = '';
    this.itemForm.patchValue({
      file: filee
    });
    this.itemForm.get('file').updateValueAndValidity();
  }
  itemProcess() {
    this.error = '';
    this.submitted = true;

    let priceString = '';
    for (const price of this.prices) {
      priceString = this.stringAdd(priceString, price.name, ';');
    }
    this.itemForm.value.price = priceString;
    // stop here if form is invalid
    if (this.itemForm.invalid) {
      return;
    }
    this.loading = true;
    // Copy data from formGroup to formData to pass file.
    const formData = new FormData();
    formData.append('name', this.itemForm.value.name);
    formData.append('description', this.itemForm.value.description);
    formData.append('price', this.itemForm.value.price);
    // Choose sending method for Add/Update
    if (this.id) {
      formData.append('_method', 'PUT');
      if (this.fileName) {
        formData.append('file', this.itemForm.value.file, this.itemForm.value.file.name);
      }
      if (this.itemForm.valid) {
        this.itemService.updateItem(formData, this.id).pipe(first())
          .subscribe(result => {
              if (result.success) {
                this.success = result.success;
                this.error = '';
                this.loading = false;
              } else {
                this.error = this.stringAdd(this.error, result.error.price, ', ');
                this.error = this.stringAdd(this.error, result.error.name, ', ');
                this.error = this.stringAdd(this.error, result.error.description, ', ');
                this.error = this.stringAdd(this.error, result.error.file, ', ');
                this.loading = false;
              }
            },
            error => {
              this.error = error;
              this.success = '';
              this.loading = false;
            });
      }
    } else {
      formData.append('file', this.itemForm.value.file, this.itemForm.value.file.name);
      if (this.itemForm.valid) {
        this.itemService.storeItem(formData).pipe(first())
          .subscribe(result => {
              if (result.success) {
                this.success = result.success;
                this.loading = false;
                this.router.navigate(['admin/items']);
              } else {
                this.error = this.stringAdd(this.error, result.error.price, ', ');
                this.error = this.stringAdd(this.error, result.error.name, ', ');
                this.error = this.stringAdd(this.error, result.error.description, ', ');
                this.error = this.stringAdd(this.error, result.error.file, ', ');
                this.loading = false;
              }
            },
            error => {
              this.error = error;
              this.loading = false;
            });
      }
    }

  }
  return() {
    this.router.navigateByUrl('/admin/items');
  }
  // Function to make string out of errors
  stringAdd(line, element, breaker) {
    if (element) {
      if (line === '') {
        line += element;
      } else {
        line += breaker + element;
      }
    }
    return line;
  }
  get name() { return this.itemForm.get('name'); }
  get description() { return this.itemForm.get('description'); }
  get file() { return this.itemForm.get('file'); }
  get price() { return this.itemForm.get('price'); }
  // Listen to newly added prices
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add price
    if ((value || '').trim()) {
      this.prices.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  // Remove price
  remove(price: Price): void {
    const index = this.prices.indexOf(price);

    if (index >= 0) {
      this.prices.splice(index, 1);
    }
  }

}
