import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatDatepicker, MatSelect, MatOption } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { count } from 'rxjs/operators';
import { MainService } from 'src/app/services/main.service';
import { AirPortsPipe } from 'src/app/air-ports.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-flight-booking',
  templateUrl: './flight-booking.component.html',
  styleUrls: ['./flight-booking.component.css'],
  providers: [DatePipe, AirPortsPipe]
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
  flightSegments:object = null;
  flightPricing:object;
  travellersObj:object;

  cnnStart:number = 1;
  infStart:number = 1;

  isLinear = true;
  // @Input();
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
  travellersForm: FormGroup;
  passengersArr: FormArray;
  constructor(private __fb: FormBuilder, private __actRouter:ActivatedRoute, private __router: Router, private __ms:MainService) { }

  ngOnInit() {
    // this.flightInfo = this.__ms.FlightInfo;
    this.flightInfo = JSON.parse(localStorage.getItem('flightInfo'));
    
    let airByTagObj:any = this.__ms.airByTagObj(this.flightInfo.tagID);
    this.__ms.postData(this.__ms.byTagUrl, airByTagObj).subscribe(res => {
      if(!res['errorCode']){
        console.log(res)
      this.flightSegments = res['AirItinerary']['OriginDestinationOptions']['OriginDestinationOption'][0]['FlightSegment'];
      this.flightPricing = res['AirItineraryPricingInfo'][0];
      // this.airRevalidate(res);
      }else{
            
      }
    })

    this.adtQty = Number(this.flightInfo.adults);
    this.cnnQty = Number(this.flightInfo.children);
    this.infQty = Number(this.flightInfo.infants);
    
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
      passengersArr: this.__fb.array([this.setPassengerArr()])
    });
    
    let TotalPsgrs:number = this.adtQty + this.cnnQty + this.infQty;
    if(TotalPsgrs > 0){
      // this.cnnStart = this.adtQty;
      this.cnnStart = this.adtQty + 1;
      if(this.cnnQty > 0){
      }

      if(this.infQty > 0){
        this.infStart = (this.adtQty + this.cnnQty )+ 1;
      }

      for(let i = 1; i < TotalPsgrs; i++){
        // this.setPassengerArr();
        this.passengersArr = this.travellersForm.get('passengersArr') as FormArray;
        this.passengersArr.push(this.setPassengerArr());
      }
    }
    console.log('passengersArr', this.travellersForm.get('passengersArr'))

    
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

  setPassengerArr():FormGroup{
    return this.__fb.group({
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      docType: ['', Validators.required],
      cnic: ['', Validators.required],
      cnicExp: ['', Validators.required],
      issuingCountry: ['', Validators.required],
      nationality: ['', Validators.required],
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
    console.log(formInputs)
    let postPsgrs = [{
      __isType: 'ADT',
      __isValue: this.adtQty
    }];
    if(this.cnnQty > 0){
      postPsgrs.push({__isType: 'CNN',
      __isValue: this.cnnQty})
    }
    if(this.infQty > 0){
      postPsgrs.push({__isType: 'INF',
      __isValue: this.infQty})
    }

    let postTravellers = [];
    for(var i = 0; i < formInputs.passengersArr.length; i++){
      let tvlDob = formInputs.passengersArr[i].dob;
      this.calcTrvlType(tvlDob, this.flightInfo.dptDate);
      postTravellers.push({
        __isPrefix: '',
      });
    }
    

    this.travellersObj = {
      phoneNo: formInputs.phoneNo,
      emailAddress: formInputs.emailAddress,
      ticketAmount: this.flightPricing['ItinTotalFare']['TotalFare']['Amount'],
      __isTravelDate: this.flightInfo.dptDate,
      __isFlightType: this.flightInfo.flightType,
      passengers :postPsgrs,
    }
    // let step1Url = 'http://localhost/rgtapp/index.php/services/Ticket/reservation';
    // this.__ms.postData(step1Url, formInputs).subscribe(res => {
    //   console.log(res)
    // })
  }

  calcTrvlType(dob, dptDate){
    dob = new Date(dob);
    dptDate = new Date(dptDate);
    console.log('days = ',Math.round((dptDate-dob)/(1000*60*60*24)));
  }

}
