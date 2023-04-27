import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { secrets } from "../secrets.js"

initializeApp({  // connect to our Firbase PROJECT
    credential: cert(secrets) //using these credentials
})

export const db = getFirestore() //connect us to FireSTORE DB