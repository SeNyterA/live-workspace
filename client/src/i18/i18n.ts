import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      sss: 'sssss' // Ensure you have "translation" key for your JSON files
    }
  },
  lng: 'en',
  interpolation: {
    escapeValue: false // React already safes from XSS
  }
})

export default i18n
