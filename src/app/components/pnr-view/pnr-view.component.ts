import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { AirPortsPipe } from 'src/app/air-ports.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pnr-view',
  templateUrl: './pnr-view.component.html',
  styleUrls: ['./pnr-view.component.css'],
  providers: [DatePipe, AirPortsPipe]
})
export class PnrViewComponent implements OnInit {
  queryParams;
  refNo;

  pnrResponse = null;
  persons = [];
  segmentYears = [];
  // itineraryInfo = [];
  reservationItems = [];
  itineraryRef:object;
  PNR:string;
  priceQuotes = [];
  pnrCreateDate:string = String(new Date().getFullYear());
  pnrBaseFare:number = 0;
  pnrTaxes:number = 0;
  pnrTotalFare:number = 0;
  pnrReceivedFrom;
  specialServices = [];
  constructor(private __actRouter: ActivatedRoute, private __ms: MainService) {
    window.scroll(0, 300);
  }

  ngOnInit() {
    this.queryParams = this.__actRouter.snapshot.queryParams;
    this.refNo = this.queryParams.__token;
    console.log('token:', localStorage.getItem("paxToken"));
    let flightInfoObj = {
      _refrenceNo: this.refNo,
      _token: localStorage.getItem("paxToken")
    } 
    // Object.assign({refrenceNo:refNo}, {token:localStorage.getItem("paxToken")})
    // let flightInfoUrl = 'http://localhost/rgtapp/index.php/services/Ticket/flightInfo';
    // this.__ms.postData(flightInfoUrl, flightInfoObj).subscribe(res => {
    //   console.log(res)
    //   if(res['res_flag'] == true){
    //     this.createPnr(res);
    //   }
    // })

    this.airItinerary();

  }

  createPnr(flightInfos){
    let pnrUrl = 'http://exaltedsys.com/Air-Service/AirAvailability/AirReservation';
    let pnrObj = {
      __isView: "W",
      __isAction: "C",
      __isVendorId: 1,
      __isAgentId: 0,
      __isParantId: 0,
      __isUserId: 0,
      __isFlightType: flightInfos.__isFlightType,
      __isFr: flightInfos.__isEmail,
      __isTo: flightInfos.__isEmail,
      __isCc: flightInfos.__isEmail,
      __isAirType: "O",
      __isTravelDate: flightInfos.__isTravelDate,
      __isReceivedFrom: "CheapFly",
      __isPhoneNumber: flightInfos.__isPhone,
      __isPassengers:flightInfos.passengers,
      __isSectors: flightInfos.segmentArr,
      __isTravellers: flightInfos.travellers
    } //  end pnr obj
    console.log(pnrObj)
    // this.__ms.postData(pnrUrl, pnrObj).subscribe(resp => {
    //   console.log(resp)
    // let pnr = 'JFLWVB'; // res['__isFlag'];
    // this.pnrCreated(pnr);
    // })
    // JFLWVB
  } // 

  pnrCreated(pnr){
    let pnrSaveUrl = 'http://localhost/rgtapp/index.php/services/Ticket/pnr';
    let pnrSaveObj = {
      _refrenceNo: this.refNo,
      pnr: pnr,
      _token: localStorage.getItem("paxToken")
    }
    this.__ms.postData(pnrSaveUrl, pnrSaveObj).subscribe(res => {
      console.log(res)
    })
  }

  airItinerary(){
    let itineraryUrl = 'http://exaltedsys.com/Air-Service/AirAvailability/AirItinerary';
    let itineraryObj = {
      __isView: "W",
      __isAction: "C",
      __isVendorId: 1,
      __isAgentId: 0,
      __isParantId: 0,
      __isUserId: 0,
      __isAirType: "O",
      __isPnr : "IMYIGE"
    }
    // this.__ms.postData(itineraryUrl, itineraryObj).subscribe(res => {
    //   console.log(res)
    //   this.pnrResponse = res;
    //   res['CustomerInfo']['PersonName'] instanceof Array ? this.persons = res['CustomerInfo']['PersonName'] : this.persons.push(res['CustomerInfo']['PersonName'])
      
    //   this.reservationItems = res['ItineraryInfo']['ReservationItems']['Item'];
    //   this.reservationItems.forEach(element => {
    //     let dtsplt = element.Air.attr.DepartureDateTime.split('T');
    //     let eachYear = dtsplt[0].split('-')[0];
    //     this.segmentYears.push(eachYear);
    //   })
    //   // console.log(this.segmentYears)
    //   this.PNR = res['ItineraryRef']['attr']['ID'];
    //   this.pnrCreateDate += '-' + (res['ItineraryRef']['Source']['attr']['CreateDateTime']).split('T')[0];
    //   this.specialServices = res['SpecialServices'];
      
    //   let psgBfare = 0;
    //   let psgTaxes = 0;
    //   this.priceQuotes = res['ItineraryInfo']['ItineraryPricing']['PriceQuote'];
    //   this.priceQuotes.forEach(element => {
    //     this.pnrBaseFare += Number(element.PricedItinerary.AirItineraryPricingInfo.ItinTotalFare.BaseFare.attr.Amount);
    //     this.pnrTaxes += Number(element.PricedItinerary.AirItineraryPricingInfo.ItinTotalFare.Taxes.Tax.attr.Amount);
    //   })
    //   this.pnrTotalFare = Number(this.pnrBaseFare) + Number(this.pnrTaxes);

    //   this.pnrReceivedFrom = res['ItineraryRef']['Source']['attr']['ReceivedFrom'];
    //   // console.log(this.pnrTotalFare)
    // })
    
    // GET RESPONSE FROM JSON FILE FOR TESTING
    this.__ms.getJSON('../assets/airItinerary.json').subscribe(res => {
      console.log(res)
      this.pnrResponse = res;
      res['CustomerInfo']['PersonName'] instanceof Array ? this.persons = res['CustomerInfo']['PersonName'] : this.persons.push(res['CustomerInfo']['PersonName'])
      
      this.reservationItems = res['ItineraryInfo']['ReservationItems']['Item'];
      this.reservationItems.forEach(element => {
        let dtsplt = element.Air.attr.DepartureDateTime.split('T');
        let eachYear = dtsplt[0].split('-')[0];
        this.segmentYears.push(eachYear);
      })
      // console.log(this.segmentYears)
      this.PNR = res['ItineraryRef']['attr']['ID'];
      this.pnrCreateDate += '-' + (res['ItineraryRef']['Source']['attr']['CreateDateTime']).split('T')[0];
      this.specialServices = res['SpecialServices'];
      
      let psgBfare = 0;
      let psgTaxes = 0;
      this.priceQuotes = res['ItineraryInfo']['ItineraryPricing']['PriceQuote'];
      this.priceQuotes.forEach(element => {
        this.pnrBaseFare += Number(element.PricedItinerary.AirItineraryPricingInfo.ItinTotalFare.BaseFare.attr.Amount);
        this.pnrTaxes += Number(element.PricedItinerary.AirItineraryPricingInfo.ItinTotalFare.Taxes.Tax.attr.Amount);
      })
      this.pnrTotalFare = Number(this.pnrBaseFare) + Number(this.pnrTaxes);

      this.pnrReceivedFrom = res['ItineraryRef']['Source']['attr']['ReceivedFrom'];
      // console.log(this.pnrTotalFare)
    })
  } // 

}
