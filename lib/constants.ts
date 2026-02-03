// /lib/constants.ts

export const CURRENCY = {
  CODE: 'DZD',
  SYMBOL: 'DZD',
  LOCALE: 'fr-DZ', // French (Algeria)
} as const;

export const CATEGORIES = [
  'Réfrigérateurs',
  'Lave-linge',
  'TV',
  'Climatiseurs',
  'Cuisinières',
  'Micro-ondes',
  'Autres',
] as const;

export const STORE_INFO = {
  name: 'ElectroMaison',
  phone: '021 23 45 67',
  phone_mobile: '0550 12 34 56',
  email: 'contact@electromaison.dz',
  address: '123 Boulevard des Martyrs, Alger, Algérie',
  hours: {
    weekdays: 'Samedi - Jeudi : 9h - 19h',
    weekend: 'Vendredi : Fermé',
  },
} as const;

export const ADMIN_ROLE = 'admin' as const;
export const USER_ROLE = 'user' as const;

export type Category = typeof CATEGORIES[number];
export type UserRole = typeof ADMIN_ROLE | typeof USER_ROLE;
