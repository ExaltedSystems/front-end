import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-hotel-voucher',
  templateUrl: './hotel-voucher.component.html',
  styleUrls: ['./hotel-voucher.component.css']
})
export class HotelVoucherComponent implements OnInit {
  bookingDetails: object;  
  isLoading: boolean = true;
  constructor(private __ms: MainService, private __cookie: CookieService) {
    window.scroll(0, 300);
  }

  ngOnInit() {
    this.getHotelBookingDetails();
  }
  getHotelBookingDetails = () => {
    let bookingId = JSON.parse(this.__cookie.get('bookingId'));
    // let bookingId = 1;
    this.__ms.postData(this.__ms.backEndUrl+"HotelQuery/hotelBookingDetails", {bookingId}).subscribe(res => {
      this.bookingDetails = res;
      this.isLoading = false;
    });
  }
}
