import express from "express";
import bcrypt from "bcrypt";
import userService from "../../services/user/user.service.js";
import nodemailer from "nodemailer";

const getRegister = function (req, res) {
    res.render("user/register");
};

const postRegister = async function (req, res) {
    const raw_password = req.body.raw_password || "";
    const salt = bcrypt.genSaltSync(10);
    const hash_password = bcrypt.hashSync(raw_password, salt);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationToken = bcrypt.hashSync(verificationCode, salt);

    const user = {
        username: req.body.username,
        password: hash_password,
        email: req.body.email,
        role: "User",
        status: "pending",
        permission: 0,
        phone: req.body.phone,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: Date.now() + 3600000 // Token expires in 1 hour
    };

    //console.log(user);

    try {
        await userService.add_user(user);
        // Send verification email
        // random a 6 digits number for OTP
        const mailOptions = {
            from: "ntson21@clc.fitus.edu.vn",
            to: req.body.email,
            subject: "OTP Code for Door-rush website",
            text: `Your OTP code is ${verificationCode}`
        };

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "ntson21@clc.fitus.edu.vn",
                pass: "Ntson2101296773776"
            }
        });

        await transporter.sendMail(mailOptions);

        req.session.username = req.body.username;
        req.session.email = req.body.email;
        res.redirect("/account/register/verification");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const getLogin = function (req, res) {
    req.session.retUrl = req.headers.referer || "/";
    res.render("user/login");
};

const postLogin = async function (req, res) {
    const user = await userService.findByUsername(req.body.username);
    //console.log(user);
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
    console.log(url);
    if (url === "/account/login") {
        res.redirect("/");
    }
    //console.log(url);
    res.redirect(url);
};

const logout = function (req, res) {
    req.session.retUrl = req.headers.referer || "/";
    req.session.auth = false;
    req.session.authUser = undefined;
    res.redirect("../../../account/login");
    //localStorage.removeItem('selectedDateRange');
};

const is_available_user = async function (req, res) {
    const username = req.query.username;
    const user = await userService.findByUsername(username);
    // const message = "is-available";
    // console.log(message);
    // console.log(username);
    if (user === null) {
        return res.json(true);
    }
    return res.json(false);
};

const is_available_email = async function (req, res) {
    const email = req.query.email;
    const result = await userService.findByEmail(email);
    if (result === null) {
        return res.json(true);
    }
    return res.json(false);
};

const get_verification = function (req, res) {
    res.render("user/verification", { username: req.session.username, email: req.session.email });
};

const post_verification = async function (req, res) {
    console.log(req.body);
    const user = await userService.findByUsername(req.body.username);
    if (!user) {
        return res.render("user/verification", {
            err_message: "Invalid user."
        });
    }
    const OTP = req.body.first + req.body.second + req.body.third + req.body.fourth + req.body.fifth + req.body.sixth;
    console.log("OTP:" + OTP);

    const ret = bcrypt.compareSync(OTP, user.emailVerificationToken);
    if (ret === false) {
        req.session.err_message = "Invalid OTP.";
        return res.redirect("/account/register/verification");
    }

    if (user.emailVerificationExpires < Date.now()) {
        req.session.err_message = "OTP expired.";
        return res.redirect("/account/register/verification");
    }

    user.status = "active";
    await user.save();

    res.redirect("/account/login");
};

export default {
    get_verification,
    post_verification,
    is_available_email,
    is_available_user,
    logout,
    getLogin,
    postLogin,
    getRegister,
    postRegister
};
