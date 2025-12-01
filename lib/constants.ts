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
  phone: '01 23 45 67 89',
  email: 'contact@electromaison.fr',
  address: '123 Rue du Commerce, 75015 Paris, France',
  hours: {
    weekdays: 'Lundi - Samedi : 9h - 19h',
    weekend: 'Dimanche : 10h - 18h',
  },
} as const;

export const ADMIN_ROLE = 'admin' as const;
export const USER_ROLE = 'user' as const;

export type Category = typeof CATEGORIES[number];
export type UserRole = typeof ADMIN_ROLE | typeof USER_ROLE;
