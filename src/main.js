import PrimeVue from 'primevue/config';
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
const app = createApp(App)
app.use(router)
app.use(PrimeVue);
app.mount('#app')
// app.config.globalProperties.$http = axios



