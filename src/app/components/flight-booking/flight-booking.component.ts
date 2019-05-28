import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatDatepicker, MatSelect, MatOption, MatButton } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { count } from 'rxjs/operators';
import { MainService } from 'src/app/services/main.service';
import { AirPortsPipe } from 'src/app/air-ports.pipe';
import { DatePipe } from '@angular/common';
import { MatStep, MatStepper } from '@angular/material';
import { DateFormatPipe } from 'src/app/pipes/date-format.pipe';
declare var jQuery;

@Component({
  selector: 'app-flight-booking',
  templateUrl: './flight-booking.component.html',
  styleUrls: ['./flight-booking.component.css'],
  providers: [DatePipe, DateFormatPipe, AirPortsPipe]
})


export class FlightBookingComponent implements OnInit {

  flightType:any;
  dptDate:any;
  rtnDate:any;
  oLocation:any;
  oLocationName:any = localStorage.getItem('oLocation');
  dLocation:any;
  dLocationName:any = localStorage.getItem('dLocation');
  cabin:any;
  prefAirline:any;
  adtQty:number;
  cnnQty:number;
  infQty:number;
  flightInfo:any;
  OriginDestinationOptions = null;
  // flightSegments = null;
  flightPricing:object;
  travellersObj:object;
  tagExpired:boolean = false;
  byTagResponse;

  cnnStart:number = 1;
  infStart:number = 1;

  isLinear = true;
  @Input('form') form: NgForm;
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
  @ViewChild('mystepp') mystepp: MatStep;
  @ViewChild('stepper') stepper: MatStepper;
  // @ViewChild('creditCardButton') MatButton;
  travellersForm: FormGroup;
  docNumPlaceholder = 'Document #';
  docExpPlaceholder = 'Document Expiry Date';
  passengersArr: FormArray;
  paymentForm: FormGroup;
  creditCardForm;
  // creditCardButton;

  cardTypeitems = [{"label": "Visa", "value": "visa", "checked": true},
  {"label": "Master", "value": "master", "checked": false}];

  monthsNames = [{"name": "January", "value": 0}, {"name": "February", "value": 1}, {"name": "March", "value": 2}, {"name": "April", "value": 3}, {"name": "May", "value": 4}, {"name": "June", "value": 5}, {"name": "July", "value": 6}, {"name": "August", "value": 7}, {"name": "September", "value": 8}, {"name": "October", "value": 9}, {"name": "November", "value": 10}, {"name": "December", "value": 11}];
  monthItems = [];

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  yearItems = [];
  segmentInfoArr = [];
  referenceNo:string;
  currDate = new Date();
  maxPickerDate = [];
  minPickerDate = [];
  
  validatingCarrier:string;
  postPsgrs;
  fareRules = null;
  constructor(private __fb: FormBuilder, private __actRouter:ActivatedRoute, private __router: Router, private __ms:MainService, private __datepipe: DatePipe) { }

