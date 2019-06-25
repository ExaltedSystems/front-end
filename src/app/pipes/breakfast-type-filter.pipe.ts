import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'breakfastTypeFilter'
})
export class BreakfastTypeFilterPipe implements PipeTransform {

  transform(items: any[], types: string): any[] {
    if (!types || types.length === 0) return items;
    
    return items.filter(item => types.includes(item.breakfast_list));
  }

}
