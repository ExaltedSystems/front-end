import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MainService } from './../../services/main.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker, MatAutocomplete, MatInput, MatSelect, MatRadioButton } from '@angular/material';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
declare var jQuery;

@Component({
  selector: 'app-flights-search',
  templateUrl: './flights-search.component.html',
  styleUrls: ['./flights-search.component.css']
})
export class FlightsSearchComponent implements OnInit {

	@Input()
	@ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
	flightSearch: FormGroup;

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
		{ value: "F", label: "First" }
	];
	frmObj: any;
	cookieObj;
	constructor(private __fb: FormBuilder, private __ms: MainService, private __router: Router, private __activated: ActivatedRoute, 
    private __cookieService: CookieService) { }

	ngOnInit() {
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
		map(sectors => this.__ms.__filterFlyFrom(sectors, ev.target.value)),);
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
		.pipe(map(sectors => this.__filterFlyTo(sectors, ev.target.value)),);
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
					prefAirline: prefAirline
				}
			});     
		}
	}

	closeDropDown(ev) {
		jQuery(ev.path[2]).removeClass('show');
		jQuery(ev.path[3]).removeClass('show');
	}

}
