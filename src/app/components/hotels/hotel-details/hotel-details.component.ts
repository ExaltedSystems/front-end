import { Component, OnInit } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { MainService } from 'src/app/services/main.service';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/date.adapter';
declare var jQuery;


@Component({
    selector: 'app-hotel-details',
    templateUrl: './hotel-details.component.html',
    styleUrls: ['./hotel-details.component.css'],
	providers: [
		{
			provide: DateAdapter, useClass: AppDateAdapter
		},
		{
			provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
		}
	]
})
export class HotelDetailsComponent implements OnInit {

    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];

    hotelData: any;
    hotelDetails: object;
    hotelId;
    hotelObj: object;
    searchQuery: object;
    isLoading: boolean = true;

    UpdateHotelSearch: FormGroup;
    adults: number = 1;
    children: number = 0;
    rooms: number = 1;
    childrenAges: FormArray
    checkInDate: Date;
    checkOutDate: Date;
    inlineCheckInDate: any;
    inlineCheckOutDate: any;
    totalNights: number;

    currDate: Date = new Date();
    cookieExists: boolean;
    currentSearch: any;

    roomsSelected: number[] = [];
    totalRoomsSelected: number = 0;
    roomsPrice: number[] = [];
    totalRoomsPrice: number = 0;
    roomsGuests: number[] = [];
    totalRoomsGuests: number = 0;

    selectedRoomsId = [];

    inlineSearchForm: boolean = false;
    hotelPaymentDetails: any;

    deviceInfo = null;
    isDesktop = null;
    isMobile = null;
    isTablet = null;
    sideForm:boolean = true;
    roomsMsg;

    constructor(private _ms: MainService, private _date: DatePipe, private __fb: FormBuilder,private _router: Router,
         private _cookieService: CookieService, private deviceService: DeviceDetectorService) {
             this.epicFunction();
            window.scroll(0, 0);
        }

    ngOnInit() {
        window.scroll(0,0);
        
        jQuery(window).scroll(function(){
            if (jQuery(this).scrollTop() > 1100) {
                jQuery('#task_flyout').addClass('fixed');
            } else {
                jQuery('#task_flyout').removeClass('fixed');
            }
        });
        // get search query
        this.searchQuery = JSON.parse(this._cookieService.get('hotelQuery'));
        console.log('search',this.searchQuery)
        this.checkInDate = this.searchQuery['checkIn_date_value']; //this.searchQuery['dates']['startDate'];
        this.checkOutDate = this.searchQuery['checkOut_date_value']; //this.searchQuery['dates']['endDate'];
        this.totalNights = this.calculateDate(this.checkInDate, this.checkOutDate)
        // console.log('nights', this.totalNights)

        this.hotelId = this._cookieService.get('hotelId');
        this.hotelObj = {
            hotel_id: this.hotelId
        }

        this._ms.postData(this._ms.backEndUrl+'HotelQuery/hotelDetails', this.hotelObj).subscribe(result => {
            this.hotelDetails = result;
            console.log(typeof result)
            this.galleryImages = result['images'];
            this.hotelPaymentDetails = JSON.parse(result['payment_mothods']);
            console.log('hotel data', this.hotelDetails)
            this.isLoading = false;
        })

        this.galleryOptions = [
            { "previewCloseOnClick": true, "previewCloseOnEsc": true },
            {
                width: '100%',
                height: '600px',
                thumbnailsColumns: 8,
                imagePercent: 100,
                thumbnailsPercent: 10,
                thumbnailsMargin: 5,
                thumbnailMargin: 5,
                imageAnimation: NgxGalleryAnimation.Slide
            },
            // max-width 800
            {
                breakpoint: 800,
                width: '100%',
                height: '500px',
                imagePercent: 100,
                thumbnailsPercent: 25,
                thumbnailsMargin: 5,
                thumbnailMargin: 5
            },
            // max-width 400
            {
                breakpoint: 400,
                width: '100%',
                height: '300px',
                thumbnailsColumns: 5,
                imagePercent: 100,
                thumbnailsPercent: 20,
                thumbnailsMargin: 5,
                thumbnailMargin: 5,
                preview: false
            }
        ];

        // Hotel form
        this.UpdateHotelSearch = this.__fb.group({
            checkInDate: [""],
            checkOutDate: [""],
            dates: [""],
            dateRange: [""],
            rooms: ["1"],
            adults: ["1"],
            children: [""],
            childrenAges: this.__fb.array([])
        });

        // this.searchQuery = searchCookie;
        this.cookieExists = this._cookieService.check('hotelQuery');
        if (this.cookieExists == true) {
            let searchCookie = this._cookieService.get('hotelQuery');
            this.currentSearch = JSON.parse(searchCookie);
            // this.UpdateHotelSearch.controls['checkInDate'].setValue(this.currentSearch.dates.startDate);
            // this.UpdateHotelSearch.controls['checkOutDate'].setValue(this.currentSearch.dates.endDate);
            this.UpdateHotelSearch.controls['checkInDate'].setValue(this.currentSearch.checkIn_date_value);
            this.UpdateHotelSearch.controls['checkOutDate'].setValue(this.currentSearch.checkOut_date_value);
            this.UpdateHotelSearch.controls['dates'].setValue(this.currentSearch.dates);
            this.UpdateHotelSearch.controls['dateRange'].setValue(this.currentSearch.dateRange);
            this.UpdateHotelSearch.controls['rooms'].setValue(this.currentSearch.rooms);
            this.UpdateHotelSearch.controls['adults'].setValue(this.currentSearch.adults);
            this.UpdateHotelSearch.controls['children'].setValue(this.currentSearch.children);
            this.rooms = this.currentSearch.rooms;
            this.adults = this.currentSearch.adults;
            this.children = this.currentSearch.children;
            this.childrenAges = this.__fb.array([this.createChildForm(this.currentSearch.childrenAges, this.currentSearch.children)])
        }

    } //
    epicFunction() {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        this.isMobile = this.deviceService.isMobile();
        this.isTablet = this.deviceService.isTablet();
        this.isDesktop = this.deviceService.isDesktop();
    }

    createChildForm(formData, childrensCount) {
        let chd_arr = this.UpdateHotelSearch.controls.childrenAges as FormArray;
        for (let i = 0; i < childrensCount; i++) {
            chd_arr.push(this.childAge(formData[i].childAge));
        }
    }

    childAge(formData): FormGroup {
        if (formData != null) {
            return this.__fb.group({
                childAge: [formData]
            });
        }
    }

    addChild(): void {
        this.childrenAges = this.UpdateHotelSearch.controls.childrenAges as FormArray;
        this.childrenAges.push(this.childAge(''));
    }

    removeChild(index): void {
        this.childrenAges = this.UpdateHotelSearch.get('childrenAges') as FormArray;
        this.childrenAges.removeAt(index);
    }

    incrementNumbers(type) {
        switch (type) {
            case 'adults': {
                this.adults = +this.adults + 1;
                this.UpdateHotelSearch.controls['adults'].setValue(this.adults);
                break;
            }
            case 'children': {
                this.children = +this.children + 1;
                this.UpdateHotelSearch.controls['children'].setValue(this.children);
                // this.addChildrenAgeForm();
                this.addChild();
                break;
            }
            case 'rooms': {
                this.rooms = +this.rooms + 1;
                this.UpdateHotelSearch.controls['rooms'].setValue(this.rooms);
                break;
            }
        }
    }

    decrementNumbers(type) {
        switch (type) {
            case 'adults': {
                this.adults--;
                this.adults < 1 ? this.adults = 1 : this.adults;
                this.UpdateHotelSearch.controls['adults'].setValue(this.adults);
                break;
            }
            case 'children': {
                this.children--;
                this.children < 0 ? this.children = 0 : this.children;
                this.UpdateHotelSearch.controls['children'].setValue(this.children);
                // this.addChildrenAgeForm(); 
                if (this.children > 0) {
                    this.removeChild(0);
                }
                break;
            }
            case 'rooms': {
                this.rooms--;
                this.rooms < 1 ? this.rooms = 1 : this.rooms;
                this.UpdateHotelSearch.controls['rooms'].setValue(this.rooms);
                break;
            }
        }
    }

    toggleInlineSearch = (value) => {
        this.inlineSearchForm = value;
        console.log('test',jQuery('#date-range1').val());
        if(value == true)
        jQuery('#date-range1').dateRangePicker(
            {
              autoClose: true,
              format: 'DD MMM YYYY',
              separator : ' - ',
              startDate: new Date()
            }
          );
    }

    updateInlineSearch = (formInputs) => {
        // console.log('forminputs',formInputs);
        let date1 = new Date(jQuery('#date-range1').val().split('-')[0]);
    let date2 = new Date(jQuery('#date-range1').val().split('-')[1]);
        if(this.UpdateHotelSearch.valid){
          let formObj = {
            destination: this.currentSearch.destination,
            checkInDate: this._date.transform(date1,'M/d/yy'),
            checkOutDate: this._date.transform(date2,'M/d/yy'),
            dates: formInputs.dates,
            dateRange: jQuery('#date-range1').val(),
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

    createRange(number) {
        var items: number[] = [];
        for (var i = 1; i <= number; i++) {
            items.push(i);
        }
        return items;
    }

    scroll(el: HTMLElement) {
        el.scrollIntoView();
    }

    calculateDate = (date1: any, date2: any) => {
        //our custom function with two parameters, each for a selected date
        let diffc = new Date(date1).getTime() - new Date(date2).getTime();
        //getTime() function used to convert a date into milliseconds. This is needed in order to perform calculations.

        let days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));
        //this is the actual equation that calculates the number of days.

        return days;
    }

    public getRoomsPrice = (rooms: number, price: number,i,guests,roomId) => {
        if(rooms > 0){
            this.roomsMsg = "";
        }
        this.roomsPrice[i] = 0;
        this.roomsSelected[i] = 0;
        this.roomsGuests[i] = 0;
        this.roomsPrice[i] = price * rooms;
        this.roomsSelected[i] = +rooms;
        this.roomsGuests[i] = +guests * +rooms;
        // for(let j = 0; j <= totalCount; j++){
        //     if(index == j){
        //         this.roomsPrice[j] = 0;
        //         this.roomsSelected[j] = 0;
        //         this.roomsPrice[j] = price * rooms;
        //         this.roomsSelected[j] = +rooms;
        //     }
        // }
        // let room_id;
        // room_id[i] = roomId; 
        let roomsObj = {
            roomId: roomId,
            roomsCount: this.roomsSelected[i],
            price: price,
            roomGuests:guests
        }
        
        this.selectedRoomsId[i] = roomsObj;
        console.log('roomsObj', roomsObj);
        this.totalRoomsPrice = this.roomsPrice.reduce(this.getSum);
        this.totalRoomsSelected = this.roomsSelected.reduce(this.getSum);
        this.totalRoomsGuests = this.roomsGuests.reduce(this.getSum);
    }

     getSum = (total, num) => {
        return total + num;
      }

    changeInlineSearch = () => {
        let check_in_date = this._date.transform(this.checkInDate, 'd-M-yy');
        let check_out_date = this._date.transform(this.checkOutDate, 'd-M-yy');
        this.inlineCheckInDate = this.checkInDate //this._date.transform(this.checkInDate,'d/M/yy');
        this.inlineCheckOutDate = this.checkOutDate //this._date.transform(this.checkOutDate,'d/M/yy');
    }

    keytab(event) {
        let element = event.targetElement.nextElementSibling; // get the sibling element

        if (element == null) {  // check if its null
            return;
        } else {
            element.focus();   // focus if not null
        }
        this.totalNights = this.calculateDate(this.UpdateHotelSearch.controls.checkInDate.value, this.UpdateHotelSearch.controls.checkOutDate.value);
    }

    public getSearchResults = ($event) => {
        this.isLoading = true;
        this.hotelData = $event;
        this.isLoading = false;
    }

    public continueBooking = (rooms,guests) => {
        if(rooms < 1){
            this.roomsMsg = "Please Select 1 or more Rooms";
            return false;
        }
        if(guests < this.adults){
            return false;
        }
        let bookingInfo = {
            roomsInfo: this.selectedRoomsId,
            totalRooms: this.totalRoomsSelected,
            totalPrice: this.totalRoomsPrice,
            totalGuests: this.totalRoomsGuests
        }
        this._cookieService.set('bookingInfo',JSON.stringify(bookingInfo));
        this._router.navigate(['/hotel-booking']);
    }
    
  closeDropDown(ev) {
    console.log(ev.path);
    jQuery(ev.path[2]).removeClass('show')
    jQuery(ev.path[3]).removeClass('show')

  }
  

}
