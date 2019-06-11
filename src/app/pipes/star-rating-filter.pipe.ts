import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'starRatingFilter'
})
export class StarRatingFilterPipe implements PipeTransform {

  transform(items: any[], types: string[]): any[] {
    if (!types || types.length === 0) return items;
    return items.filter(item => types.includes(item.star_rating));
  }

}
