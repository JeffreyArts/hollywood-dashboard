import { createApp } from "vue"
import { createPinia } from "pinia"
document.title = import.meta.env.VITE_PAGE_TITLE


import "./assets/scss/index.scss"
import App from "@/App.vue"
const pinia = createPinia()

createApp(App)
    .use(pinia)
    .mount("#app")