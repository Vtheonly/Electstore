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
  'Lave-vaisselle',
  'Four',
  'Hotte',
  'Plaque de cuisson',
  'Petit robot',
  'Autres',
] as const;

export const STORE_INFO = {
  name: 'Tamani',
  full_name: 'Tamani Électroménager',
  phone: '+213552010434',
  phone_mobile: '0669 67 78 49',
  email: 'Akkoumoh10@gmail.com',
  address: '12 Salopards, Tizi Ouzou',
  mapUrl: 'https://www.google.com/maps?q=36.7010273,4.039739&z=17&hl=en',
  hours: {
    weekdays: 'Samedi - Jeudi : 9h - 19h',
    weekend: 'Vendredi : Fermé',
  },
} as const;

export const ADMIN_ROLE = 'admin' as const;
export const USER_ROLE = 'user' as const;

export type Category = typeof CATEGORIES[number];
export type UserRole = typeof ADMIN_ROLE | typeof USER_ROLE;
