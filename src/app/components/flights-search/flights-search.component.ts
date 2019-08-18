import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MainService } from './../../services/main.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDatepicker, MatAutocomplete, MatInput, MatSelect, MatRadioButton, MatAutocompleteTrigger, MatOptionSelectionChange, MatDatepickerInputEvent, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { map, startWith } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import allAirlinesList from '../../../assets/js/locations.json';
import { isObject } from 'util';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/date.adapter';
declare var jQuery;

@Component({
	selector: 'app-flights-search',
	templateUrl: './flights-search.component.html',
	styleUrls: ['./flights-search.component.css'],
	providers: [
		{
			provide: DateAdapter, useClass: AppDateAdapter
		},
		{
			provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
		}
	]
})
export class FlightsSearchComponent implements OnInit {

	@Input() sideForm: boolean;
	@ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
	@ViewChild(MatAutocompleteTrigger) _auto: MatAutocompleteTrigger;
	flightSearch: FormGroup;

	flightType: string = "Return";
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
		{ value: "F", label: "First" }
	];
	frmObj: any;
	cookieObj;
	// For Autocomplete with Arrow Keys and Enter Key Selection
	filteredFlyingFromList: Observable<string[]>;
	flyingFromAutocomplete = new FormControl();
	flyingFromLists: string[] = [];
	filteredFlyingToList: Observable<string[]>;
	flyingToAutocomplete = new FormControl();
	flyingToLists: string[] = [];


	constructor(private __fb: FormBuilder, private __ms: MainService, private __router: Router, private __activated: ActivatedRoute,
		private __cookieService: CookieService) {
		this.flyingFromLists = allAirlinesList;
		this.flyingToLists = allAirlinesList;
	}

	ngOnInit() {
		if (this.__cookieService.get('srchCookies')) {
			let cookiesData = JSON.parse(this.__cookieService.get('srchCookies'))
			this.flightType = cookiesData[0].value;
			if (cookiesData[0].value == 'OneWay') { this.isReturn = false; }
			this.flyingFrom = cookiesData[1].value;
			this.flyingTo = cookiesData[2].value;
			this.departureDate = cookiesData[3].value;
			this.returnDate = cookiesData[4].value;
			this.adults = cookiesData[5].value;
			this.children = cookiesData[6].value;
			this.infant = cookiesData[7].value;
			this.preferredClass = cookiesData[8].value;
			this.preferredAirline = cookiesData[9].value;
		}
		this.flightSearch = this.__fb.group({
			flightType: [this.flightType],
			flyingFrom: ["", Validators.required],
			flyingTo: ["", Validators.required],
			departureDate: ["", Validators.required],
			returnDate: ["", ""],
			preferredClass: [],
			PreferredAirline: [],
			adults: ["1", Validators.required],
			children: [],
			infant: [],
			clientPhone: ['', [Validators.minLength(9), Validators.maxLength(20)]]
		});
		let pageUrl = this.__router.url.substr(1);
		if (pageUrl.split('/')[0] == 'airlines') {
			this.flightSearch.controls['clientPhone'].setValidators(Validators.required);
			this.flightSearch.updateValueAndValidity();
		}
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
		// Filter Flying From / To
		this.flyingFromAutocomplete.setValue(this.flyingFrom)
		this.flyingToAutocomplete.setValue(this.flyingTo)
		this.filteredFlyingFromList = this.flyingFromAutocomplete.valueChanges.pipe(
			startWith(''),
			map(value => this.__filterFlyFromAutocomplete(value))
		);
		this.filteredFlyingToList = this.flyingToAutocomplete.valueChanges.pipe(
			startWith(''),
			map(value => this.__filterFlyToAutocomplete(value))
		);
	}
	private __filterFlyFromAutocomplete(value: string): string[] {
		if (value.length > 2) {
			const filterValue = value.toLowerCase();
			let filteredVal = this.flyingFromLists.filter(option => option.toLowerCase().includes(filterValue));
			// this.flightSearch.controls['flyingFrom'].setValue(filteredVal[0]);
			return filteredVal;
		}
	}
	private __filterFlyToAutocomplete(value: string): string[] {
		if (value.length > 2) {
			const filterValue = value.toLowerCase();
			let filteredVal = this.flyingToLists.filter(option => option.toLowerCase().includes(filterValue));
			// this.flightSearch.controls['flyingTo'].setValue(filteredVal[0]);
			return filteredVal;
		}
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
			map(sectors => this.__ms.__filterFlyFrom(sectors, ev.target.value)));
	}
	__filterFlyFrom(sectors, val) {
		if (val.length > 3) {
			return sectors.filter(sector => sector.toLowerCase().indexOf(val.toLowerCase()) != -1);
		} else {
			return sectors.filter(sector => sector.substring(0, 3).toLowerCase().indexOf(val.toLowerCase()) != -1);
		}
	}
	filterFlyingTo(ev) {
		this.flyToSectors = this.__ms.getJsonData('../../assets/js/locations.json')
			.pipe(map(sectors => this.__filterFlyTo(sectors, ev.target.value)));
	}
	__filterFlyTo(sectors, val) {
		if (val.length > 3) {
			return sectors.filter(sector => sector.toLowerCase().indexOf(val.toLowerCase()) != -1)
		} else {
			return sectors.filter(sector => sector.substring(0, 3).toLowerCase().indexOf(val.toLowerCase()) != -1)
		}
	}

	filterAirlines(ev) {
		this.airlinesAuto = this.__ms.getJsonData('../../assets/js/airlines.json').pipe(
			map(airlines => this.__filterAirlines(airlines, ev.target.value)),
		);
	}
	__filterAirlines(airlines, val) {
		if (val.length > 3) {
			return airlines.filter(airline => airline.toLowerCase().indexOf(val) != -1)
		} else {
			return airlines.filter(airline => airline.substring(0, 3).toLowerCase().indexOf(val) != -1)
		}
	}

	incrementNumber(type) {
		this.passengerError = '';
		
		let totalPax = (+this.adults + +this.children);
		// If Number of Infant is greater than Number of Adults
		if((+this.infant + 1) > this.adults && type == 'infant'){
		  this.passengerError = 'Number of Infant must be Equal to number of Adult';
		  return false;
		}
		// If Total Number of Adult and Children is greater than 6
		if(totalPax >= 6 && (type == 'adults' || type == 'children')) {
		  this.passengerError = 'Maximum # of passenger is 6';
		  return false;
		}
		let totalPaxWdInfant = (totalPax + (+this.infant + 1));
		console.log('TotalPxWdInfnt:', [totalPax, this.infant, totalPaxWdInfant])
		// If Total Number of Passengers (Adult, Children and Infant) is greater than 9
		if (totalPaxWdInfant > 9) {
		  this.passengerError = 'Please Select Upto 9 Passengers!';
		  return false;
		}
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
		// this.passengerError = '';
		// if (this.adults + +this.children + +this.infant > 40) {
		// 	this.passengerError = 'Please Select Upto 9 Passengers!';
		// 	return false;
		// }
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
			this.cookieObj = [
				{ name: 'flightType', value: flightType },
				{ name: 'flyingFrom', value: formInputs.flyingFrom },
				{ name: 'flyingTo', value: formInputs.flyingTo },
				{ name: 'departureDate', value: formInputs.departureDate },
				{ name: 'returnDate', value: formInputs.returnDate },
				{ name: 'adults', value: formInputs.adults },
				{ name: 'children', value: formInputs.children },
				{ name: 'infant', value: formInputs.infant },
				{ name: 'preferredClass', value: formInputs.preferredClass },
				{ name: 'prefAirline', value: formInputs.prefAirline }
			]
			this.__cookieService.set('srchCookies', JSON.stringify(this.cookieObj));
			let pageUrl = this.__router.url.substr(1);
			if(pageUrl.indexOf('flights-listing') > -1){
				pageUrl = 'flights-listing';
			}
			this.__router.navigate(["/flights-listing"], {
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
					prefAirline: prefAirline,
					clientPhone: formInputs.clientPhone,
					pageUrl: pageUrl
				}
			});
		}
	}

	closeDropDown(ev) {
		jQuery(ev.path[2]).removeClass('show');
		jQuery(ev.path[3]).removeClass('show');
	}
	resetMatInput(evt) {
		let attrName = evt.target.getAttribute('formControlName');
		this.flightSearch.controls[attrName].setValue('');
		if (attrName == 'flyingFrom') {
			this.flyingFromAutocomplete.setValue('');
		}
		if (attrName == 'flyingTo') {
			this.flyingToAutocomplete.setValue('');
		}
	}
	setSelectedValue(evt: MatOptionSelectionChange, attrName: string) {
		let val = evt.source.value;
		if (attrName == 'flyingFrom') {
			this.flightSearch.controls['flyingFrom'].setValue(val);
			this.flyingFromAutocomplete.setValue(val);
		}
		if (attrName == 'flyingTo') {
			this.flightSearch.controls['flyingTo'].setValue(val);
			this.flyingToAutocomplete.setValue(val);
		}
	}
	setDatepickerTitle(evt) {
		let placeHolder = '';
		if (isObject(evt)) {
			placeHolder = evt.target.getAttribute('placeholder');
		} else {
			placeHolder = evt;
		}
		window.setTimeout(() => {
			if (jQuery('.mat-calendar-header').find("h4").length == 0) {
				jQuery('.mat-calendar-header').prepend('<h4 class="center font-weight-bold text-danger">' + placeHolder + '</h3>');
			}
		}, 300);
	}
	setReturnDate(event: MatDatepickerInputEvent<Date>) {
		this.flightSearch.get('returnDate').setValue(this.addDays(3, event.target.value));
	}

}
