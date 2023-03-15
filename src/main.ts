import { createApp } from "vue";
import "./main.css";
import App from "./App.vue";
import router from "./router";
import { VueFire } from "vuefire";
import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'

// export const firebaseApp = initializeApp({
//   apiKey: import.meta.env.VITE_API_KEY,
//   authDomain: import.meta.env.VITE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_APP_ID,
// });

// export const db = getFirestore(firebaseApp)
// export const testsRef = collection(db, 'test')

createApp(App)
  .use(router)
  // .use(VueFire, {
  //   // imported above but could also just be created here
  //   firebaseApp,
  //   modules: [],
  // })
  .mount("#app");
