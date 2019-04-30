import { MainService } from './../../../services/main.service';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-hotel-search-form',
  templateUrl: './hotel-search-form.component.html',
  styleUrls: ['./hotel-search-form.component.css']
})
export class HotelSearchFormComponent implements OnInit {

  @Output() searchEvent = new EventEmitter<string>();

  hotelSearch: FormGroup;
  adults: number = 1;
  children: number = 0;
  rooms: number = 1;
  currDate: Date = new Date();
  searchBtn: string = 'Search';
  destValu: string;

  hotelsAutocomplete = new FormControl();
  hotelsList: string[] = [];
  filteredList: Observable<string[]>;
  isLoading: boolean = true;

  cookieExists: boolean;
  searchQuery: object;

  hotelSearchResult:any;

  @Output()
  dateChange: EventEmitter<MatDatepickerInputEvent<Date>>

  constructor(private __fb: FormBuilder, private __ms: MainService, private _date: DatePipe, private _router: Router,
  private _cookieService: CookieService) { 
   
   }

  ngOnInit() {
    // Hotel form
    this.hotelSearch = this.__fb.group({
      destination: [""],
      checkInDate: [""],
      checkOutDate: [""],
      dates: [""],
      rooms: ["1"],
      adults: ["1"],
      children: []
    });

    let searchCookie = this._cookieService.get('hotelQuery');
    let currentSearch = JSON.parse(searchCookie);
    // this.searchQuery = searchCookie;
    this.cookieExists = this._cookieService.check('hotelQuery');
    if(this.cookieExists == true){
      this.hotelSearch.setValue({
        destination: currentSearch.destination,
        checkInDate: this._date.transform(currentSearch.dates.startDate,'M/d/yy'),
        checkOutDate: this._date.transform(currentSearch.dates.endDate,'M/d/yy'),
        dates: currentSearch.dates,
        rooms: currentSearch.rooms,
        adults: currentSearch.adults,
        children: currentSearch.children
      });
      this.rooms = currentSearch.rooms;
      this.adults = currentSearch.adults;
      this.children = currentSearch.children;
      // this.selectedDestination();
      this.destValu = currentSearch.destination;
      // this.searchBtn = 'Search';
    }

    // get search results
    this.hotelSearchResult = this.getSearchResults(currentSearch);

    // get hotels list
    this.__ms.getLIst('http://cheapfly.pk/rgtapp/index.php/services/HotelQuery/getHotels').subscribe(data => {
     this.hotelsList = data;
     this.isLoading = false;
    })

    this.filteredList = this.hotelsAutocomplete.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

  } // onInit

  public selectedDestination = () => {
    return 'test destination'
  }

  private _filter(value: string): string[] {
    if(value.length > 2) {
      const filterValue = value.toLowerCase();
      return this.hotelsList.filter(option => option.toLowerCase().includes(filterValue));
    } 
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

  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }

  keytab(event){
    let element = event.targetElement.nextElementSibling; // get the sibling element

    if(element == null){  // check if its null
        return;
    } else
        element.focus();   // focus if not null
  }
  
  public getSearchResults = (obj) => {
    this.searchBtn = 'Loading';
    this.__ms.postData('http://cheapfly.pk/rgtapp/index.php/services/HotelQuery/search',obj).subscribe(result => {
      this.hotelSearchResult = result;
      this.searchEvent.emit(this.hotelSearchResult);
      this.searchBtn = 'Search';
    })
  }

  searchHotels(formInputs){
    
    if(this.hotelSearch.valid){
      let formObj = {
        destination: formInputs.destination,
        checkInDate: this._date.transform(formInputs.dates.startDate._d,'M/d/yy'),
        checkOutDate: this._date.transform(formInputs.dates.endDate._d,'M/d/yy'),
        dates: formInputs.dates,
        rooms: formInputs.rooms,
        adults: formInputs.adults,
        children: formInputs.children
      }
      this._cookieService.set('hotelQuery', JSON.stringify(formObj));
      // get search results
      this.getSearchResults(formObj);
      if(this._router.url !== '/hotels-listing'){
        this._router.navigate(['/hotels-listing']);
      }
    } else {
      console.log('form invalid!')
    }
  }

} //
