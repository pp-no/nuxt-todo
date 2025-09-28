import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'

declare module '#app' {
  interface NuxtApp {
    $firebaseApp: FirebaseApp
    $db: Firestore
  }
}
declare module 'vue' {
  interface ComponentCustomProperties {
    $firebaseApp: FirebaseApp
    $db: Firestore
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const firebaseConfig = {
    apiKey: config.public.firebase.apiKey,
    authDomain: config.public.firebase.authDomain,
    projectId: config.public.firebase.projectId,
    storageBucket: config.public.firebase.storageBucket,
    messagingSenderId: config.public.firebase.messagingSenderId,
    appId: config.public.firebase.appId,
    measurementId: config.public.firebase.measurementId
  }

  const app: FirebaseApp = getApps().length > 0 && getApps()[0] !== undefined
    ? getApps()[0] as FirebaseApp
    : initializeApp(firebaseConfig)
  const db = getFirestore(app)

  return {
    provide: {
      firebaseApp: app,
      db
    }
  }
})
