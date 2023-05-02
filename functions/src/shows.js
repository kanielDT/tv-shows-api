import { FieldValue } from "firebase-admin/firestore";
import Jwt from "jsonwebtoken";
import { db } from "./dbConnect.js";
import { secretKey } from "../secrets.js";

const collection = db.collection("shows")

export async function getShows(req, res) {
    const showsCollection = await collection.get()
    const shows = showsCollection.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    res.send(shows)
}

export async function addShows(req, res) {
    const token = req.headers.authorization
    const decoded = Jwt.verify(token, secretKey)
    if (!token) {
        res.status(401).send({ message: "Unauthorized. Valid token required." })
    }
    if (!decoded) {
        res.status(401).send({ message: "Unauthorized. Valid token required." })
    }
    const { title, poster, seasons } = req.body
    if (!title || !poster || !seasons) {
        res.send(400).send({ message: "Show title, poster, seasons are required." })
    }
    const newShow = {
        title,
        poster,
        seasons,
        createdAt: FieldValue.serverTimestamp()
    }
    await collection.add(newShow)
    getShows(req, res)
}