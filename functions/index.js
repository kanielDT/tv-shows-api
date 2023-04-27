import functions from "firebase-functions"
import express from "express"
import cors from "cors"
import { login, signup } from "./src/users.js"
import { getShows, addShows } from "./src/shows.js"

const app = express()
app.use(cors())
app.use(express.json())

//Routiing goes Here...
app.post("/signup", signup)
app.post("/login", login)

//Shows route
app.get("/getShows", getShows)
app.post("/addShows", addShows)


app.listen(3000, () => console.log(`listening on http://localhost:3000...`))

export const api = functions.https.onRequest(app) //exports our cloud function