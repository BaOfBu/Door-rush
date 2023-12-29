import express from "express";
import bcrypt from "bcrypt";
import userService from "../../services/user/user.service.js";
import nodemailer from "nodemailer";
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
    status: "pending",
    permission: 0,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: Date.now() + 3600000, // Token expires in 1 hour
  };

  console.log(user);

  try {
    const newUser = await userService.add_user(user);
    // Send verification email
    // random a 6 digits number for OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const mailOptions = {
      from: 'ntson21@clc.fitus.edu.vn',
      to: req.body.email,
      subject: 'no-reply',
      text: `Your OTP code is ${verificationCode}`,
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
      email: req.body.email,
      username: req.body.username
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

const get_verification = function (req, res) {
    res.render("user/verification");
}

const post_verification = async function (req, res) {
    const user = await userService.findById(req.params.id);
    if (!user) {
        return res.render("user/verification", {
            err_message: "Invalid user."
        });
    }

    const ret = bcrypt.compareSync(req.params.token, user.emailVerificationToken);
    if (ret === false) {
        return res.render("user/verification", {
            err_message: "Invalid token."
        });
    }

    if (user.emailVerificationExpires < Date.now()) {
        return res.render("user/verification", {
            err_message: "Token expired."
        });
    }

    user.status = "Active";
    await user.save();

    res.render("user/verification", {
        message: "Account verification successful."
    });
}

export default { get_verification,post_verification,is_available_email,is_available_user ,logout, getLogin, postLogin, getRegister, postRegister };
