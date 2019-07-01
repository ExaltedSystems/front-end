import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http, Response } from '@angular/http';


@Injectable({
  providedIn: 'root'
})
export class MainService {

  public baseUrl = 'http://www.cheapfly.pk/';
  public tktBaseUrl = 'http://exaltedsys.com/';
  backEndUrl: string = 'http://www.cheapfly.pk/rgtapp/index.php/services/';
  flightsUrl: string = this.tktBaseUrl+'Air-Service/AirAvailability/Flights';
  byTagUrl: string = this.tktBaseUrl+'Air-Service/AirAvailability/AirByTag';
  revalidateUrl: string = this.tktBaseUrl+'Air-Service/AirAvailability/AirRevalidate';
  FlightInfo:object;
  hotelSearchQuery: object;
  public ipAddress: any;
  constructor(private __httpClient: HttpClient, private __http: Http) {
    this.getIpAddress();
    // For Live Site to Set http / https
    let loc = window.location;
    let base_url = loc.protocol+"//"+loc.hostname+"/";
    this.baseUrl = base_url;
    this.backEndUrl = this.baseUrl+"rgtapp/index.php/services/";
    
    this.tktBaseUrl = loc.protocol+'//exaltedsys.com/';
    this.flightsUrl = this.tktBaseUrl+'Air-Service/AirAvailability/Flights';
    this.byTagUrl = this.tktBaseUrl+'Air-Service/AirAvailability/AirByTag';
    this.revalidateUrl = this.tktBaseUrl+'Air-Service/AirAvailability/AirRevalidate';
  }


  /**
   * get all data
   * @param url type any
   * @return json
   */
  getData(url): Observable<response> {
    return this.__httpClient.get<response>(url);
  }
  /**
   *
   * @param url
   */
  getLIst(url): Observable<any> {
    return this.__httpClient.get<any>(url);
  }
  public getJSON(jsonFile): Observable<any> {
    return this.__httpClient.get(jsonFile);
  }
  getJsonData(url) {
    return this.__httpClient.get<any>(url)
  }

  getAirPorts() {
    return this.__http.get('../../assets/js/locations.json').pipe(map((res:any) => res.json()));
  }

  getBankDetails(){
    let banksUrl = this.backEndUrl + 'cms/allBankDetails';
    return this.getJsonData(banksUrl);
  }

  getBranchesDetails(){
    let branchesUrl = this.backEndUrl + 'cms/allBranchesLists';
    return this.getJsonData(branchesUrl);
  }
  /**
    * Get All Client All Informations
    * @param url type any
    * @return json
  */
  getClientInfo(url): Observable<ipInformation> {
    return this.__httpClient.get<ipInformation>(url);
  }
  getIpAddress(){
      this.__httpClient.get<{ip:string}>('https://jsonip.com').subscribe(data => {
          this.ipAddress = data.ip
      })
  }

  /**
   * post data to server api
   * @param url
   * @param obj
   */
  postData(url, obj): Observable<response> {
    return this.__httpClient.post<response>(url, obj);
  }

  sendPostData(url, obj){
    obj = JSON.stringify(obj)
    return this.__httpClient.request("POST",url,obj);
  }
  putData(url, obj) {
    return this.__httpClient.put(url, obj)
  }
  deleteData(url) {
    return this.__httpClient.delete(url);
  }
  setDateFormat(date, time?) {
    let formatedDate = date;
    if(!time){
      let newDate = new Date(date);
      let month = (newDate.getMonth() + 1 > 9 ? (newDate.getMonth() + 1) : "0" + (newDate.getMonth() + 1));
      let day = (newDate.getDate() > 9 ? newDate.getDate() : "0" + newDate.getDate());
      formatedDate = newDate.getFullYear() + '-' + month + '-' + day;
    }else{
      let timeOnly = date.split('T');
      formatedDate = timeOnly[1];
    }
    return formatedDate;
  }

  getVisaOptions(): Observable<response> {
    const href = this.backEndUrl + 'Cms/readJsonFile';
    return this.__httpClient.get<response>(href);
  }

