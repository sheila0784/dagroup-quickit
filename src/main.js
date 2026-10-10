// import { createApp } from 'vue'
// import PrimeVue from 'primevue/config'
// import Aura from '@primeuix/themes/aura'
// import App from './App.vue'

// const app = createApp(App)

// app.use(PrimeVue, {
//   theme: {
//     preset: Aura,
//   },
// })

// app.mount('#app')

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'
import App from './App.vue'
import './assets/dagroup.css'

const DaGroup = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f5fae8',
      100: '#e9f3ca',
      200: '#d5e79e',
      300: '#bed868',
      400: '#a7c83e',
      500: '#8eaf29',
      600: '#6d8b20',
      700: '#526b1c',
      800: '#43561c',
      900: '#39491c',
      950: '#1d280b',
    },
  },
})

createApp(App)
  .use(PrimeVue, {
    theme: {
      preset: DaGroup,
      options: {
        darkModeSelector: false,
      },
    },
  })
  .mount('#app')
