import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'VisaListingPipe'
})
export class VisaListingPipe implements PipeTransform {

  transform(items: any[], types: string): any[] {
    if (!types || types.length === 0) return items;
    console.log(types);
    types = types.toLowerCase();
    return items.filter(it => {
      return it.countryName.toLowerCase().includes(types);
      // return it.metaTitle.toLowerCase().indexOf(searchText);
    });
  }

}