  locationsJson() {
    return this.getJsonData('../../assets/js/locations.json');
  }
  __filterFlyFrom(sectors, val) {
    if (val.length > 3) {
      return sectors.filter(sector => sector.toLowerCase().indexOf(val.toLowerCase()) != -1)
    } else {
      return sectors.filter(sector => sector.substring(0, 3).toLowerCase().indexOf(val.toLowerCase()) != -1)
    }
  }
  filterFlyingTo(ev) {
    return this.getJsonData('../../assets/js/locations.json')
      .pipe(
        map(sectors => this.__filterFlyTo(sectors, ev.target.value)),
      )
  }
  __filterFlyTo(sectors, val) {
    if (val.length > 3) {
      return sectors.filter(sector => sector.toLowerCase().indexOf(val.toLowerCase()) != -1)
    } else {
      return sectors.filter(sector => sector.substring(0, 3).toLowerCase().indexOf(val.toLowerCase()) != -1)
    }
  }

  airByTagObj(tagID){
    return {
      "__isView": "W",
      "__isAction": "C",
      "__isVendorId": 1,
      "__isAgentId": 0,
      "__isParantId": 0,
      "__isUserId": 0,
      "__isTag": tagID
    }
  } //

  revalidateReq(byTagRes, adtQty, cnnQty, infQty, dptDate){
    const revalidateSectors = [];
    let tagSectors = byTagRes['AirItinerary']['OriginDestinationOptions']['OriginDestinationOption'][0]['FlightSegment'];
    tagSectors.forEach(element => {

      let eachSector = {
        "__isADate": this.setDateFormat(element.ArrivalDateTime),
        "__isATime": this.setDateFormat(element.ArrivalDateTime, 't'),
        "__isDDate": this.setDateFormat(element.DepartureDateTime),
        "__isDTime": this.setDateFormat(element.DepartureDateTime, 't'),
        "__isFlightNo": element.FlightNumber,
        "__isParty": (adtQty + cnnQty),
        "__isCabin": element.ResBookDesigCode,
        "__isMarriage": element.MarriageGrp == 'I' ? 'X' : element.MarriageGrp,
        "__isStatus": "NN",
        "__isEquipType": element.Equipment[0].AirEquipType,
        "__isOLocation": element.DepartureAirport.LocationCode,
        "__isDLocation": element.ArrivalAirport.LocationCode,
        "__isMkAirLine": element.MarketingAirline.Code,
        "__isOpAirLine": element.OperatingAirline.Code
      }
      revalidateSectors.push(eachSector);
    });

    let revalidatePsgrs = [{
      "__isType": "ADT",
      "__isValue": adtQty
    }];

    if(cnnQty > 0){
      revalidatePsgrs.push({
        "__isType": "CNN",
        "__isValue": cnnQty
      });
    }

    if(infQty > 0){
      revalidatePsgrs.push({
        "__isType": "INF",
        "__isValue": infQty
      });
    }

    let revalidateObj = {
      "__isView": "W",
      "__isAction": "C",
      "__isVendorId": 1,
      "__isAgentId": 0,
      "__isParantId": 0,
      "__isUserId": 0,
      "__isAirType": "O",
      "__isTravelDate": dptDate,
      "__isPassengers":revalidatePsgrs,
      "__isSectors": revalidateSectors
    }
    let revalidateMsg = '';
    return this.postData(this.revalidateUrl, revalidateObj)
    // revalidateMsg;
  } //

  revalidateObj(dptDate, revalidatePsgrs, revalidateSectors){
    return {
      "__isView": "W",
      "__isAction": "C",
      "__isVendorId": 1,
      "__isAgentId": 0,
      "__isParantId": 0,
      "__isUserId": 0,
      "__isAirType": "O",
      "__isTravelDate": dptDate,
      "__isPassengers":revalidatePsgrs,
      "__isSectors": revalidateSectors
    }
  }//

  createPnr(flightInfos){
    let pnrUrl = this.tktBaseUrl+'Air-Service/AirAvailability/AirReservation';
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
    return this.postData(pnrUrl, pnrObj);
  } // end createpnr

  pnrCreated(pnr, paymentFlag){
    let pnrSaveUrl = this.backEndUrl+'Ticket/pnrCreated';
    let pnrSaveObj = {
      pnr: pnr,
      _token: localStorage.getItem("paxToken"),
      _paymentFlag: paymentFlag
    }
    return this.postData(pnrSaveUrl, pnrSaveObj)
  } // end pnrcreated
}
export interface response {
  status: boolean,
  message: string,
  data: object
}

export interface list {
  data: string[]
}

export interface ipInformation {
  city: string;
  country: string;
  hostname: string;
  ip: string;
  loc: string;
  org: string;
  postal: string;
  region: string;
}
