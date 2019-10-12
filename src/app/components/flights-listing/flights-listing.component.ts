import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../../services/main.service';
import { DatePipe } from '@angular/common';
import { AirPortsPipe } from '../../air-ports.pipe';
import { SecondsPipePipe } from '../../pipes/seconds-pipe.pipe';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker, MatAutocomplete, MatInput, MatSelect, MatRadioButton } from '@angular/material';
import { map } from 'rxjs/operators';
// import { HomeComponent } from '../home/home.component';
import { CookieService } from 'ngx-cookie-service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FilterAirlineNamePipe } from '../../pipes/filter-airline-name.pipe';
declare var jQuery;

@Component({
  selector: 'app-flights-listing',
  templateUrl: './flights-listing.component.html',
  styleUrls: ['./flights-listing.component.css'],
  providers: [DatePipe, AirPortsPipe, SecondsPipePipe, FilterAirlineNamePipe]
})
export class FlightsListingComponent implements OnInit {
  @Input()
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;
  flightSearch: FormGroup;
  queryParams: any;
  frmObj: any;
  availableFlights: any;
  moreFlights = [];
  defaultPage: number = 0;
  flightsUrl: any;
  byTagUrl: any;
  revalidateUrl: any;
  flightType: any;
  dptDate: any;
  rtnDate: any;
  oLocation: any;
  oLocationName: any = localStorage.getItem('oLocation');
  dLocationName: any = localStorage.getItem('dLocation');
  dLocation: any;
  cabin: any;
  prefAirline: any;
  adults: any;
  children: any;
  infant: any;
  adtQty: number;
  cnnQty: number;
  infQty: number;
  clientPhone: any;
  pageUrl: string;
  Offset: number = 1;

  flyingFromSectors: any;
  flyingToSectors: any;

  stopFilteritems = [
    { checked: !1, value: 0, text: "Non Stop" },
    { checked: !1, value: 1, text: "1 Stop" },
    { checked: !1, value: 2, text: "2 Stops" }
  ];
  preferredClasses: object = [
    { value: "Y", label: "Economy" },
    { value: "S", label: "Economy Premium" },
    { value: "C", label: "Business" },
    { value: "F", label: "First" }
  ];

  flightTypeitems = [{ "label": "OneWay", "name": "flightType", "value": "OneWay", "checked": false },
  { "label": "Return", "name": "flightType", "value": "Return", "checked": true }];

  filterAirlines: any;
  responseAirlines = [];
  responseAirlinesUnique = [];
  stopFilterValue = [];
  airlineFilterValue = [];
  loadingMore: boolean = false;
  passengerError: any;
  isReturn: boolean;
  editMode: boolean = false;

  revalidateObj: any;
  msideNav: boolean = false;
  mbyTag = null;
  mOriginDestinationOptions = [];
  mFareDetailsOption = {AirItineraryPricingInfo:[{'PTC_FareBreakdowns':{'PTC_FareBreakdown':''}}]};

