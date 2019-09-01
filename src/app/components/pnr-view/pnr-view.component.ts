import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  ticketingItems = [];
  ticketNos = [];
  itineraryRef:object;
  PNR:string;
  priceQuotes = [];
  pnrCreateDate:string = String(new Date().getFullYear());
  pnrBaseFare:number = 0;
  pnrTaxes:number = 0;
  pnrTotalFare:number = 0;
  pnrReceivedFrom;
  validatingCarrier;
  specialServices = [];
  
  constructor(private __actRouter: ActivatedRoute, private __ms: MainService, private __router: Router) {
    window.scroll(0, 300);
  }

  ngOnInit() {
    this.queryParams = this.__actRouter.snapshot.queryParams;
    this.refNo = this.queryParams.__token;
    let flightInfoObj = {
      _refrenceNo: this.refNo,
      _token: localStorage.getItem("paxToken")
      // _flag: 'ccard'
    } 
    Object.assign({refrenceNo:this.refNo}, {token:localStorage.getItem("paxToken")})
    let flightInfoUrl = this.__ms.backEndUrl + 'Ticket/retFlightInfo';
    this.__ms.postData(flightInfoUrl, flightInfoObj).subscribe(res => {
      // console.log(res)
      // if(res['res_flag'] == true && res['OTC'] == false){
      //   let pnr = this.createPnr(res);
      //   this.pnrCreated(pnr);
      // }else if(res['res_flag'] == true && res['OTC'] == true){
      //   let pnr = this.createPnr(res);        
      //   this.__router.navigate(["/thank-you"], {
      //     // relativeTo: this.__route,
      //     queryParams: {
      //       _token: localStorage.getItem("paxToken")
      //     }
      //   });
      // }else if(res['res_flag'] == false){
      //   if(res['pnr']){
      //     this.airItinerary(res['pnr']);
      //   }else{
      //     this.pnrResponse = res['ERROR'];
      //   }
      // }
      if(res['res_flag'] == true){
        this.createPnr(res);
      }else if(res['res_flag'] == false){
        if(res['pnr'] && res['OTC']){
          // GO TO THANK YOU PAGE
          this.__router.navigate(["/thank-you"], {
            // relativeTo: this.__route,
            queryParams: {
              _token: localStorage.getItem("paxToken")
            }
          });
        }else if(res['pnr']){
          this.airItinerary(res['pnr']);
        }else{
          this.pnrResponse = res['ERROR'];
          
        }
      }
    })

  }

  createPnr(flightInfos){
    
    this.__ms.createPnr(flightInfos).subscribe(resp => {
      console.log(resp)
      let pnr = resp['__isPnr']; // res['__isPnr'];
      // return pnr;
      this.pnrCreated(pnr);
    })
    // JFLWVB
    // {"__isPnr":"IJQTOW"}
    // let pnr = "IJQTOW";
    // this.pnrCreated(pnr);
  } // 

  pnrCreated(pnr){

    this.__ms.pnrCreated(pnr).subscribe(res => {
      if(res['tkt_flag'] == true){
        this.airItinerary(pnr, 'tkt')
        // call for ticket issuance
        // this.issueTicket(pnr);
        // this.airItinerary(pnr)
      }else if(res['tkt_flag'] == false && res['OTC'] == true){
        this.__router.navigate(["/thank-you"], {
          // relativeTo: this.__route,
          queryParams: {
            _token: localStorage.getItem("paxToken")
          }
        });
      }else{
        this.airItinerary(pnr);
      }
    })
  } //

  airItinerary(pnr, tktFlag?){
    let itineraryUrl = this.__ms.itineraryUrl;
    let itineraryObj = {
      __isView: "W",
      __isAction: "C",
      __isVendorId: 1,
      __isAgentId: 0,
      __isParantId: 0,
      __isUserId: 0,
      __isAirType: "O",
      __isPnr : pnr
    }
    this.__ms.postData(itineraryUrl, itineraryObj).subscribe(res => {      
      res['CustomerInfo']['PersonName'] instanceof Array ? this.persons = res['CustomerInfo']['PersonName'] : this.persons.push(res['CustomerInfo']['PersonName'])
      
      let resItems = res['ItineraryInfo']['ReservationItems'];
      
      if(res['ItineraryInfo']['ReservationItems'] instanceof Array){
        this.reservationItems.push(res['ItineraryInfo']['ReservationItems']['Item']);
      }else if(resItems){
        this.reservationItems.push(res['ItineraryInfo']['ReservationItems']['Item']);
      }

      this.reservationItems.forEach(element => {
        let dtsplt = element.Air.attr.DepartureDateTime.split('T');
        let eachYear = dtsplt[0].split('-')[0];
        this.segmentYears.push(eachYear);
      })
      
      res['ItineraryInfo']['Ticketing'] instanceof Array ? this.ticketingItems.push(res['ItineraryInfo']['Ticketing']) : '';
      this.ticketingItems = res['ItineraryInfo']['Ticketing'];
      if(this.ticketingItems.length > 0){
        this.ticketingItems.forEach((elem, ind) => {
          if(ind > 0){
            let eachTktNum = elem['attr']['eTicketNumber'];
            if(eachTktNum != ''){
              eachTktNum = eachTktNum.split(' ')[1];
              eachTktNum = eachTktNum.split('-')[0];
              // console.log('eachTktNum',eachTktNum)
              this.ticketNos.push(eachTktNum);
            }
          }
        })
      }
      
      // console.log(this.segmentYears)
      this.PNR = res['ItineraryRef']['attr']['ID'];
      this.pnrCreateDate += '-' + (res['ItineraryRef']['Source']['attr']['CreateDateTime']).split('T')[0];
      this.specialServices = res['SpecialServices'];
      
      let psgBfare = 0;
      let psgTaxes = 0;
      this.priceQuotes.push(res['ItineraryInfo']['ItineraryPricing']['PriceQuote']);// = res['ItineraryInfo']['ItineraryPricing']['PriceQuote'];
      this.priceQuotes.forEach(element => {
        this.pnrBaseFare += Number(element.PricedItinerary.AirItineraryPricingInfo.ItinTotalFare.BaseFare.attr.Amount);
        this.pnrTaxes += Number(element.PricedItinerary.AirItineraryPricingInfo.ItinTotalFare.Taxes.Tax.attr.Amount);
      })
      this.pnrTotalFare = Number(this.pnrBaseFare) + Number(this.pnrTaxes);
      let priceQuote = res['ItineraryInfo']['ItineraryPricing']['PriceQuote'];
      if(priceQuote.length > 1){

        this.validatingCarrier = res['ItineraryInfo']['ItineraryPricing']['PriceQuote'][0]['PricedItinerary']['attr']['ValidatingCarrier'];
      }else{
        this.validatingCarrier = res['ItineraryInfo']['ItineraryPricing']['PriceQuote']['PricedItinerary']['attr']['ValidatingCarrier'];

      }

      this.pnrReceivedFrom = res['ItineraryRef']['Source']['attr']['ReceivedFrom'];
      this.pnrResponse = res;
      // IF TICKET ISSUANCE
      if(tktFlag){
        this.issueTicket(pnr);
      }
      // console.log(this.pnrTotalFare)
    })
    
    // GET RESPONSE FROM JSON FILE FOR TESTING
    // this.__ms.getJSON('../assets/airItinerary.json').subscribe(res => {
    //   console.log(res)
    //   this.pnrResponse = res;
    //   this.validatingCarrier = res['ItineraryInfo']['ItineraryPricing']['PriceQuote'][0]['PricedItinerary']['attr']['ValidatingCarrier'];
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
  } // 

  issueTicket(pnr){
    let tktUrl = this.__ms.ticketUrl;
    let tktObj = {
      __isView: "W",
      __isAction: "C",
      __isVendorId: 1,
      __isAgentId: 0,
      __isParantId: 0,
      __isUserId: 0,
      __isAirType: "O",
      __isPnr : pnr,
      __isVCarrier: this.validatingCarrier,
      __isReceivedFrom: this.pnrReceivedFrom,
      __isFOP: 'Rehman Travels',
      __ReceivableId: 1,
      __isUS: ''
    };
    this.__ms.postData(tktUrl, tktObj).subscribe(res => {
      console.log(res)
    })
  } // end issueTicket

}
