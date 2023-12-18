import express from 'express';
import bcrypt from 'bcrypt';
import userService from '../../services/user/user.service.js';
import auth from '../../middleware/auth.mdw.js';

const getRegister = function (req, res) {
  res.render('user/register');
};

const postRegister = async function (req, res) {
  const raw_password = req.body.raw_password;
  const salt = bcrypt.genSaltSync(10);
  const hash_password = bcrypt.hashSync(raw_password, salt);

  const user = {
    username: req.body.username,
    password: hash_password,
    name: req.body.name,
    email: req.body.email,
    dob: dob,
    permission: 0
  }
  await userService.add(user);
  res.render('user/register');
};

const getLogin = function (req, res) {
  res.render('user/login');
};

const postLogin =  async function (req, res) {
  const user = await userService.findByUsername(req.body.username);
  if (!user) {
    return res.render('user/login', {
      err_message: 'Invalid username or password.'
    });
  }

  const ret = bcrypt.compareSync(req.body.password, user.password);
  if (ret === false) {
    return res.render('user/login', {
      err_message: 'Invalid username or password.'
    });
  }

  delete user.password;
  req.session.auth = true;
  req.session.authUser = user;

  const url = req.session.retUrl || '/';
  res.redirect(url);
};

const logout =  function (req, res) {
  req.session.auth = false;
  req.session.authUser = undefined;
  res.redirect(req.headers.referer);
};

export default {logout, getLogin, postLogin, getRegister, postRegister};