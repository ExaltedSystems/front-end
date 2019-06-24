import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'iframe'
})
export class IframePipe implements PipeTransform {
  constructor (private __dom:DomSanitizer) { }
  transform(html: any): any {
    return this.__dom.bypassSecurityTrustHtml(html);
  }

}