  ngOnInit() {
    // console.log(this.currentYear)
    // this.flightInfo = this.__ms.FlightInfo;
    this.flightInfo = JSON.parse(localStorage.getItem('flightInfo'));
    this.adtQty = Number(this.flightInfo.adults);
    this.cnnQty = Number(this.flightInfo.children);
    this.infQty = Number(this.flightInfo.infants);

    let airByTagObj:any = this.__ms.airByTagObj(this.flightInfo.tagID);
    this.__ms.postData(this.__ms.byTagUrl, airByTagObj).subscribe(res => {
      console.log(res)
      if(!res['errorCode']){
        this.byTagResponse = res;
        this.validatingCarrier = res['TPA_Extensions']['ValidatingCarrier']['Code'];
        this.OriginDestinationOptions = res['AirItinerary']['OriginDestinationOptions']['OriginDestinationOption'];
        // this.flightSegments = res['AirItinerary']['OriginDestinationOptions']['OriginDestinationOption'][0]['FlightSegment'];
        let party = this.adtQty + this.cnnQty;
        this.OriginDestinationOptions.forEach(element => {
          let flightSegments = element.FlightSegment;
          flightSegments.forEach(segment => {            
            let MarriageGrp = segment.MarriageGrp == 'I' ? 'X' : segment.MarriageGrp;
            this.segmentInfoArr.push({
                __isADate: this.__datepipe.transform(segment.ArrivalDateTime, "yyyy-MM-dd"),
                __isATime: this.__datepipe.transform(segment.ArrivalDateTime, "hh:mm:ss"),
                __isDDate: this.__datepipe.transform(segment.DepartureDateTime, "yyyy-MM-dd"),
                __isDTime: this.__datepipe.transform(segment.DepartureDateTime, "hh:mm:ss"),
                __isFlightNo: segment.FlightNumber,
                __isParty: party,
                __isCabin: segment.ResBookDesigCode,
                __isMarriage: MarriageGrp,
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
      // this.airRevalidate(res);
      }else{
         this.tagExpired = true;   
      }
    })
    

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
      phoneNo: ['', Validators.required],
      emailAddress: ['', Validators.required],
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
    if(this.adtQty > 1){
      this.passengersArr = this.travellersForm.get('passengersArr') as FormArray;
      for(let i = 1; i < this.adtQty; i++){
        this.passengersArr.push(this.setPassengerArr('ADT'));
        this.maxPickerDate.push(this.getValidDobDate(12));
        this.minPickerDate.push(this.getValidDobDate('100'))
      }
    }
    if(this.cnnQty > 0){
      this.passengersArr = this.travellersForm.get('passengersArr') as FormArray;
      for(let j = 0; j < this.cnnQty; j++){
        this.passengersArr.push(this.setPassengerArr('CNN'));
        this.maxPickerDate.push(this.getValidDobDate('2'));
        this.minPickerDate.push(this.getValidDobDate('12'))
      }

      this.postPsgrs.push({__isType: 'CNN',
      __isValue: this.cnnQty})
    }

    if(this.infQty > 0){
      this.passengersArr = this.travellersForm.get('passengersArr') as FormArray;
      this.infStart = (this.adtQty + this.cnnQty )+ 1;
      for(let j = 0; j < this.infQty; j++){
        this.passengersArr.push(this.setPassengerArr('INF'));
        this.maxPickerDate.push(this.getValidDobDate('0'));
        this.minPickerDate.push(this.getValidDobDate('2'))
      }

      this.postPsgrs.push({__isType: 'INF',
      __isValue: this.infQty})
    }
    console.log('passengersArr', this.travellersForm.get('passengersArr'))

    this.paymentForm = this.__fb.group({
      cardType: ["visa", Validators.required],
      cardNumber: ["", Validators.required],
      cvn: ["", Validators.required],
      expiryMonth: ["", Validators.required],
      expiryYear: ["", Validators.required],
      cardHolderFirstName: ["", Validators.required],
      cardHolderLastName: ["", Validators.required],
      cardHolderMobile: ["", Validators.required],
      cardHolderEmail: ["", Validators.required],
      address: ["", Validators.required],
      city: ["", Validators.required],
      zipCode: ["", Validators.required],
      state: ["", Validators.required],
      country: ["", Validators.required]
  })

    for (let i = 0; i < 10; i++) {      
      this.yearItems.push({"value": this.currentYear + i});
    }
    for (let j = 0; j < this.monthsNames.length; j++) {
      if(j >= this.currentMonth){
        this.monthItems.push(this.monthsNames[j]);
      }
    }
    
  }

  getValidDobDate = function(t) {
    var n = new Date(this.flightInfo.dptDate),
        e = n.setFullYear(n.getFullYear() - t, n.getMonth(), n.getDate());
    return this.__datepipe.transform(e, "yyyy-MM-dd"); //this.datePipe.transform(e, "yyyy-MM-dd")
  }

  changeDocType(ev){
    if(ev.value == 'P'){
      this.docNumPlaceholder = 'Passport #';
      this.docExpPlaceholder = 'Passport Expiry Date';
    }else if(ev.value == 'F'){
      this.docNumPlaceholder = 'CNIC #';
      this.docExpPlaceholder = 'CNIC Expiry Date';
    }
  }

  airRevalidate(byTagRes){
    let revalidateRes = this.__ms.revalidateReq(byTagRes, this.adtQty, this.cnnQty, this.infQty, this.flightInfo.dptDate);
    revalidateRes.subscribe(res => {
      if(res['_isMessage'] == 'OK'){
        //
      }else{
        //
      }
    })    
  } // 

  setPassengerArr(paxType):FormGroup{
    return this.__fb.group({
      psgType: [paxType, Validators.required],
      title: ["", Validators.required],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      dob: ["", Validators.required],
      docType: ["", Validators.required],
      cnic: ["", Validators.required],
      cnicExp: ["", Validators.required],
      issuingCountry: ["", Validators.required],
      nationality: ["", Validators.required],
    })
  }

  changeFlight(){
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

  reservation_step1(formInputs){
    // console.log(formInputs)    
    let postTravellers = [];
    for(var i = 0; i < formInputs.passengersArr.length; i++){
      postTravellers.push({
        __isType: formInputs.passengersArr[i].psgType,
        __isPrefix: formInputs.passengersArr[i].title,
        __isFirstName: formInputs.passengersArr[i].firstName,
        __isLastName: formInputs.passengersArr[i].lastName,
        __isDOB: formInputs.passengersArr[i].dob,
        __isCountry: formInputs.passengersArr[i].nationality,
        __isDocType: formInputs.passengersArr[i].docType,
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
      passengers : this.postPsgrs,
      travellers : postTravellers,
      segmentArr: this.segmentInfoArr
    }
    // console.log('postData',this.travellersObj)
    let step1Url = 'http://localhost/rgtapp/index.php/services/Ticket/reservation';
    this.__ms.postData(step1Url, this.travellersObj).subscribe(res => {
      console.log(res)
    this.referenceNo = res['ref_no'];
    })
    return true;
  }

  creditCardPost(formInputs){
    let creditCardUrl = 'http://localhost/rgtapp/index.php/services/Ticket/creditCard';
    let reservationObj = Object.assign(formInputs, this.travellersObj, this.segmentInfoArr, {refrenceNo: this.referenceNo});
    this.__ms.postData(creditCardUrl, reservationObj).subscribe(res => {
      console.log(res)
      localStorage.setItem("paxToken", res['jwt']);
      this.creditCardForm = res['inputs'];
      setTimeout(function() {
        jQuery('#creditCardForm').html(res['inputs'])
        jQuery('#creditCardForm').submit()
      }, 1000)
    })
    console.log(reservationObj)
  } //

  viewFareRules(){
    let fareBasis = this.byTagResponse['AirItineraryPricingInfo'][0]['PTC_FareBreakdowns']['PTC_FareBreakdown'][0]['FareBasisCodes']['FareBasisCode'];
    console.log('fareBasis',fareBasis);
    let fareSegments = [];
    let totSegs = 0;
    this.OriginDestinationOptions.forEach(element => {
      let flightSegments = element.FlightSegment;
      flightSegments.forEach(segment => {

        fareSegments.push({
          __isType:"0",
          __isDDate: this.__datepipe.transform(segment.DepartureDateTime, "yyyy-MM-dd"),
          __isADate: this.__datepipe.transform(segment.ArrivalDateTime, "yyyy-MM-dd"),
          __isOLocation: segment.DepartureAirport.LocationCode,
          __isDLocation: segment.ArrivalAirport.LocationCode,
          __isFareBasis: fareBasis[totSegs].content,
          __isCabin: segment.ResBookDesigCode
        })
        totSegs+=1;
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
    let frUrl = 'http://exaltedsys.com/Air-Service/AirAvailability/AirFareRules';
    this.__ms.postData(frUrl, fareRulesObj).subscribe(res => {
      console.log(res)
      this.fareRules = res['Rules']['Paragraph'];      
    })
    jQuery('#view_fare_rules').modal('show');      
  } // 
  
}