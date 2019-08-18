import { Component, OnInit } from '@angular/core';
import { SwitchLanguageService } from 'src/app/services/switch-language.service';
import { CookieService } from 'ngx-cookie-service';
import { NavbarComponent } from '../navbar/navbar.component';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isReload: boolean = false;
  constructor(private __ms: MainService, private __lang: SwitchLanguageService, private __cookie: CookieService) {

    let cookieExists = this.__cookie.check('selectedLang');
    if (cookieExists == true) {
      let searchCookie = this.__cookie.get('selectedLang');
      let currentSearch = JSON.parse(searchCookie);
      jQuery('#language').val(currentSearch);
      this.__lang.use(currentSearch);
    } else {
      this.__lang.use('en');
    }
  }

  ngOnInit() {
  }
  switchLanguage(evt) {
    let lang = evt.target.value;
    this.__cookie.set('selectedLang', JSON.stringify(lang));
    let fc = new NavbarComponent(this.__ms, this.__lang, this.__cookie);
    fc.switchLanguage(lang);
    this.isReload = true;
  }
  setIsReload(evt) {
    this.isReload = evt;
  }
}
