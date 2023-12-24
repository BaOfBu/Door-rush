import express from "express";
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer';
import Account from '../../models/accountModel.js';
import userService from "../../services/user/user.service.js";
import auth from "../../middleware/auth.mdw.js";

const getRegister = function (req, res) {
  res.render("user/register");
};

const postRegister = async function (req, res) {
  const raw_password = req.body.raw_password;
  const salt = bcrypt.genSaltSync(10);
  const hash_password = bcrypt.hashSync(raw_password, salt);

  const verificationToken = bcrypt.hashSync(new Date().toString(), salt);

  const user = {
    username: req.body.username,
    password: hash_password,
    email: req.body.email,
    role: "User",
    status: "active",
    permission: 0,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: Date.now() + 3600000, // Token expires in 1 hour
  };

  try {
    const newUser = await userService.add(user);
    // Send verification email
    const verificationLink = `http://yourapp.com/verify/${newUser._id}/${verificationToken}`;
    const mailOptions = {
      from: 'ntson21@clc.fitus.edu.vn',
      to: 'sonsung2003@gmail.com',
      subject: 'Verify Your Email',
      text: `Click the following link to verify your email: ${verificationLink}`,
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ntson21@clc.fitus.edu.vn',
        pass: 'Ntson2101296773776',
      },
    });

    await transporter.sendMail(mailOptions);

    res.render('user/register', {
      message: 'Registration successful. Check your email for verification instructions.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const getLogin = function (req, res) {
  res.render("user/login");
};

const postLogin = async function (req, res) {
  const user = await userService.findByUsername(req.body.username);
  console.log(user);
  if (!user) {
    return res.render("user/login", {
      err_message: "Invalid username or password.",
    });
  }

  const ret = bcrypt.compareSync(req.body.password, user.password);
  if (ret === false) {
    return res.render("user/login", {
      err_message: "Invalid username or password.",
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

const getForgotPassword = function (req, res) {
  res.render("user/forgot-password.hbs", {
    layout: "user/layouts/forgot-password.hbs",
  });
};

const postForgotPassword = function (req, res) {};

export default {
  logout,
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  getForgotPassword,
  postForgotPassword
};
