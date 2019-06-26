import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { MainService } from 'src/app/services/main.service';
import { CookieService } from 'ngx-cookie-service';
import * as _ from 'lodash';

@Component({
  selector: 'app-hotel-booking',
  templateUrl: './hotel-booking.component.html',
  styleUrls: ['./hotel-booking.component.css']
})
export class HotelBookingComponent implements OnInit {

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  hotelData: any;
  hotelDetails: any;
  hotelId;
  hotelObj: object;
  searchQuery: object;

  isLoading: boolean = true;

  checkInDate: Date;
  checkOutDate: Date;
  totalNights: number;

  bookingInfo = [];
  roomsInfo = [];
  room_ids = []
  selectedRooms: any;
  totalPrice;
  totalGuests;

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  monthsNames = [{"name": "January", "value": 0}, {"name": "February", "value": 1}, {"name": "March", "value": 2}, {"name": "April", "value": 3}, {"name": "May", "value": 4}, {"name": "June", "value": 5}, {"name": "July", "value": 6}, {"name": "August", "value": 7}, {"name": "September", "value": 8}, {"name": "October", "value": 9}, {"name": "November", "value": 10}, {"name": "December", "value": 11}];
  monthItems = [];
  yearItems = [];

  myRooms: any;

  isLinear = true;
  bookingInfoFrom: FormGroup;
  paymentInfoForm: FormGroup;

  guestFormInfo;
  bookingErrorMsg;
  paymentFormInfo;
  paymentErrorMsg;

  bookingComplete: boolean = false;

  constructor(private _ms: MainService, private _cookieService: CookieService, private __fb: FormBuilder) { }

  ngOnInit() {
    // get search query
    this.searchQuery = JSON.parse(this._cookieService.get('hotelQuery'));

    this.checkInDate = this.searchQuery['checkInDate']; //this.searchQuery['dates']['startDate'];
    this.checkOutDate = this.searchQuery['checkOutDate']; //this.searchQuery['dates']['endDate'];
    this.totalNights = this.calculateDate(this.checkInDate, this.checkOutDate);

    this.bookingInfo = JSON.parse(this._cookieService.get('bookingInfo'));
    this.totalGuests = this.bookingInfo['totalGuests'];
    this.totalPrice = this.bookingInfo['totalPrice'];

    this.hotelId = this._cookieService.get('hotelId');
    this.hotelObj = {
      hotel_id: this.hotelId
    }

    this._ms.postData('http://cheapfly.pk/rgtapp/index.php/services/HotelQuery/hotelDetails', this.hotelObj).subscribe(result => {
      this.hotelDetails = result;
      this.galleryImages = result['images'];
      this.isLoading = false;
    })

    this.getSelectedRooms();

    this.galleryOptions = [
      {
        width: '100%',
        height: '100%',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '100%',
        imagePercent: 100,
        thumbnailsPercent: 20,
        thumbnailsMargin: 5,
        thumbnailMargin: 5
      },
      // max-width 400
      {
        breakpoint: 400,
        width: '100%',
        height: '200px',
        imagePercent: 100,
        thumbnailsPercent: 20,
        thumbnailsMargin: 5,
        thumbnailMargin: 5,
        preview: false
      }
    ];

    this.bookingInfoFrom = this.__fb.group({
      title: ['Mr', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      confirmEmail: ['', Validators.required],
      bookingFor: ['', Validators.required],
      rentACar: [''],
    });
    this.paymentInfoForm = this.__fb.group({
      cardType: [''],
      cardNumber: ['', Validators.required],
      cvn: ['', Validators.required],
      cardHolderFirstName: ['', Validators.required],
      cardholderLastName: ['', Validators.required],
      expiryMonth: ['', Validators.required],
      expiryYear: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
    });

    // years list
    for (let i = 0; i < 10; i++) {      
      this.yearItems.push({"value": this.currentYear + i});
    }
    // months list
    for (let j = 0; j < this.monthsNames.length; j++) {
      if(j >= this.currentMonth){
        this.monthItems.push(this.monthsNames[j]);
      }
    }

  } //

  getSelectedRooms = () => {
    this.roomsInfo = this.bookingInfo['roomsInfo'];
    for (let i = 0; i < this.roomsInfo.length; i++) {
      let id = this.roomsInfo[i].roomId;
      this.room_ids.push(id);
    }
    let reservedRooms = {
      hotel_id: this.hotelId,
      room_ids: this.room_ids
    }

    this._ms.postData('http://cheapfly.pk/rgtapp/index.php/services/HotelQuery/reservedHotelDetails', reservedRooms).subscribe(result => {
      this.selectedRooms = result['room_details']
      this.selectedRooms = _.map(this.selectedRooms, (obj) => {
        return _.assign(obj, _.find(this.roomsInfo, { roomId: obj.id }));
      });
    })
  }


  removeSelectedRoom = (id) => {
    for (var i = this.roomsInfo.length - 1; i--;) {
      if (this.roomsInfo[i].roomId === id) this.roomsInfo.splice(i, 1);
    }
    this._cookieService.set('roomsInfo', JSON.stringify(this.roomsInfo));
    this.getSelectedRooms();
  }

  calculateDate = (date1: any, date2: any) => {
    //our custom function with two parameters, each for a selected date
    let diffc = new Date(date1).getTime() - new Date(date2).getTime();
    //getTime() function used to convert a date into milliseconds. This is needed in order to perform calculations.

    let days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));
    //this is the actual equation that calculates the number of days.

    return days;
  }

  createRange(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  guestInfo = (formData) => {
    if(this.bookingInfoFrom.valid){
      this.guestFormInfo = formData;
      console.log('form data',formData);
    }
    else{
      this.bookingErrorMsg = "Please Fill All Required Fields";
      this.bookingInfoFrom.controls['bookingFor'].markAsTouched();
    }
  }

  paymentInfo = (formData) => {
    if(this.paymentInfoForm.valid){
      this.paymentFormInfo = formData;
      this.bookingComplete = true;
    }else{
      this.paymentErrorMsg = "Please Fill All Required Fields";
    }
  }

  conformBooking = () => {
    
    let bookingObj = {
      hotelId: this.hotelId,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      totalNights: this.totalNights,
      totalGuests: this.totalGuests,
      totalPirce: this.totalPrice,
      guests: {
        adults: this.searchQuery['adults'],
        children: this.searchQuery['children'],
        childrenAges: this.searchQuery['childrenAges']
      },
      rooms: this.roomsInfo,
      guestInfo: this.guestFormInfo,
      paymentInfo: this.paymentFormInfo
    }

    console.log('confirm', bookingObj)
    this._ms.postData('http://cheapfly.pk/rgtapp/index.php/services/HotelQuery/bookingRequest', bookingObj).subscribe(result => {
      console.log('responce',result)
    })
    
  }

}
