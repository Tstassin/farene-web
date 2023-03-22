export type IsoWeekDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type IsoWeekDays = readonly IsoWeekDay[];
export const weekDays = [1, 2, 3, 4, 5, 6, 7] as const;
export const allowedWeekDays: IsoWeekDays = [2, 4];
