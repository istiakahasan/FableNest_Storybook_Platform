// import {defineRouting} from 'next-intl/routing';
 
// export const routing = defineRouting({
//   // A list of all locales that are supported
//   locales: ['en', 'fr', 'sp'],
 
//   // Used when no locale matches
//   defaultLocale: 'en'
// });

import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'fr', 'sp', 'it'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});