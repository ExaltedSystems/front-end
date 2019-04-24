import { MainService } from './../../../services/main.service';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-hotel-search-form',
  templateUrl: './hotel-search-form.component.html',
  styleUrls: ['./hotel-search-form.component.css']
})
export class HotelSearchFormComponent implements OnInit {

  hotelSearch: FormGroup;
  adults: number = 1;
  children: number = 0;
  rooms: number = 1;
  currDate: Date = new Date();

  hotelsAutocomplete = new FormControl();
  hotelsList: string[] = ['One', 'Two', 'Three'];
  filteredList: Observable<string[]>;

  @Output()
  dateChange: EventEmitter<MatDatepickerInputEvent<Date>>

  constructor(private __fb: FormBuilder, private __ms: MainService) { }

  ngOnInit() {
    // Hotel form
    this.hotelSearch = this.__fb.group({
      destination: ["destination"],
      checkInDate: ["checkInDate"],
      checkOutDate: ["checkOutDate"],
      dates: ["dates"],
      rooms: [],
      adults: ["1"],
      children: []
    });

    this.filteredList = this.hotelsAutocomplete.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

  } // onInit

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.hotelsList.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  incrementNumber(type) {
    switch (type) {
      case 'adults': {
        this.adults = +this.adults + 1;
        this.hotelSearch.controls['adults'].setValue(this.adults);
        break;
      }
      case 'children': {
        this.children = +this.children + 1;
        this.hotelSearch.controls['children'].setValue(this.children);
        break;
      }
      case 'rooms': {
        this.rooms = +this.rooms + 1;
        this.hotelSearch.controls['rooms'].setValue(this.rooms);
        break;
      }
    }
  }

  decrementNumber(type) {
    switch (type) {
      case 'adults': {
        this.adults--;
        this.adults < 1 ? this.adults = 1 : this.adults;
        this.hotelSearch.controls['adults'].setValue(this.adults);
        break;
      }
      case 'children': {
        this.children--;
        this.children < 0 ? this.children = 0 : this.children;
        this.hotelSearch.controls['children'].setValue(this.children);
        break;
      }
      case 'rooms': {
        this.rooms--;
        this.rooms < 1 ? this.rooms = 1 : this.rooms;
        this.hotelSearch.controls['rooms'].setValue(this.rooms);
        break;
      }
    }
  }

  keytab(event){
    let element = event.targetElement.nextElementSibling; // get the sibling element

    if(element == null){  // check if its null
        return;
    } else
        element.focus();   // focus if not null
    }

  searchHotels(formInputs){
    if(this.hotelSearch.valid){
      console.log(formInputs)
    } else {
      console.log('form invalid!')
    }
  }

} //
