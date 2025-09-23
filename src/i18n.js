

// import i18next from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
// import ar from './locales/ar.json';
// import en from './locales/en.json';

// i18next
//     .use(LanguageDetector)
//     .use(initReactI18next)
//     .init({
//         resources: {
//             ar: { translation: ar },
//             en: { translation: en },
//         },
//         fallbackLng: 'ar',
//         debug: process.env.NODE_ENV === 'development',
//         detection: {
//             order: ['localStorage', 'navigator'],
//             caches: ['localStorage'],
//         },
//         interpolation: {
//             escapeValue: false,
//         },
//     })
//     .then(() => {
//         document.documentElement.setAttribute('dir', i18next.language === 'ar' ? 'rtl' : 'ltr');
//     });

// export default i18next;

















import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ar from './locales/ar.json';
import en from './locales/en.json';
import de from './locales/de.json';

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            ar: { translation: ar },
            en: { translation: en },
            de: { translation: de },
        },
        fallbackLng: 'ar',
        debug: process.env.NODE_ENV === 'development',
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false,
        },
    })
    .then(() => {
        document.documentElement.setAttribute('dir', i18next.language === 'ar' ? 'rtl' : 'ltr');
    });

export default i18next;