  mChangeSearch: boolean = false;
  currDate: Date = new Date();
  cookieObj;
  sideForm: boolean;
  deviceFullInfo = null;
  browser = null;
  operatingSys = null;
  // VARIABLES FOR PRICE RANGE SLIDER
  minPrice: number = 0;
  maxPrice: number = 0;
  options = {
    floor: 0,
    ceil: 0
  };
  // END VARIABLES FOR PRICE RANGE SLIDER
  constructor(private __actRouter: ActivatedRoute, private __ms: MainService, private __router: Router,
    private __fb: FormBuilder, private __cookieService: CookieService, private __device: DeviceDetectorService) {
    // window.scroll(0, 0);
    this.deviceFullInfo = this.__device.getDeviceInfo();
    this.browser = this.__device.browser;
    this.operatingSys = this.__device.os;
    console.log(this.mFareDetailsOption)

    if (this.__device.isMobile()) {
      this.sideForm = true;
    }
    this.__router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    __actRouter.params.subscribe(val => {
      // put the code from `ngOnInit` here
      // console.log(val)
      // console.log('Here again')
    });
  }
  ngAfterViewInit() {
    this.ngOnInit(false);
  }
  // trackElement(index: number, element: any) {
  //   let x = Math.floor((Math.random() * 10) + element.ElapsedTime);
  //   console.log(x);
  //   // return element ? element.guid : null
  //   return x;
  // }
  ngOnInit(pageLoad = true) {
    this.queryParams = this.__actRouter.snapshot.queryParams;
    this.flightsUrl = this.__ms.flightsUrl;
    this.byTagUrl = this.__ms.byTagUrl;
    this.revalidateUrl = this.__ms.revalidateUrl;

    this.flightType = this.queryParams._flight_type;
    if (this.flightType == 'OneWay') {
      this.isReturn = false;
    } else if (this.flightType == 'Return') {
      this.isReturn = true;
    }
    this.dptDate = this.queryParams._departure_date;
    this.rtnDate = this.queryParams._return_date;
    this.oLocation = this.queryParams._flying_from;
    this.dLocation = (this.queryParams._flying_to);
    this.cabin = this.queryParams.cabin != null ? this.queryParams.cabin : 'Y';
    this.prefAirline = this.queryParams.prefAirline;
    this.adtQty = Number(this.queryParams.adults);
    this.cnnQty = Number(this.queryParams.children);
    this.infQty = Number(this.queryParams.infant);
    this.clientPhone = this.queryParams.clientPhone;
    this.pageUrl = this.queryParams.pageUrl;
    // this.Offset = 1;
    if (pageLoad) {
      this.fetchFlightsListing();
    }

    this.flightSearch = this.__fb.group({
      flightType: [this.flightType],
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

    this.flightSearch.controls['flyingFrom'].setValue(this.oLocation);

  }


  fetchFlightsListing(more: any = null) {
    this.loadingMore = false;
    // let frmCnn: any = '';
    // if (this.queryParams.children != "") {
    //   frmCnn = {
    //     "__isType": "CNN",
    //     "__isValue": this.queryParams.children
    //   }
    // }

    // let frmInf: any = '';
    // if (formInputs.infant != "") {
    //   frmInf = {
    //     "__isType": "INF",
    //     "__isValue": formInputs.infant
    //   }
    // }
    // console.log('FormValues:', formInputs);
    this.frmObj = {
      pageUrl: this.pageUrl,
      clientPhone: this.clientPhone,
      ipAddress: this.__ms.ipAddress,
      browser: this.browser,
      operatingSys: this.operatingSys,
      deviceFullInfo: this.deviceFullInfo,
      __isView: "W",
      __isAction: "C",
      __isVendorId: 1,
      __isAgentId: 0,
      __isParantId: 0,
      __isUserId: 0,
      __isConnection: "N",
      __isFlightType: this.flightType,
      __isSectors: this.flightType == 'OneWay' ? [{
        __isDate: this.dptDate + "T00:00:00",
        __isOLocation: this.oLocation,
        __isDLocation: this.dLocation
      }] : [{
        __isDate: this.dptDate + "T00:00:00",
        __isOLocation: this.oLocation,
        __isDLocation: this.dLocation
      }, {
        __isDate: this.rtnDate + "T00:00:00",
        __isOLocation: this.dLocation,
        __isDLocation: this.oLocation
      }],
      __isCabin: this.cabin,
      __isCurrency: "",
      __isStop: "",
      __isAirLine: this.prefAirline,
      __isBlackListed: "",
      __isFlight: "50",
      __isLimit: "50",
      __isOffset: "1",
      __isTravellers: [{
        __isType: "ADT",
        __isValue: this.adtQty
      }, this.cnnQty > 0 ? {
        __isType: "CNN",
        __isValue: this.cnnQty
      } : "", this.infQty > 0 ? {
        __isType: "INF",
        __isValue: this.infQty
      } : ""]
    }
    // console.log(this.frmObj)
    // JUST FOR TESTING READING FLIGHTS FROM JSON FILE
    // if(!more){

    //   this.availableFlights = 'Loading';
    //   this.__ms.getJsonData('../../../assets/flightsListing.json').subscribe(res => {
    //     let e;
    //     this.availableFlights = res;
    //     console.log(this.availableFlights)
    //     if(res != null){
    //       if(res['OTA_AirLowFareSearchRS']['PricedItineraries']['PricedItinerary'].length > 0){
    //         this.availableFlights = res['OTA_AirLowFareSearchRS']['PricedItineraries']['PricedItinerary'];            
    //       }
    //     }

    //     this.availableFlights.forEach(element => {
    //       let eachAirline = element.AirItinerary.OriginDestinationOptions.OriginDestinationOption[0].FlightSegment[0].OperatingAirline.Code;
    //       this.responseAirlines.push({
    //         checked: !1,
    //         value: eachAirline,
    //         text: eachAirline
    //       });

    //     });
    //     this.loadingMore = true;
    //     this.responseAirlinesUnique = this.responseAirlines.filter((e = new Set, function(t) {
    //       return !e.has(t.value) && e.add(t.value)
    //     }));      
    //   });
    // }else{
    //   // this.moreFlights = '';
    //   jQuery('.loadingMore').show();
    //   this.__ms.getJsonData('../../../assets/flightsListingMore.json').subscribe(res => {
    //     let e;
    //     this.moreFlights[this.defaultPage] = res;
    //     if(res != null){
    //       if(res['OTA_AirLowFareSearchRS']['PricedItineraries']['PricedItinerary'].length > 0){
    //         this.moreFlights[this.defaultPage] = res['OTA_AirLowFareSearchRS']['PricedItineraries']['PricedItinerary'];
    //         jQuery('.loadingMore').hide();
    //       }
    //     }
    //     // console.log(this.moreFlights)
    //     this.moreFlights[this.defaultPage].forEach(element => {
    //       let eachAirline = element.AirItinerary.OriginDestinationOptions.OriginDestinationOption[0].FlightSegment[0].OperatingAirline.Code;
    //       this.responseAirlines.push({
    //         checked: !1,
    //         value: eachAirline,
    //         text: eachAirline
    //       });

    //     });
    //     this.loadingMore = true;
    //     this.responseAirlinesUnique = this.responseAirlines.filter((e = new Set, function(t) {
    //       return !e.has(t.value) && e.add(t.value)
    //     }));      
    //   });
    // }
    // END JUST FOR TESTING READING FLIGHTS FROM JSON FILE

    // RETRIEVE LIVE FLIGHTS BELOW
    if (!more) {
      this.__ms.postData(this.__ms.backEndUrl+"Ticket/sendFlightQueries", this.frmObj).subscribe(res => {

      });
      this.availableFlights = 'Loading';
      this.__ms.postData(this.flightsUrl, this.frmObj).subscribe(res => {
        let e;
        this.availableFlights = res;
        if (res != null) {
          this.__ms.__isAirToken = res['Token'];
          localStorage.setItem('__isAirToken', res['Token']);
          if (res['OTA_AirLowFareSearchRS']['PricedItineraries']['PricedItinerary'] && res['OTA_AirLowFareSearchRS']['PricedItineraries']['PricedItinerary'].length > 0) {
            this.availableFlights = res['OTA_AirLowFareSearchRS']['PricedItineraries']['PricedItinerary'];

            this.loadingMore = true;
          } else {
            this.availableFlights = null;
          }
          this.availableFlights.forEach((element, index) => {
            let lowestAmount = element.AirItineraryPricingInfo[0].ItinTotalFare.TotalFare.Amount;

            if(index == 0){
              this.minPrice = lowestAmount;
            }
            this.maxPrice = lowestAmount;

            let eachAirline = element.AirItinerary.OriginDestinationOptions.OriginDestinationOption[0].FlightSegment[0].OperatingAirline.Code;
            let airlineText = FilterAirlineNamePipe.prototype.transform(eachAirline);
            this.responseAirlines.push({
              checked: !1,
              value: eachAirline,
              text: (airlineText.length > 0 ? airlineText[0].slice(3) : airlineText),
              lowestAmount: lowestAmount
            });
          });
          
          this.loadingMore = true;
          this.responseAirlinesUnique = this.responseAirlines.filter((e = new Set, function (t) {
            return !e.has(t.value) && e.add(t.value)
          }));
        } else {
          this.availableFlights = null;
        }
      });
    } else {
      jQuery('.loadingMore').show();
      this.__ms.postData(this.flightsUrl, this.frmObj).subscribe(res => {
        let e;
        this.moreFlights[this.defaultPage] = res;
        if (res != null) {
          if (res['OTA_AirLowFareSearchRS']['PricedItineraries']['PricedItinerary'].length > 0) {
            this.moreFlights[this.defaultPage] = res['OTA_AirLowFareSearchRS']['PricedItineraries']['PricedItinerary'];
            jQuery('.loadingMore').hide();
            if (res['OTA_AirLowFareSearchRS']['PricedItineraries']['PricedItinerary'].length < 10) {
              this.loadingMore = false;
            }
          }
        }
        // console.log(this.moreFlights)
        this.moreFlights[this.defaultPage].forEach(element => {
          let eachAirline = element.AirItinerary.OriginDestinationOptions.OriginDestinationOption[0].FlightSegment[0].OperatingAirline.Code;
          this.responseAirlines.push({
            checked: !1,
            value: eachAirline,
            text: eachAirline
          });

        });
        // this.loadingMore = true;
        this.responseAirlinesUnique = this.responseAirlines.filter((e = new Set, function (t) {
          return !e.has(t.value) && e.add(t.value)
        }));
      });
    }
    // RETRIEVE LIVE FLIGHTS END
    // window.scroll(0, 100);
    // setTimeout(() => {
    //   window.scroll(0,0);
    // }, 500);

  }

  flightDetailsToggle(ev, other?) {
    jQuery('#' + ev.target.id).hide();
    let currSpan = ev.target.id;
    let currId = currSpan.split('_')[1];
    if(other == 'FBD'){
      if (currSpan.indexOf('FBDplus') == -1) {
        jQuery('#FBDplus_' + currId).show();
      } else {
        jQuery('#FBDminus_' + currId).show();
      }
    } else {
      if (currSpan.indexOf('plus') == -1) {
        jQuery('#plus_' + currId).show();
      } else {
        jQuery('#minus_' + currId).show();
      }
    }
  }

  stopFilters(t, n, rows = null) {
    var e, l = "";
    if (!rows) {
      ("d" == n ? (e = jQuery(".eachRow"), l = "d-sm-block") : "m" == n && (e = jQuery(".eachRowM"), l = "d-block"))
    } else {
      ("d" == n ? (e = jQuery(".eachRow"), l = "d-sm-block") : "m" == n && (e = jQuery(".eachRowM"), l = "d-block"))
      e = rows;
    }
    this.stopFilterValue = t;
    if (this.stopFilterValue.length > 1) {
      this.stopFilterValue.sort();
      var i = this.stopFilterValue;
      e.each(function () {
        var t = jQuery(this);
        t.addClass(l), t.show();
        for (var n = 0; n < i.length; n++) {
          var e = i[n];
          if (0 == e) {
            var a = t.find(".stop_" + (e + 1)),
              o = t.find(".stop_" + (e + 2));
            (a.length > 0 || o.length > 0) && (t.removeClass(l), t.hide())
          } else t.find(".stop_" + e).length > 0 && (t.addClass(l), t.show())
        }
      })
    } else if (1 == this.stopFilterValue.length) {
      var a = this.stopFilterValue[0];
      e.each(function () {
        var t = jQuery(this);
        if (0 == a) {
          var n = t.find(".stop_" + (a + 1)),
            e = t.find(".stop_" + (a + 2));
          n.length > 0 || e.length > 0 ? (t.removeClass(l), t.hide()) : (t.addClass(l), t.show())
        } else {
          t.removeClass(l), t.hide()
          if (t.find(".stop_" + a).length > 0) {
            t.addClass(l), t.show()
          }
        }
      })
    } else 0 == this.stopFilterValue.length && (e.addClass(l), e.show())
  }

  StopAirlineFilters(stopsArr, airlinesArr, e) {
    var l, i = "";
    ("d" == e ? (l = jQuery(".eachRow"), i = "d-sm-block") : "m" == e && (l = jQuery(".eachRowM"), i = "d-block"))

    if (stopsArr.length > 0 && airlinesArr.length > 0) {
      this.airlineFiltersOnly(airlinesArr, e);
    } else {
      l.addClass(i), l.show()
    }

    let remainingRows = jQuery('.rowsParent').find('.eachRow.' + i);

    this.stopFilters(stopsArr, 'd', remainingRows);
  }

  airlineFiltersOnly(t, n) {
    var e, l = "";
    if ("d" == n ? (e = jQuery(".eachRow"), l = "d-sm-block") : "m" == n && (e = jQuery(".eachRowM"), l = "d-block"), this.airlineFilterValue = t, this.airlineFilterValue.length > 0) {
      var i = this.airlineFilterValue;
      e.each(function () {
        var t = jQuery(this);
        console.log('t:', t)
        t.removeClass(l), t.hide();
        for (var n = 0; n < i.length; n++) t.find("." + i[n]).length > 0 && (t.addClass(l), t.show())
      })
    } else e.addClass(l), e.show()
  }

  countAfterFilters = function (t) {
    var n;
    "d" == t ? n = jQuery(".eachRow.d-sm-block") : "m" == t && (n = jQuery(".eachRowM.d-block")), 0 == n.length ? jQuery(".afterFilters").show() : jQuery(".afterFilters").hide()
  }

  airlineFilters(t, n, e) {
    // console.log("airline:", [t, n, e])
    var l = t.source.value;
    if (t.checked) "airline" == n ? this.airlineFilterValue.push(l) : "stop" == n && this.stopFilterValue.push(l);
    else if ("airline" == n) {
      var i = this.airlineFilterValue.indexOf(l);
      this.airlineFilterValue.splice(i, 1)
    } else "stop" == n && (i = this.stopFilterValue.indexOf(l), this.stopFilterValue.splice(i, 1));
    this.stopFilterValue.sort();
    var a, o = this.stopFilterValue,
      r = this.airlineFilterValue,
      s = "";
    "m" == e ? (a = jQuery(".eachRowM"), s = "d-block") : "d" == e && (a = jQuery(".eachRow"), s = "d-sm-block"), o.length > 0 && 0 == r.length ? this.stopFilters(o, e) : o.length > 0 && r.length > 0 ? this.StopAirlineFilters(o, r, e) : 0 == o.length && r.length > 0 ? this.airlineFiltersOnly(r, e) : 0 == o.length && 0 == r.length && (a.addClass(s), a.show()), this.countAfterFilters(e)
  }

  filterFlyingFrom(ev) {
    this.flyingFromSectors = this.__ms.locationsJson().pipe(
      map(sectors => this.__ms.__filterFlyFrom(sectors, ev.target.value)),
    )
    // this.airlineSectors = this.__ms.getJsonData('../../assets/js/locations.json')
    //   .pipe(
    //     map(sectors => this.__filterFlyFrom(sectors, ev.target.value)),
    //   )
  }

  filterFlyingTo(ev) {
    this.flyingToSectors = this.__ms.locationsJson().pipe(
      map(sectors => this.__ms.__filterFlyTo(sectors, ev.target.value)),
    )
    // this.airlineSectors = this.__ms.getJsonData('../../assets/js/locations.json')
    //   .pipe(
    //     map(sectors => this.__filterFlyFrom(sectors, ev.target.value)),
    //   )
  }

  incrementNumber(type) {
    this.passengerError = '';
    switch (type) {
      case 'adults': {
        this.adtQty += 1;
        this.flightSearch.controls['adults'].setValue(this.adtQty);
        break;
      }
      case 'children': {
        this.cnnQty += 1;
        this.flightSearch.controls['children'].setValue(this.cnnQty);
        break;
      }
      case 'infant': {
        this.infQty += 1;
        this.flightSearch.controls['infant'].setValue(this.infQty);
        break;
      }
    }
    this.passengerError = '';
    if (this.adtQty + +this.cnnQty + +this.infQty > 9) {
      this.passengerError = 'Please Select Upto 9 Passengers!';
      return false;
    }
  }

  decrementNumber(type) {
    switch (type) {
      case 'adults': {
        this.adtQty--;
        this.adtQty < 1 ? this.adtQty = 1 : this.adtQty;
        this.flightSearch.controls['adults'].setValue(this.adtQty);
        break;
      }
      case 'children': {
        this.cnnQty--;
        this.cnnQty < 0 ? this.cnnQty = 0 : this.cnnQty;
        this.flightSearch.controls['children'].setValue(this.cnnQty);
        break;
      }
      case 'infant': {
        this.infQty--;
        this.infQty < 0 ? this.infQty = 0 : this.infQty;
        this.flightSearch.controls['infant'].setValue(this.infQty);
        break;
      }
    }

    // jQuery('#flightPaxDropdownMenu').toggle();
    this.passengerError = '';
    if (this.adtQty + +this.cnnQty + +this.infQty <= 0) {
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
    // console.log(this.isReturn)
  }

  addDays = function (days, dptDate?) {
    let date = new Date();
    if (dptDate) {
      date = new Date(dptDate);
    }
    date.setDate(date.getDate() + days);
    return date;
  }

  changeSearch(formInputs) {
    // this.__hm.searchFlights(formInputs);
    if (this.flightSearch.valid) {
      formInputs.departureDate = this.__ms.setDateFormat(formInputs.departureDate);
      formInputs.returnDate = this.__ms.setDateFormat(formInputs.returnDate);

      localStorage.setItem('oLocation', formInputs.flyingFrom);
      localStorage.setItem('dLocation', formInputs.flyingTo);

      let flightType = formInputs.flightType;
      let dptDate = formInputs.departureDate;
      let oLocation = (formInputs.flyingFrom).split(',')[0];
      let dLocation = (formInputs.flyingTo).split(',')[0];
      let cabin = formInputs.preferredClass != null ? formInputs.preferredClass : 'Y';
      let prefAirline: any = formInputs.PreferredAirline != null ? formInputs.PreferredAirline.slice(0, 2) : 0;
      let adtQty = formInputs.adults;
      let cnnQty = formInputs.children == null ? 0 : formInputs.children;
      let infQty = formInputs.infant == null ? 0 : formInputs.infant;
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
      this.queryParams = this.__actRouter.snapshot.queryParams;
      // console.log(this.queryParams);
      // return true;
      this.dptDate = formInputs.departureDate;
      this.rtnDate = this.queryParams._return_date;
      this.oLocation = (formInputs.flyingFrom).split(',')[0];
      this.dLocation = (formInputs.flyingTo).split(',')[0];
      this.cabin = formInputs.preferredClass != null ? formInputs.preferredClass : 'Y';
      this.prefAirline = formInputs.PreferredAirline != null ? formInputs.PreferredAirline.slice(0, 2) : 0;
      this.adtQty = Number(formInputs.adults);
      this.cnnQty = Number(formInputs.children);
      this.infQty = Number(formInputs.infant);
      // this.Offset = 1;
      this.fetchFlightsListing();
      this.editMode = false;
    }

  }

  onScroll() {
    // console.log('scrolled');
    // if (this.loadingMore == true) {
    //   this.Offset = this.Offset + 10;
    //   this.defaultPage = this.defaultPage + 1;
    //   this.fetchFlightsListing('more');
    // } //

  } //

  airByTag(Itinerary, i, flag?) {
    let vCarrier = Itinerary.TPA_Extensions.ValidatingCarrier.Code;
    let tagID = Itinerary.TPA_Extensions.TagID;
    let flightInfo = { 'flightType': this.flightType, 'origin': this.oLocation, 'destination': this.dLocation, 'adults': this.adtQty, 
    'children': this.cnnQty, 'infants': this.infQty, 'dptDate': this.dptDate, 'rtnDate': this.rtnDate, 'cabin': this.cabin, 
    'prefAirline': this.prefAirline, 'tagID': tagID, 'vCarrier': vCarrier };
    localStorage.setItem('flightInfo', JSON.stringify(flightInfo));
    localStorage.setItem('OriginDestinationOption', JSON.stringify(Itinerary))
    this.__ms.FlightInfo = flightInfo;

    if (!flag) {
      jQuery('#isValidating_' + i).show();
    } else if (flag == 'M') { // mobile view Details
      this.mbyTag = Itinerary;
      this.mOriginDestinationOptions = Itinerary.AirItinerary.OriginDestinationOptions.OriginDestinationOption;
      this.msideNav = true;
      return false;
    } else if (flag == 'MS') { // Mobile Select
      jQuery('#isValidatingM_' + i).show();
      // this.mbyTag = null;
      // this.mOriginDestinationOptions = null;
      // this.msideNav = true;
    }
    // If Validating Carrier is Serene Airline (No need to Re-Validate)
    if(vCarrier == 'ER') {
      this.__router.navigate(["/flight-booking"], {
        queryParams: {
          _flight_type: this.flightType,
          _flying_from: this.oLocation,
          _flying_to: this.dLocation,
          _departure_date: this.dptDate,
          _return_date: this.rtnDate,
          adults: this.adtQty,
          children: this.cnnQty,
          infant: this.infQty,
          cabin: this.cabin,
          prefAirline: this.prefAirline
        }
      });
    } else {
      // let tagID = Itinerary.TPA_Extensions.tagID;
      let airByTagObj: any = this.__ms.airByTagObj(tagID);
      this.__ms.postData(this.byTagUrl, airByTagObj).subscribe(res => {
        // this.__ms.getJsonData('../../../assets/airByTag.json').subscribe(res => {
        if (!flag) {
          if (!res['errorCode']) {
            this.airRevalidate(res, i);
          } else {
            jQuery('#isValidatingMsg_' + i).html('Flight Not Valid, try again later').css('color', 'red');
            setTimeout(() => {
              jQuery('#isValidating_' + i).hide();
            }, 2000);
          }
        } else if (flag == 'M') { // it is mobile view flight details only
          // console.log(res)
          if (!res['errorCode']) {
            this.mbyTag = res;
            this.mOriginDestinationOptions = res['AirItinerary']['OriginDestinationOptions']['OriginDestinationOption'];
          } else {
            this.mbyTag = 'Error';
            // console.log(this.mbyTag)
            // jQuery('#mbyTagError').html('Flight Not Valid, try again later').css('color', 'red').show();
            // setTimeout(() => {
            //   jQuery('#mbyTagError').hide();
            // }, 2000);
          }
        } else if (flag == 'MS') { // it is Mobile Select flight
          // console.log(res)
          if (!res['errorCode']) {
            this.airRevalidate(res, i, flag);
          } else {
            jQuery('#isValidatingMsgM_' + i).html('Flight Not Valid, try again later').css('color', 'red');
            setTimeout(() => {
              jQuery('#isValidatingM_' + i).hide();
            }, 2000);
          }
        }
      })
    }

  } //

  airRevalidate(byTagRes, i, flag?) {
    let clsMsg = 'isValidatingMsg_';
    let cls = 'isValidating_';
    if (flag) {
      clsMsg = 'isValidatingMsgM_';
      cls = 'isValidatingM_';
    }
    // if(!flag){
    //   jQuery('#isValidatingMsg_' + i).html('Validating Flight . . .');
    // }else{
    // }
    jQuery('#' + clsMsg + i).html('Validating Flight . . .');
    let revalidateRes = this.__ms.revalidateReq(byTagRes, this.adtQty, this.cnnQty, this.infQty, this.dptDate);
    revalidateRes.subscribe(res => {
      if (res['_isMessage'] == 'OK') {
        this.__router.navigate(["/flight-booking"], {
          queryParams: {
            _flight_type: this.flightType,
            _flying_from: this.oLocation,
            _flying_to: this.dLocation,
            _departure_date: this.dptDate,
            _return_date: this.rtnDate,
            adults: this.adtQty,
            children: this.cnnQty,
            infant: this.infQty,
            cabin: this.cabin,
            prefAirline: this.prefAirline
          }
        });
      } else {
        jQuery('#' + clsMsg + i).html(res['_isMessage']).css('color', 'red');
        setTimeout(() => {
          jQuery('#' + cls + i).hide();
        }, 2000);
      }
    })
    // console.log('validatemsg',revalidateRes)

    // const revalidateSectors = [];
    // let tagSectors = byTagRes['AirItinerary']['OriginDestinationOptions']['OriginDestinationOption'][0]['FlightSegment'];
    // tagSectors.forEach(element => {

    //   let eachSector = {
    //     "__isADate": this.__ms.setDateFormat(element.ArrivalDateTime),
    //     "__isATime": this.__ms.setDateFormat(element.ArrivalDateTime, 't'),
    //     "__isDDate": this.__ms.setDateFormat(element.DepartureDateTime),
    //     "__isDTime": this.__ms.setDateFormat(element.DepartureDateTime, 't'),
    //     "__isFlightNo": element.FlightNumber,
    //     "__isParty": (this.adtQty + this.cnnQty),
    //     "__isCabin": element.ResBookDesigCode,
    //     "__isMarriage": element.MarriageGrp == 'I' ? 'X' : element.MarriageGrp,
    //     "__isStatus": "NN",
    //     "__isEquipType": element.Equipment[0].AirEquipType,
    //     "__isOLocation": element.DepartureAirport.LocationCode,
    //     "__isDLocation": element.ArrivalAirport.LocationCode,
    //     "__isMkAirLine": element.MarketingAirline.Code,
    //     "__isOpAirLine": element.OperatingAirline.Code
    //   }
    //   revalidateSectors.push(eachSector);
    // });

    // let revalidatePsgrs = [{
    //   "__isType": "ADT",
    //   "__isValue": this.adtQty
    // }];

    // if(this.cnnQty > 0){
    //   revalidatePsgrs.push({
    //     "__isType": "CNN",
    //     "__isValue": this.cnnQty
    //   });
    // }

    // if(this.infQty > 0){
    //   revalidatePsgrs.push({
    //     "__isType": "INF",
    //     "__isValue": this.infQty
    //   });
    // }

    // this.revalidateObj = this.__ms.revalidateObj(this.dptDate, revalidatePsgrs, revalidateSectors);

    // // console.log(this.revalidateObj)
    // this.__ms.postData(this.revalidateUrl, this.revalidateObj).subscribe(res => {
    //   if(res['_isMessage'] == 'OK'){
    //     this.__router.navigate(["/flight-booking"], {
    //       queryParams: {
    //           _flight_type: this.flightType,
    //           _flying_from: this.oLocation,
    //           _flying_to: this.dLocation,
    //           _departure_date: this.dptDate,
    //           _return_date: this.rtnDate,
    //           adults: this.adtQty,
    //           children: this.cnnQty,
    //           infant: this.infQty,
    //           cabin: this.cabin,
    //           prefAirline: this.prefAirline
    //       }
    //     });
    //   }else{
    //     jQuery('#isValidatingMsg_' + i).html(res['_isMessage']).css('color', 'red');
    //     setTimeout(() => {
    //       jQuery('#isValidating_' + i).hide();
    //     }, 2000);
    //   }
    // })
  } // 

  showFlightDetailsM(Itinerary, i) {
    this.msideNav = true;
    this.airByTag(Itinerary, i, 'M');
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

      this.cookieObj = [{ name: 'flightType', value: flightType }, { name: 'flyingFrom', value: formInputs.flyingFrom }, { name: 'flyingTo', value: formInputs.flyingTo }, { name: 'departureDate', value: formInputs.departureDate }, { name: 'returnDate', value: formInputs.returnDate }, { name: 'adults', value: formInputs.adults }, { name: 'children', value: formInputs.children }, { name: 'infant', value: formInputs.infant }, { name: 'preferredClass', value: formInputs.preferredClass }, {
        name: 'prefAirline', value:
          formInputs.prefAirline
      }]

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
  // 20-09-2019 03:27 PM
  showFareDetailsPopup(Itinerary, i) {
    console.log('MFareDetailsOption:', Itinerary)
    this.mFareDetailsOption = Itinerary;
  }

  closeDropDown(ev) {
    // console.log(ev.path[2]);
    jQuery(ev.path[2]).removeClass('show')
    jQuery(ev.path[3]).removeClass('show')
  }
  desktopSideForm() {
    this.sideForm = true;
  }

  rangeUpdated(){
    let newMin = this.minPrice
    let newMax = this.maxPrice
    
    var priceInputs = jQuery('.priceInput');

    jQuery.each(priceInputs, function(index, eachInput) {
      /* iterate through array or object */
      let eachVal:number = parseInt(jQuery(eachInput).val())
      if(eachVal < newMin || eachVal > newMax){
        jQuery(eachInput).parent().removeClass('d-sm-block');
          
      }else{
        jQuery(eachInput).parent().addClass('d-sm-block');                    
      }
    });
  }
}
