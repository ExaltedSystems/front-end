import { MainService } from './../../services/main.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker, MatAutocomplete, MatInput, MatSelect, MatRadioButton } from '@angular/material';
import { map } from 'rxjs/operators';

import { startWith } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Meta, Title } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';
// import { Route } from '@angular/compiler/src/core';
// import * as airportLocations from '../../../assets/js/locations.json';
declare var jQuery;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input()
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
  flightSearch: FormGroup;
  hotelSearch: FormGroup;
  flightType: string;
  flyingFrom: string = 'ISB,Islamabad,Pakistan';
  flyingTo: string = 'LHR,London,United Kingdom';
  departureDate;
  returnDate;
  adults: number = 1;
  children: number = 0;
  infant: number = 0;
  rooms: number = 1;
  preferredClass = 'Y';
  preferredAirline;
  selectedFlyFrom = 'ISB,Islamabad,Pakistan';
  selectedFlyTo = 'LHR,London,United Kingdom';
  currDate: Date = new Date();
  passengerError: string;
  numRoomsError: string;
  airlineSectors: any;
  flyToSectors: any;
  airlinesAuto: any;
  isReturn: boolean = true;
  preferredClasses: object = [
    { value: "Y", label: "Economy" },
    { value: "S", label: "Economy Premium" },
    { value: "C", label: "Business" },
    { value: "F", label: "First" }];
  frmObj: any;
  cookieObj;
  popularDeals : any;
  popularVisa : any;
  baseUrl : any;
  isMobile:boolean;

  constructor(private __fb: FormBuilder, private __ms: MainService, private __router: Router, private __meta:Meta, 
    private __activated: ActivatedRoute, private __cookieService: CookieService, private __device: DeviceDetectorService) {
      this.__meta.updateTag({property:"og:url", content: window.location.href}); 
    }

  ngOnInit() {
    this.isMobile = this.__device.isMobile();
    
    //this.__ms.getJSON('../../assets/js/locations.json').subscribe(res => {
    //this.airlineSectors = res;
    //});
    // this.airlineSectors = airportLocations;
    // this.airlineSectors.map(items => items);
    // let __isReturn = this.isReturn ? Validators.required : '';
    // this.adults = this.__cookieService.get('adtQty') ? Number(this.__cookieService.get('adtQty')) : 1;
    // this.children = this.__cookieService.get('cnnQty') ? Number(this.__cookieService.get('cnnQty')) : 0;
    // this.infant = this.__cookieService.get('infQty') ? Number(this.__cookieService.get('infQty')) : 0;
    // console.log(this.adults)
    
    if(this.__cookieService.get('srchCookies')){
      let cookiesData       = JSON.parse(this.__cookieService.get('srchCookies'))
      this.flightType       = cookiesData[0].value;
      this.flyingFrom       = cookiesData[1].value;
      this.flyingTo         = cookiesData[2].value;
      this.departureDate    = cookiesData[3].value;
      this.returnDate       = cookiesData[4].value;
      this.adults           = cookiesData[5].value;
      this.children         = cookiesData[6].value;
      this.infant           = cookiesData[7].value;
      this.preferredClass   = cookiesData[8].value;
      this.preferredAirline = cookiesData[9].value;
    }

    this.flightSearch = this.__fb.group({
      flightType: ["Return"],
      flyingFrom: ["", Validators.required],
      flyingTo: ["", Validators.required],
      departureDate: ["", Validators.required],
      returnDate: ["", Validators.required],
      preferredClass: [],
      PreferredAirline: [],
      adults: ["1", Validators.required],
      children: [],
      infant: []
    });

    // Hotel form
    this.hotelSearch = this.__fb.group({
      destination: ["destination"],
      checkInDate: ["checkInDate"],
      checkOutDate: ["checkOutDate"],
      rooms: [],
      adults: ["1"],
      children: []
    })
    
    this.flightSearch.controls['flyingFrom'].setValue(this.flyingFrom);

    this.flightSearch.controls['flyingTo'].setValue(this.flyingTo);
    this.flightSearch.controls['departureDate'].setValue(this.departureDate != null ? this.departureDate : this.addDays(3));
    let defaultRtnDate;
    if (this.returnDate) {
      defaultRtnDate = this.returnDate;
    } else {
      if (this.departureDate) {
        defaultRtnDate = this.addDays(7, this.departureDate);
      } else {
        defaultRtnDate = this.addDays(7);
      }
    }
    this.flightSearch.controls['returnDate'].setValue(defaultRtnDate);

    this.flightSearch.controls['preferredClass'].setValue(this.preferredClass);
    this.getPopularDeals();
    this.popularVisas();
  }

  addDays = function (days, dptDate?) {
    let date = new Date();
    if (dptDate) {
      date = new Date(dptDate);
    }
    date.setDate(date.getDate() + days);
    return date;
  }

  filterFlyingFrom(ev) {
    this.airlineSectors = this.__ms.locationsJson().pipe(
      map(sectors => this.__ms.__filterFlyFrom(sectors, ev.target.value)),
    );
    // this.airlineSectors = this.__ms.getAirPorts_v1().pipe(
    //   map(sectors => this.__ms.__filterFlyFrom(sectors, ev.target.value)),
    // )
  }
  __filterFlyFrom(sectors, val) {
    if (val.length > 3) {
      return sectors.filter(sector => sector.toLowerCase().indexOf(val.toLowerCase()) != -1)
    } else {
      return sectors.filter(sector => sector.substring(0, 3).toLowerCase().indexOf(val.toLowerCase()) != -1)
    }
  }
  filterFlyingTo(ev) {
    this.flyToSectors = this.__ms.locationsJson()
      .pipe(
        map(sectors => this.__filterFlyTo(sectors, ev.target.value)),
      )
  }
  __filterFlyTo(sectors, val) {
    if (val.length > 3) {
      return sectors.filter(sector => sector.toLowerCase().indexOf(val.toLowerCase()) != -1)
    } else {
      return sectors.filter(sector => sector.substring(0, 3).toLowerCase().indexOf(val.toLowerCase()) != -1)
    }
  }

  filterAirlines(ev) {
    this.airlinesAuto = this.__ms.getJsonData('../../assets/js/airlines.json')
      .pipe(
        map(airlines => this.__filterAirlines(airlines, ev.target.value)),
      )
  }
  __filterAirlines(airlines, val) {
    if (val.length > 3) {
      return airlines.filter(airline => airline.toLowerCase().indexOf(val) != -1)
    } else {
      return airlines.filter(airline => airline.substring(0, 3).toLowerCase().indexOf(val) != -1)
    }
  }

  //filterFlyingFrom(evt) {
  //let value = evt.target.value;
  //console.log('Value:', value)
  //const filterValue = value.toLowerCase();
  ////return this.airlineSectors.filter(sector => sector.substring(0,3).toLowerCase().indexOf(filterValue) === 0);
  //return this.airlineSectors.filter(sector => sector.substring(0,3).toLowerCase().includes(this.flyingFrom));
  //}

  incrementNumber(type) {
    this.passengerError = '';
    switch (type) {
      case 'adults': {
        this.adults = +this.adults + 1;
        this.flightSearch.controls['adults'].setValue(this.adults);
        break;
      }
      case 'children': {
        this.children = +this.children + 1;
        this.flightSearch.controls['children'].setValue(this.children);
        break;
      }
      case 'infant': {
        this.infant = +this.infant + 1;
        this.flightSearch.controls['infant'].setValue(this.infant);
        break;
      }
    }
    this.passengerError = '';
    if (this.adults + +this.children + +this.infant > 40) {
      this.passengerError = 'Please Select Upto 9 Passengers!';
      return false;
    }
  }

  decrementNumber(type) {
    switch (type) {
      case 'adults': {
        this.adults--;
        this.adults < 1 ? this.adults = 1 : this.adults;
        this.flightSearch.controls['adults'].setValue(this.adults);
        break;
      }
      case 'children': {
        this.children--;
        this.children < 0 ? this.children = 0 : this.children;
        this.flightSearch.controls['children'].setValue(this.children);
        break;
      }
      case 'infant': {
        this.infant--;
        this.infant < 0 ? this.infant = 0 : this.infant;
        this.flightSearch.controls['infant'].setValue(this.infant);
        break;
      }
    }

    // jQuery('#flightPaxDropdownMenu').toggle();
    this.passengerError = '';
    if (this.adults + +this.children + +this.infant <= 0) {
      this.passengerError = 'Please Select atleast 1 Passenger!';
      return false;
    }
  }

  setFlightType(ev: any) {
    if (ev.value == 'OneWay') {
      this.isReturn = false;
      if (!this.flightSearch.get('returnDate').value) {
        this.flightSearch.get('returnDate').setValue(this.addDays(7, this.flightSearch.get('departureDate').value));
      }

    } else {
      this.isReturn = true;
    }
  }

  searchFlights(formInputs) {
    if (this.flightSearch.valid) {
      formInputs.departureDate = this.__ms.setDateFormat(formInputs.departureDate);
      formInputs.returnDate = this.__ms.setDateFormat(formInputs.returnDate);

      localStorage.setItem('oLocation', formInputs.flyingFrom);
      localStorage.setItem('dLocation', formInputs.flyingTo);

      let flightType = formInputs.flightType;

      this.__cookieService.set('flightType', formInputs.flightType);
      this.__cookieService.set('flyingFrom', formInputs.flyingFrom);
      this.__cookieService.set('flyingTo', formInputs.flyingTo);
      this.__cookieService.set('departureDate', formInputs.departureDate);
      if (flightType == 'Return') {
        this.__cookieService.set('returnDate', formInputs.returnDate);
      }
      this.__cookieService.set('preferredClass', formInputs.preferredClass);

      let dptDate = formInputs.departureDate;
      let oLocation = (formInputs.flyingFrom).split(',')[0];
      let dLocation = (formInputs.flyingTo).split(',')[0];
      let cabin = formInputs.preferredClass != null ? formInputs.preferredClass : 'Y';
      let prefAirline: any = formInputs.PreferredAirline != null ? formInputs.PreferredAirline.slice(0, 2) : 0;
      let adtQty = formInputs.adults;
      let cnnQty: number = formInputs.children == null ? 0 : formInputs.children;
      let infQty: number = formInputs.infant == null ? 0 : formInputs.infant;

      this.__cookieService.set('adtQty', adtQty);
      this.__cookieService.set('cnnQty', String(cnnQty));
      this.__cookieService.set('infQty', String(infQty));
      
      this.cookieObj = [{ name: 'flightType', value: flightType },{ name: 'flyingFrom', value: formInputs.flyingFrom },{ name: 'flyingTo', value: formInputs.flyingTo },{ name: 'departureDate', value: formInputs.departureDate },{ name: 'returnDate', value: formInputs.returnDate },{ name: 'adults', value: formInputs.adults },{ name: 'children', value: formInputs.children },{ name: 'infant', value: formInputs.infant },{ name: 'preferredClass', value: formInputs.preferredClass },{ name: 'prefAirline', value: 
      formInputs.prefAirline }]

      this.__cookieService.set('srchCookies', JSON.stringify(this.cookieObj));
      

      this.__router.navigate(["/flights-listing"], {
        // relativeTo: this.__route,
        queryParams: {
          _flight_type: flightType,
          _flying_from: oLocation,
          _flying_to: dLocation,
          _departure_date: dptDate,
          _return_date: formInputs.returnDate,
          adults: adtQty,
          children: cnnQty,
          infant: infQty,
          cabin: cabin,
          prefAirline: prefAirline
        }
      });
      // return false;      
    }

  }

  closeDropDown(ev) {
    // console.log(ev.path[2]);
    jQuery(ev.path[2]).removeClass('show')
    jQuery(ev.path[3]).removeClass('show')

  }
  getPopularDeals(){
    this.baseUrl = this.__ms.baseUrl;
    this.__ms.getData(this.__ms.backEndUrl+'Cms/popularDeals/').subscribe(res => {
      this.popularDeals = res.data;
    });
  }
  popularVisas(){
    this.baseUrl = this.__ms.baseUrl;
    this.__ms.getData(this.__ms.backEndUrl+'Cms/popularVisaRecords/').subscribe(res => {
      this.popularVisa = res.data;
    });
  }
}