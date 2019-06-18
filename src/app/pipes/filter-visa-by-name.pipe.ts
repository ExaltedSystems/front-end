import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterVisaByName'
})
export class FilterVisaByNamePipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      return it.metaTitle.toLowerCase().includes(searchText);
      // return it.metaTitle.toLowerCase().indexOf(searchText);
    });
  }

}
