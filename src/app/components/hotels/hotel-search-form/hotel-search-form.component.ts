import { MainService } from './../../../services/main.service';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatDatepickerInputEvent, MatAutocompleteTrigger } from '@angular/material';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
declare var jQuery;

@Component({
  selector: 'app-hotel-search-form',
  templateUrl: './hotel-search-form.component.html',
  styleUrls: ['./hotel-search-form.component.css']
})
export class HotelSearchFormComponent implements OnInit {

  @Output() searchEvent = new EventEmitter<string>();
  @Input() sideForm: boolean;

  hotelSearch: FormGroup;
  adults: number = 1;
  children: number = 0;
  rooms: number = 1;
  currDate: Date = new Date();
  searchBtn: string = 'Search';
  destValu: string;
  dateRangeValue = "Check In  -  Check Out";

  // sideForm: boolean = false;

  hotelsAutocomplete = new FormControl();
  hotelsList: string[] = [];
  filteredList: Observable<string[]>;
  isLoading: boolean = true;

  cookieExists: boolean;
  searchQuery: object;

  hotelSearchResult:any;

  childrenAges: FormArray

  @Output()
  dateChange: EventEmitter<MatDatepickerInputEvent<Date>>
  @ViewChild(MatAutocompleteTrigger) _auto: MatAutocompleteTrigger;

  constructor(private __fb: FormBuilder, private __ms: MainService, private _date: DatePipe, private _router: Router,
  private _cookieService: CookieService) { 
   
   }

  ngOnInit() {
    jQuery('#date-range').dateRangePicker(
      {
        autoClose: true,
        format: 'dd DD MMM',
        separator : ' - ',
        startDate: new Date()
      }
    );
    // Hotel form
    this.hotelSearch = this.__fb.group({
      destination: ["",Validators.required],
      checkInDate: [""],
      checkOutDate: [""],
      dates: ["", Validators.required],
      dateRange: [""],
      rooms: ["1"],
      adults: ["1"],
      children: [""],
      childrenAges: this.__fb.array([ ])
    });

    // this.addChildrenAgeForm();

    
    // this.searchQuery = searchCookie;
    this.cookieExists = this._cookieService.check('hotelQuery');
    if(this.cookieExists == true){
      let searchCookie = this._cookieService.get('hotelQuery');
      let currentSearch = JSON.parse(searchCookie);
      // let options = this._auto.autocomplete.options.toArray()
    // this.myControl.setValue(options[1].value)
      this.hotelsAutocomplete.setValue(currentSearch.destination);
      this.hotelSearch.controls['checkInDate'].setValue(this._date.transform(currentSearch.checkInDate,'M/d/yy'));
      this.hotelSearch.controls['checkOutDate'].setValue(this._date.transform(currentSearch.checkOutDate,'M/d/yy'));
      this.hotelSearch.controls['dates'].setValue(currentSearch.dates);
      this.hotelSearch.controls['dateRange'].setValue(currentSearch.dateRange);
      this.hotelSearch.controls['rooms'].setValue(currentSearch.rooms);
      this.hotelSearch.controls['adults'].setValue(currentSearch.adults);
      this.hotelSearch.controls['children'].setValue(currentSearch.children);
      this.rooms = currentSearch.rooms;
      this.adults = currentSearch.adults;
      this.children = currentSearch.children;
      this.childrenAges = this.__fb.array([this.createChildForm(currentSearch.childrenAges,currentSearch.children)])
      this.destValu = currentSearch.destination;
      this.dateRangeValue = currentSearch.dateRange;
      // get search results
      this.hotelSearchResult = this.getSearchResults(currentSearch);
    }


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

  openDatePicker(){
    jQuery('#date-range').data('dateRangePicker').open();
  }

  datePickerValue(val){
    console.log('val', val)
  }

  createChildForm(formData,childrensCount) {
    let chd_arr = this.hotelSearch.controls.childrenAges as FormArray;
    for(let i = 0; i < childrensCount; i++){
      chd_arr.push(this.childAge(formData[i].childAge));
    }
  }

  childAge(formData): FormGroup {
    if(formData != null){
      return this.__fb.group({
        childAge: [formData]
      });
    }
    
  }

  addChild(): void {
    this.childrenAges = this.hotelSearch.controls.childrenAges as FormArray;
    this.childrenAges.push(this.childAge(''));
  }

  removeChild(index): void {
    this.childrenAges = this.hotelSearch.get('childrenAges') as FormArray;
    this.childrenAges.removeAt(index);
  }

  // addChildrenAgeForm = () => {
  //   if(this.children > 0){
  //     this.hotelSearch.addControl('childrenAges',this.__fb.array([]));
  //   }
  // }

  private _filter(value: string): string[] {
    if(value.length > 2) {
      const filterValue = value.toLowerCase();
      return this.hotelsList.filter(option => option.toLowerCase().includes(filterValue));
    } 
  }

  incrementNumbers(type) {
    switch (type) {
      case 'adults': {
        this.adults = +this.adults + 1;
        this.hotelSearch.controls['adults'].setValue(this.adults);
        break;
      }
      case 'children': {
        this.children = +this.children + 1;
        this.hotelSearch.controls['children'].setValue(this.children);
        // this.addChildrenAgeForm();
        this.addChild();
        break;
      }
      case 'rooms': {
        this.rooms = +this.rooms + 1;
        this.hotelSearch.controls['rooms'].setValue(this.rooms);
        break;
      }
    }
  }

  decrementNumbers(type) {
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
        // this.addChildrenAgeForm(); 
        if(this.children > 0){
          this.removeChild(0);
        }
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
    console.log('forminputs',formInputs);
    console.log(typeof jQuery('#date-range').val())
    let date1 = new Date(jQuery('#date-range').val().split('-')[0]);
    let date2 = new Date(jQuery('#date-range').val().split('-')[1]);
    // return;
    if(this.hotelSearch.valid){
      let formObj = {
        destination: formInputs.destination,
        checkInDate: this._date.transform(date1,'M/d/yy'),
        checkOutDate: this._date.transform(date2,'M/d/yy'),
        dates: formInputs.dates,
        dateRange: jQuery('#date-range').val(),
        rooms: formInputs.rooms,
        adults: formInputs.adults,
        children: formInputs.children,
        childrenAges: formInputs.childrenAges
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
