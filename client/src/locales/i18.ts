import i18next from 'i18next'
import enNs1 from './en/ns1'
import enNs2 from './en/ns2.json'

i18next.init({
  debug: true,
  fallbackLng: 'en',
  defaultNS: 'ns1',
  resources: {
    en: {
      ns1: enNs1,
      ns2: enNs2
    }
  }
})

export default i18next;