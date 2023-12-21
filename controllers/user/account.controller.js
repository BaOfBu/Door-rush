import express from "express";
import bcrypt from "bcrypt";
import userService from "../../services/user/user.service.js";
import auth from "../../middleware/auth.mdw.js";

const getRegister = function (req, res) {
    res.render("user/register");
};

const postRegister = async function (req, res) {
    const raw_password = req.body.raw_password;
    const salt = bcrypt.genSaltSync(10);
    const hash_password = bcrypt.hashSync(raw_password, salt);
    //console.log(req.body);
    const user = [{
        username: req.body.username,
        password: hash_password,
        name: req.body.name,
        email: req.body.email,
        role: 'User',
        status: 'active'
    }];
    await userService.add_user(user);
    res.render("user/register");
};

const getLogin = function (req, res) {
    res.render("user/login");
};

const postLogin = async function (req, res) {
    const user = await userService.findByUsername(req.body.username);
    console.log(user);
    if (!user) {
        return res.render("user/login", {
            err_message: "Invalid username or password."
        });
    }

    const ret = bcrypt.compareSync(req.body.password, user.password);
    if (ret === false) {
        return res.render("user/login", {
            err_message: "Invalid username or password."
        });
    }

    delete user.password;
    req.session.auth = true;
    req.session.authUser = user;
    const url = req.session.retUrl || "/";
    res.redirect(url);
};

const logout = function (req, res) {
    req.session.auth = false;
    req.session.authUser = undefined;
    res.redirect(req.headers.referer);
};

const is_available_user = async function (req, res) {
    const username = req.query.username;
    const user = await userService.findByUsername(username);
    const message = "is-available";
    console.log(message);
    console.log(username);
    if (user === null) {
        return res.json(true);
    }
    res.json(false);
};

const is_available_email = async function (req, res) {
    const email = req.query.email;
    const result = await userService.findByEmail(email);
    if (result === null) {
        return res.json(true);
    }
    res.json(false);
};

export default { is_available_email,is_available_user ,logout, getLogin, postLogin, getRegister, postRegister };
