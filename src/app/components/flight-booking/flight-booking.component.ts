import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { MatDatepicker, MatSelect, MatOption, MatButton, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { count } from 'rxjs/operators';
import { MainService } from 'src/app/services/main.service';
import { AirPortsPipe } from 'src/app/air-ports.pipe';
import { DatePipe } from '@angular/common';
import { MatStep, MatStepper } from '@angular/material';
import { DateFormatPipe } from 'src/app/pipes/date-format.pipe';
import { HttpHeaders } from '@angular/common/http';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/date.adapter';
declare var jQuery;

@Component({
  selector: 'app-flight-booking',
  templateUrl: './flight-booking.component.html',
  styleUrls: ['./flight-booking.component.css'],
  providers: [DatePipe, DateFormatPipe, AirPortsPipe, { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }],
  encapsulation: ViewEncapsulation.None
})


export class FlightBookingComponent implements OnInit {

  flightType: any;
  dptDate: any;
  rtnDate: any;
  oLocation: any;
  oLocationName: any = localStorage.getItem('oLocation');
  dLocation: any;
  dLocationName: any = localStorage.getItem('dLocation');
  cabin: any;
  prefAirline: any;
  adtQty: number;
  cnnQty: number;
  infQty: number;
  flightInfo: any;
  OriginDestinationOptions = null;
  // flightSegments = null;
  flightPricing: object;
  travellersObj: object;
  tagExpired: boolean = false;
  tokenExpired: boolean = false;
  payProgressBar: boolean = false;
  byTagResponse;
  issuingCountries: any;

  cnnStart: number = 1;
  infStart: number = 1;

  bankDetails: any;
  branchesDetails: any;
  // Set Document Type For Ticket (i.e. P if Number is < 10 else F)
  selectedDocType: string = "P";

  isLinear = true;
  @Input('form') form: NgForm;
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
  @ViewChild('mystepp') mystepp: MatStep;
  @ViewChild('stepper') stepper: MatStepper;
  // @ViewChild('creditCardButton') MatButton;
  travellersForm: FormGroup;
  docNumPlaceholder = 'Document #';
  docExpPlaceholder = 'Document Expiry';
  passengersArr: FormArray;
  paymentForm: FormGroup;
  jazzForm: FormGroup;
  creditCardForm;
  jazzCashForm;
  // Payment Gateways
  paymentGateways: any;
  validatingCarrier: string;

  // creditCardButton;

  cardTypeitems = [{ "label": "Visa", "value": "visa", "checked": true },
  { "label": "Master", "value": "master", "checked": false }];

  monthsNames = [{ "name": "January", "value": 0 }, { "name": "February", "value": 1 }, { "name": "March", "value": 2 }, { "name": "April", "value": 3 }, { "name": "May", "value": 4 }, { "name": "June", "value": 5 }, { "name": "July", "value": 6 }, { "name": "August", "value": 7 }, { "name": "September", "value": 8 }, { "name": "October", "value": 9 }, { "name": "November", "value": 10 }, { "name": "December", "value": 11 }];
  monthItems = [];

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  yearItems = [];
  segmentInfoArr = [];
  referenceNo: string;
  currDate = new Date();

  dt = new Date();
  minDocExpiryDate = new Date(this.dt.setDate(this.dt.getDate() + 180));
  // minDocExpiryDate = new Date();

  maxPickerDate = [];
  minPickerDate = [];

  vCarrier: string;
  postPsgrs;
  fareRules = null;
  paymentFlag = 1;
  constructor(private __fb: FormBuilder, private __actRouter: ActivatedRoute, private __router: Router,
    private __ms: MainService, private __datepipe: DatePipe) {
    // window.scroll(0, 0);
    this.getIssuingCountriesList();
  }

  ngOnInit() {
    this.getPaymentGateways();
    // this.flightInfo = this.__ms.FlightInfo;
    this.flightInfo = JSON.parse(localStorage.getItem('flightInfo'));
    this.adtQty = Number(this.flightInfo.adults);
    this.cnnQty = Number(this.flightInfo.children);
    this.infQty = Number(this.flightInfo.infants);
    let vCarrier = this.flightInfo.vCarrier;
    this.vCarrier = vCarrier;
    if (vCarrier == 'ER') {
      let Option = JSON.parse(localStorage.getItem('OriginDestinationOption'));
      this.__setReservationArr(Option);
      // this.tagExpired = true;
    } else {
      let airByTagObj: any = this.__ms.airByTagObj(this.flightInfo.tagID);
      this.__ms.postData(this.__ms.byTagUrl, airByTagObj).subscribe(res => {
        //console.log(res)
        if (!res['errorCode']) {
          this.__setReservationArr(res);
          // this.airRevalidate(res);
        } else {
          this.tagExpired = true;
        }
      })
    }

    this.travellersForm = this.__fb.group({
      // title: ['', Validators.required],
      // firstName: ['', Validators.required],
      // lastName: ['', Validators.required],
      // dob: ['', Validators.required],
      // docType: ['', Validators.required],
      // cnic: ['', Validators.required],
      // cnicExp: ['', Validators.required],
      // issuingCountry: ['', Validators.required],
      // nationality: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(19), Validators.pattern("^[0-9]*$")]],
      emailAddress: ['', [Validators.required, Validators.email, Validators.pattern(this.__ms.emailPattern)]],
      passengersArr: this.__fb.array([this.setPassengerArr('ADT')])
    });
    this.maxPickerDate.push(this.getValidDobDate(12));
    this.minPickerDate.push(this.getValidDobDate('100'));
    // let TotalPsgrs:number = this.adtQty + this.cnnQty + this.infQty;
    // if(TotalPsgrs > 0){
    //   // this.cnnStart = this.adtQty;
    //   this.cnnStart = this.adtQty + 1;
    //   if(this.cnnQty > 0){
    //   }

    //   if(this.infQty > 0){
    //     this.infStart = (this.adtQty + this.cnnQty )+ 1;
    //   }

    //   for(let i = 1; i < TotalPsgrs; i++){
    //     // this.setPassengerArr();
    //     this.passengersArr = this.travellersForm.get('passengersArr') as FormArray;
    //     this.passengersArr.push(this.setPassengerArr());
    //   }
    // }
    this.postPsgrs = [{
      __isType: 'ADT',
      __isValue: this.adtQty
    }];

    this.cnnStart = this.adtQty + 1;
    if (this.adtQty > 1) {
      this.passengersArr = this.travellersForm.get('passengersArr') as FormArray;
      for (let i = 1; i < this.adtQty; i++) {
        this.passengersArr.push(this.setPassengerArr('ADT'));
        this.maxPickerDate.push(this.getValidDobDate(12));
        this.minPickerDate.push(this.getValidDobDate('100'))
      }
    }
    if (this.cnnQty > 0) {
      this.passengersArr = this.travellersForm.get('passengersArr') as FormArray;
      for (let j = 0; j < this.cnnQty; j++) {
        this.passengersArr.push(this.setPassengerArr('CNN'));
        this.maxPickerDate.push(this.getValidDobDate('2'));
        this.minPickerDate.push(this.getValidDobDate('12'))
      }

      this.postPsgrs.push({
        __isType: 'CNN',
        __isValue: this.cnnQty
      })
    }

    if (this.infQty > 0) {
      this.passengersArr = this.travellersForm.get('passengersArr') as FormArray;
      this.infStart = (this.adtQty + this.cnnQty) + 1;
      for (let j = 0; j < this.infQty; j++) {
        this.passengersArr.push(this.setPassengerArr('INF'));
        this.maxPickerDate.push(this.getValidDobDate('0'));
        this.minPickerDate.push(this.getValidDobDate('2'))
      }

      this.postPsgrs.push({
        __isType: 'INF',
        __isValue: this.infQty
      })
    }
    // console.log('passengersArr', this.travellersForm.get('passengersArr'))

    this.paymentForm = this.__fb.group({
      cardType: ["visa", Validators.required],
      cardNumber: ["", [Validators.required, Validators.minLength(13), Validators.maxLength(19), Validators.pattern("^[0-9]*$")]],
      cvn: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(4), Validators.pattern("^[0-9]*$")]],
      expiryMonth: ["", Validators.required],
      expiryYear: ["", Validators.required],
      cardHolderFirstName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')]],
      cardHolderLastName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')]],
      cardHolderMobile: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(19), Validators.pattern("^[0-9]*$")]],
      cardHolderEmail: ["", [Validators.required, Validators.email, Validators.pattern(this.__ms.emailPattern)]],
      address: ["", Validators.required],
      city: ["", Validators.required],
      zipCode: ["", Validators.required],
      state: ["", Validators.required],
      country: ["", Validators.required]
    })

    this.jazzForm = this.__fb.group({
      transactionType: ["MWALLET", Validators.required],
    })

    for (let i = 0; i < 10; i++) {
      this.yearItems.push({ "value": this.currentYear + i });
    }
    //     for (let j = 0; j < this.monthsNames.length; j++) {
    //       if(j >= this.currentMonth){
    //         this.monthItems.push(this.monthsNames[j]);
    //       }
    //     }
    this.__ms.getBankDetails().subscribe(res => {
      this.bankDetails = res.data;
    });

    this.__ms.getBranchesDetails().subscribe(res => {
      this.branchesDetails = res.data;
    });

    this.populateMonths(this.currentYear);

  }// end oninit
  __setReservationArr(res) {
    this.byTagResponse = res;
    this.validatingCarrier = res['TPA_Extensions']['ValidatingCarrier']['Code'];
    this.OriginDestinationOptions = res['AirItinerary']['OriginDestinationOptions']['OriginDestinationOption'];
    // this.flightSegments = res['AirItinerary']['OriginDestinationOptions']['OriginDestinationOption'][0]['FlightSegment'];
    let party = this.adtQty + this.cnnQty;
    this.OriginDestinationOptions.forEach(element => {
      let flightSegments = element.FlightSegment;
      flightSegments.forEach(segment => {
        // let MarriageGrp = segment.MarriageGrp == 'I' ? 'X' : segment.MarriageGrp;
        this.segmentInfoArr.push({
          __isFareTypeId:segment.FareTypeID,
          __isLfid:segment.LFID,
          __isPfid:segment.PFID,
          __isADate: this.__datepipe.transform(segment.ArrivalDateTime, "yyyy-MM-dd"),
          __isATime: this.__datepipe.transform(segment.ArrivalDateTime, "hh:mm:ss"),
          __isDDate: this.__datepipe.transform(segment.DepartureDateTime, "yyyy-MM-dd"),
          __isDTime: this.__datepipe.transform(segment.DepartureDateTime, "hh:mm:ss"),
          __isFlightNo: segment.FlightNumber,
          __isParty: party,
          __isCabin: segment.ResBookDesigCode,
          __isMarriage: segment.MarriageGrp,
          __isStatus: "NN",
          __isEquipType: segment.Equipment[0].AirEquipType,
          __isOLocation: segment.DepartureAirport.LocationCode,
          __isDLocation: segment.ArrivalAirport.LocationCode,
          __isMkAirLine: segment.MarketingAirline.Code,
          __isOpAirLine: segment.OperatingAirline.Code
        });

      });
    });
    this.flightPricing = res['AirItineraryPricingInfo'][0];
  }

  populateMonths(Year) {
    this.monthItems = [];
    if (Year > this.currentYear) {
      for (let j = 0; j < this.monthsNames.length; j++) {
        this.monthItems.push(this.monthsNames[j]);
      }
    } else {
      for (let j = 0; j < this.monthsNames.length; j++) {
        if (j >= this.currentMonth) {
          this.monthItems.push(this.monthsNames[j]);
        }
      }
    }
  }

  getValidDobDate = function (t) {
    var n = new Date(this.flightInfo.dptDate),
      e = n.setFullYear(n.getFullYear() - t, n.getMonth(), n.getDate());
    return this.__datepipe.transform(e, "yyyy-MM-dd"); //this.datePipe.transform(e, "yyyy-MM-dd")
  }

  changeDocType(ev, key) {
    let docValue = ev.target.value;
    let docType = "P";
    if (docValue.length < 10) {
      this.selectedDocType = "P";
      docType = "P";
    } else {
      this.selectedDocType = "F";
      docType = "F";
    }

    let formArray = this.travellersForm.controls['passengersArr'] as FormArray;
    let formGroup = formArray.controls[key] as FormGroup;
    formGroup.controls['docType'].setValue(docType);
    // if(ev.value == 'P'){
    //   this.docNumPlaceholder = 'Passport #';
    //   this.docExpPlaceholder = 'Passport Expiry Date';
    // }else if(ev.value == 'F'){
    //   this.docNumPlaceholder = 'CNIC #';
    //   this.docExpPlaceholder = 'CNIC Expiry Date';
    // }
  }

  airRevalidate(byTagRes) {
    let revalidateRes = this.__ms.revalidateReq(byTagRes, this.adtQty, this.cnnQty, this.infQty, this.flightInfo.dptDate);
    revalidateRes.subscribe(res => {
      if (res['_isMessage'] == 'OK') {
        //
      } else {
        //
      }
    })
  } // 

  setPassengerArr(paxType): FormGroup {
    return this.__fb.group({
      psgType: [paxType, Validators.required],
      title: ["", Validators.required],
      firstName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')]],
      lastName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern('^[a-zA-Z ]*$')]],
      dob: ["", Validators.required],
      docType: [""],
      cnic: ["", Validators.required],
      cnicExp: ["", Validators.required],
      issuingCountry: ["PK", Validators.required],
      nationality: ["PK", Validators.required],
    })
  }

  changeFlight() {
    this.flightInfo;
    this.__router.navigate(["/flights-listing"], {
      queryParams: {
        _flight_type: this.flightInfo.flightType,
        _flying_from: this.flightInfo.origin,
        _flying_to: this.flightInfo.destination,
        _departure_date: this.flightInfo.dptDate,
        _return_date: this.flightInfo.rtnDate,
        adults: this.flightInfo.adults,
        children: this.flightInfo.children,
        infant: this.flightInfo.infants,
        cabin: this.flightInfo.cabin,
        prefAirline: this.flightInfo.prefAirline
      }
    });
  }

  reservation_step1(formInputs) {
    let postTravellers = [];
    for (var i = 0; i < formInputs.passengersArr.length; i++) {
      postTravellers.push({
        __isType: formInputs.passengersArr[i].psgType,
        __isPrefix: formInputs.passengersArr[i].title,
        __isFirstName: formInputs.passengersArr[i].firstName,
        __isLastName: formInputs.passengersArr[i].lastName,
        __isDOB: formInputs.passengersArr[i].dob,
        __isCountry: formInputs.passengersArr[i].nationality,
        __isDocType: this.selectedDocType,
        __isDocNo: formInputs.passengersArr[i].cnic,
        __isExpiryDate: formInputs.passengersArr[i].cnicExp,
        __isIssued: formInputs.passengersArr[i].issuingCountry,
      });
    }


    this.travellersObj = {
      phoneNo: formInputs.phoneNo,
      emailAddress: formInputs.emailAddress,
      ticketAmount: this.flightPricing['ItinTotalFare']['TotalFare']['Amount'],
      __isTravelDate: this.flightInfo.dptDate,
      __isFlightType: this.flightInfo.flightType,
      passengers: this.postPsgrs,
      travellers: postTravellers,
      segmentArr: this.segmentInfoArr
    }
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    // console.log('postData',this.travellersObj)
    let step1Url = this.__ms.backEndUrl + 'Ticket/retRefNo';
    this.__ms.postData(step1Url, this.travellersObj).subscribe(res => {
      //console.log(res)
      localStorage.setItem("paxToken", res['jwt']);
      this.referenceNo = res['ref_no'];
    })
    // this.referenceNo = 'RT-000095';
    return true;
  }

  creditCardPost(formInputs) {
    this.payProgressBar = true;
    let creditCardUrl = this.__ms.backEndUrl + 'Ticket/creditCard';
    let reservationObj = Object.assign(formInputs, this.travellersObj, this.segmentInfoArr, { _token: localStorage.getItem('paxToken') });
    this.__ms.postData(creditCardUrl, reservationObj).subscribe(res => {
      // console.log(res)
      // localStorage.setItem("paxToken", res['jwt']);
      this.creditCardForm = res['inputs'];
      setTimeout(function () {
        jQuery('#creditCardForm').html(res['inputs'])
        jQuery('#creditCardForm').submit()
      }, 1000)
    })
    // console.log(reservationObj)
  } //

  cashOnDelivery() {
    this.payProgressBar = true;
    this.paymentFlag = 3;
    let flightInfoObj = {
      _refrenceNo: this.referenceNo,
      _token: localStorage.getItem("paxToken"),
      _paymentFlag: this.paymentFlag
    }
    Object.assign({ refrenceNo: this.referenceNo }, { token: localStorage.getItem("paxToken") })
    let flightInfoUrl = this.__ms.backEndUrl + 'Ticket/retFlightInfo';
    this.__ms.postData(flightInfoUrl, flightInfoObj).subscribe(res => {
      // console.log(res);
      if (res['res_flag'] == true) {
        this.createPnr(res);
      } else if (res['res_flag'] == false) {
        this.tokenExpired = true;
        this.payProgressBar = false;
      }
    })
  } //

  byBank() {
    this.payProgressBar = true;
    this.paymentFlag = 2;
    let flightInfoObj = {
      _refrenceNo: this.referenceNo,
      _token: localStorage.getItem("paxToken"),
      _paymentFlag: this.paymentFlag
    }
    Object.assign({ refrenceNo: this.referenceNo }, { token: localStorage.getItem("paxToken") })
    let flightInfoUrl = this.__ms.backEndUrl + 'Ticket/retFlightInfo';
    this.__ms.postData(flightInfoUrl, flightInfoObj).subscribe(res => {
      // console.log(res);
      if (res['res_flag'] == true) {
        this.createPnr(res);
      } else if (res['res_flag'] == false) {
        this.tokenExpired = true;
        this.payProgressBar = false;
      }
    })
  }// end by bank

  byBranch() {
    this.payProgressBar = true;
    this.paymentFlag = 7;
    let flightInfoObj = {
      _refrenceNo: this.referenceNo,
      _token: localStorage.getItem("paxToken"),
      _paymentFlag: this.paymentFlag
    }
    Object.assign({ refrenceNo: this.referenceNo }, { token: localStorage.getItem("paxToken") })
    let flightInfoUrl = this.__ms.backEndUrl + 'Ticket/retFlightInfo';
    this.__ms.postData(flightInfoUrl, flightInfoObj).subscribe(res => {
      // console.log(res);
      if (res['res_flag'] == true) {
        this.createPnr(res);
      } else if (res['res_flag'] == false) {
        this.tokenExpired = true;
        this.payProgressBar = false;
      }
    })
  }// end by branch

  createPnr(flightInfos) {
    Object.assign(flightInfos, { vCarrier: this.vCarrier })
    this.__ms.createPnr(flightInfos).subscribe(resp => {
      console.log(resp)
      let pnr = resp['__isPnr'];
      this.pnrCreated(pnr);
    })
    // JFLWVB
  } //

  pnrCreated(pnr) {
    this.insertPNR(pnr);
    this.__ms.pnrCreated(pnr).subscribe(res => {
      //console.log(res)
      this.__router.navigate(["/thank-you"], {
        // relativeTo: this.__route,
        queryParams: {
          _token: localStorage.getItem("paxToken")
        }
      });
    })
  }

  viewFareRules() {
    let fareBasis = this.byTagResponse['AirItineraryPricingInfo'][0]['PTC_FareBreakdowns']['PTC_FareBreakdown'][0]['FareBasisCodes']['FareBasisCode'];
    //console.log('fareBasis',fareBasis);
    let fareSegments = [];
    let totSegs = 0;
    this.OriginDestinationOptions.forEach(element => {
      let flightSegments = element.FlightSegment;
      flightSegments.forEach(segment => {

        fareSegments.push({
          __isType: "0",
          __isDDate: this.__datepipe.transform(segment.DepartureDateTime, "yyyy-MM-dd"),
          __isADate: this.__datepipe.transform(segment.ArrivalDateTime, "yyyy-MM-dd"),
          __isOLocation: segment.DepartureAirport.LocationCode,
          __isDLocation: segment.ArrivalAirport.LocationCode,
          __isFareBasis: fareBasis[totSegs].content,
          __isCabin: segment.ResBookDesigCode
        })
        totSegs += 1;
      });

    });

    let fareRulesObj = {
      __isView: "W",
      __isAction: "C",
      __isVendorId: 1,
      __isAgentId: 0,
      __isParantId: 0,
      __isUserId: 0,
      __isFlightType: this.flightInfo.flightType,
      __isAirType: "O",
      __isVCarrier: this.validatingCarrier,
      __isParties: this.postPsgrs,
      __isFares: fareSegments
    }
    // console.log(fareRulesObj)
    let frUrl = this.__ms.tktBaseUrl + 'Air-Service/AirAvailability/AirFareRules';
    this.__ms.postData(frUrl, fareRulesObj).subscribe(res => {
      //console.log(res)
      this.fareRules = res['Rules']['Paragraph'];
    })
    jQuery('#view_fare_rules').modal('show');
  } //

  jazzCashPost(formInputs) {
    this.paymentFlag = 5;
    let jazzCashUrl = this.__ms.backEndUrl + 'Ticket/jazzCash';
    let jazzCashObj = Object.assign(formInputs, this.travellersObj, { _token: localStorage.getItem("paxToken"), _paymentFlag: this.paymentFlag });
    this.__ms.postData(jazzCashUrl, jazzCashObj).subscribe(res => {
      //console.log(JSON.stringify(res))
      // localStorage.setItem("paxToken", res['jwt']);
      this.jazzCashForm = res['inputs'];
      setTimeout(function () {
        jQuery('#jazzCashForm').html(res['inputs'])
        // jQuery('#jazzCashForm').submit()
      }, 1000)
    })
  } // END FUNCTION
  getIssuingCountriesList() {
    this.__ms.getData(this.__ms.backEndUrl + 'Ticket/issuingCountries').subscribe(res => {
      this.issuingCountries = res.data;
    });
  }
  getPaymentGateways() {
    this.__ms.getData(this.__ms.backEndUrl + 'Ticket/paymentGateways').subscribe(resp => {
      if (resp.status) {
        this.paymentGateways = resp.data;
      }
    })
  }
  // Insert PNR Data into DB
  insertPNR(__siPnr) {
    let payload = {
      "__isView": "W",
      "__isAction": "C",
      "__isVendorId": 1,
      "__isAgentId": 0,
      "__isParantId": 0,
      "__isUserId": 0,
      "__isAirType": (this.__ms.__isAirType == '' ? "O" : this.__ms.__isAirType),
      "__isPnr": __siPnr,
      "__isAirToken": this.__ms.__isAirToken
    }
    this.__ms.postData(this.__ms.tktBaseUrl + 'Air-Service/AirAvailability/AirItinerary', payload).subscribe(resp => {
      console.log('PNR:', resp)
    });
  }
  


  
} // END CLASS
