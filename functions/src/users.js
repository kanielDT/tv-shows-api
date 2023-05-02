import { FieldValue } from "firebase-admin/firestore";
import Jwt from "jsonwebtoken";
import { db } from "./dbConnect.js";
import { secretKey } from "../secrets.js";

const collection = db.collection("users")

export async function signup(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
        res.alert(400).send({ message: "Email and Password are both requred" })
        return
    }

    //TODO: check if email is already in uses
    const newUser = {
        email: email.toLowerCase(),
        password,
        createdAt: FieldValue.serverTimestamp(),
    }
    await collection.add(newUser)
    // once the user is added, log them in...
    login(req, res)
}

export async function login(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
        res.alert(400).send({ message: "Email and Password are both requred" })
        return
    }
    const users = await collection
        .where("email", "==", email.toLowerCase())
        .where("password", "==", password)
        .get()
    let user = users.docs.map(doc => ({ ...doc.data(), id: doc.id }))[0]
    if (!user) {
        res.send(400).send({ message: "Invalid email and/or password" })
    }
    delete user.password
    const token = jwt.sign(user, secretKey)
    res.send({ user, secretKey })
}