export type IsoWeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type IsoWeekDays = readonly IsoWeekDay[];
export type AllowedWeekDays = 2 | 4
export const weekDays = [1, 2, 3, 4, 5, 6, 7] as const;
export const allowedWeekDays: AllowedWeekDays[] = [2];
//export type AllowedDeliveryPlaces = 'farene' | 'terredumilieu'
export enum AllowedDeliveryPlaces {
  farene = 'farene',
  terredumilieu = 'terredumilieu',
  offbar = 'offbar',
  inbw = 'inbw'
}
export const allowedDeliveryPlaces = [
  AllowedDeliveryPlaces.farene,
  AllowedDeliveryPlaces.terredumilieu,
  AllowedDeliveryPlaces.offbar,
  AllowedDeliveryPlaces.inbw] as const
export const allowedDeliveries: readonly {
  weekDay: AllowedWeekDays,
  deliveryPlace: AllowedDeliveryPlaces
}[] = [
  {
    weekDay: 2,
    deliveryPlace: AllowedDeliveryPlaces.farene
  },
  {
    weekDay: 2,
    deliveryPlace: AllowedDeliveryPlaces.offbar
  },
  {
    weekDay: 2,
    deliveryPlace: AllowedDeliveryPlaces.inbw
  },
  /* {
    weekDay: 4,
    deliveryPlace: AllowedDeliveryPlaces.farene
  },
  {
    weekDay: 4,
    deliveryPlace: AllowedDeliveryPlaces.terredumilieu
  }, */
] as const
export const deliveryPlacesLabels: Record<AllowedDeliveryPlaces, string> = {
  farene: 'Farène + Point Dépôt',
  terredumilieu: 'Terre du Milieu',
  offbar: 'OFFBar de Mont-Saint-Guibert',
  inbw: 'Einstein Busines Center (INBW)'
}