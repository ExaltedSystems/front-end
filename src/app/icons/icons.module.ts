import { NgModule } from '@angular/core';
import { IconUsers, IconChevronDown, IconChevronUp, IconMinus, IconPlus, IconCheck, IconMapPin, IconCalendar, IconXCircle, IconSend, IconAward, IconClock, IconPlusCircle, IconArrowRight, IconMinusCircle } from 'angular-feather';
const icons = [
  IconUsers, IconClock, IconPlusCircle, IconMinusCircle, IconArrowRight, IconChevronDown, IconChevronUp, IconMinus, IconPlus, IconCheck, IconMapPin, IconCalendar, IconXCircle, IconSend, IconAward
]
@NgModule({
  imports: icons,
  exports:icons
})
export class IconsModule { }
