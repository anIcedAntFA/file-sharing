import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import { TEXT_LIB } from '../lib/text';

const I18N_CLIENT = i18next.createInstance();

I18N_CLIENT.use(initReactI18next)
  .use(
    resourcesToBackend(
      (lang: string, ns: string) =>
        import(
          `./locales/${lang}/${TEXT_LIB.transformCamelCaseToKebabCase(ns)}.json`
        )
    )
  )
  .init({
    fallbackLng: 'en',
    lng: 'en',
    debug: true,
    ns: [],
  });

export { I18N_CLIENT };

export const DEFAULT_NS = 'en' as const;

export const LOCALES = ['en', 'vi'] as const;
