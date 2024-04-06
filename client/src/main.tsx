import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.scss'
import './themes/theme.scss'
import { I18nextProvider } from 'react-i18next'
import i18n from './locales/i18.ts'
import store from './redux/store.ts'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MantineProvider>
            <App />
          </MantineProvider>
        </BrowserRouter>

        {/* <ReactQueryDevtools initialIsOpen /> */}
      </QueryClientProvider>
    </Provider>
  </I18nextProvider>
)
