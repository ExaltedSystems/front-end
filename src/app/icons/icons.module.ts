import { NgModule } from '@angular/core';
import { IconUsers, IconChevronDown, IconChevronUp, IconMinus, IconPlus, IconCheck, IconMapPin, IconCalendar, IconXCircle, IconSend, 
  IconAward, IconClock, IconPlusCircle, IconArrowRight, IconMinusCircle, IconSliders, IconBell, IconSearch, IconStar, IconMap, IconUser } from 'angular-feather';
const icons = [
  IconUsers, IconClock, IconPlusCircle, IconMinusCircle, IconArrowRight, IconChevronDown, IconChevronUp, IconMinus, IconPlus, 
  IconCheck, IconMapPin, IconCalendar, IconXCircle, IconSend, IconAward, IconSliders, IconBell, IconSearch, IconStar, IconMap, IconUser
]
@NgModule({
  imports: icons,
  exports:icons
})
export class IconsModule { }
