export type WeekDay = 0 | 1 | 2 | 3 | 5 | 6
export type WeekDays = readonly WeekDay[]
export const weekDays = [0, 1, 2, 3, 4, 5, 6] as const
export const allowedWeekDays: WeekDays  = [1, 3]
export const minAllowedOrderWeekDay = 3
export const maxAllowedOrderWeekDay = 6