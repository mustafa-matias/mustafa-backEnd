import { Router } from "express";
const router = Router();
import userModel from "../src/daos/mongoDb/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

router.post('/register', passport.authenticate('register'), async (req, res) => {
    const { firtName, lastName, email, age, password } = req.body;

    req.session.user = {
        name: firtName + " " + lastName,
        email: email,
        age: age,
        rol: (email == 'admincoder@coder.com') ? 'Admin' : 'Usuario'
    }
    return res.redirect('/products');

})

router.post('/login', passport.authenticate('login'), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: 'error', error: 'Invalid credentials' })

    req.session.user = {
        name: req.user.firtName + " " + req.user.lastName,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.email == 'admincoder@coder.com' ? ('Admin') : ('Usuario')
    };
    res.send({ status: "success", message: req.session.user });
})

router.get('/github', passport.authenticate('github', { scope: ['user: email'] }), async (req, res) => { });

router.get('/githubcallback', passport.authenticate('github'), async (req, res) => {
    req.session.user = {
        name: req.user.firtName,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.email == 'admincoder@coder.com' ? ('Admin') : ('Usuario')
    };
    res.redirect('/products');
})

export default router;
