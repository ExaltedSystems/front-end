import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { APP_ROUTES } from './app.routes';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule, MatInputModule, MatFormFieldModule, MatRadioModule, MatNativeDateModule, MatAutocompleteModule, MatSelectModule, MatSidenavModule, MatDrawerContainer, MatDrawer, MatSidenav, MatProgressBarModule, MatCheckboxModule, MatExpansionModule, MatStepperModule, MatProgressSpinnerModule, MatCardModule, MatTabsModule} from '@angular/material';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FlightsComponent } from './components/flights/flights.component';
import { HotelsComponent } from './components/hotels/hotels.component';
import { FlightsSearchComponent } from './components/flights-search/flights-search.component';
import { HotelsSearchComponent } from './components/hotels-search/hotels-search.component';
import { HomeComponent } from './components/home/home.component';
import { IconsModule } from './icons/icons.module';
import { MainService } from './services/main.service';
import { FlightsListingComponent } from './components/flights-listing/flights-listing.component';
import { AirPortsPipe } from './air-ports.pipe';
import { SecondsPipePipe } from './pipes/seconds-pipe.pipe';
import { FlightBookingComponent } from './components/flight-booking/flight-booking.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { PnrViewComponent } from './components/pnr-view/pnr-view.component';
import { CookieService } from 'ngx-cookie-service';
import {StickyModule} from 'ng2-sticky-kit';
import { ThankYouComponent } from './components/thank-you/thank-you.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    FlightsComponent,
    HotelsComponent,
    FlightsSearchComponent,
    HotelsSearchComponent,
    HomeComponent,
    FlightsListingComponent,
    AirPortsPipe,
    SecondsPipePipe,
    
    FlightBookingComponent,
    
    DateFormatPipe,
    
    PnrViewComponent,
    
    ThankYouComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    HttpModule,
    // Material Modules
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatRadioModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSelectModule,
    IconsModule,
    MatSidenavModule,
    MatProgressBarModule,
    InfiniteScrollModule,
    MatExpansionModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSidenavModule,
    StickyModule,
    MatTabsModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [MainService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
