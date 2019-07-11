import { Pipe, PipeTransform } from '@angular/core';
import { SwitchLanguageService } from '../services/switch-language.service';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  constructor(private __lang: SwitchLanguageService) {}
  transform(key: any): any {
    return this.__lang.data[key] || key;  
  }
}
