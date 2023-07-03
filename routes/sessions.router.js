import { Router } from "express";
const router = Router();
import userModel from "../src/daos/mongoDb/models/users.model.js";

router.post('/register', async (req, res) => {
    const { firtName, lastName, email, age, password } = req.body;
    const exist = await userModel.findOne({ email: email })

    if (exist) {
        return res.redirect('/api/sessions/login');
    }

    await userModel.create({
        firtName, lastName, email, age, password
    })
    req.session.user = {
        name: firtName + " " + lastName,
        email: email,
        age: age,
    }
    res.redirect('/products');
    return
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email, password: password });
    if (!user) return res.redirect('/api/login')
    req.session.user = {
        name: user.firtName + " " + user.lastName,
        email: user.email,
        age: user.age,
    };
    res.send({ status: "success", message: req.session.user });
})



export default router;
