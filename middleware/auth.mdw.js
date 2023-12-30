const authUser = function (req, res, next) {
  //console.log(req.session.authUser);
  console.log("authUser");
  if(req.session.authUser){
    switch (req.session.authUser.role) {
      case 'Admin':
        return res.redirect('/admin');
      case 'Merchant':
        return res.redirect('/merchant');
    }
  }
  if(req.originalUrl === '/account/login'){
    return next();
  }
  if (req.session.auth === false) {
    req.session.retUrl = req.originalUrl;
    return res.redirect('/account/login');
  }
  next();
};

const authLogout = function (req, res, next) {
  if (req.session.auth === false) {
    req.session.retUrl = req.originalUrl;
    return res.redirect('/account/login');
  }
  next();
};

const authUserforStart = function (req, res, next) {
  console.log("authUserforStart");
  if(req.originalUrl === '/account/logout'){
    return next();
  }
  if(req.session.authUser){
    switch (req.session.authUser.role) {
      case 'Admin':
        return res.redirect('/admin');
      case 'Merchant':
        return res.redirect('/merchant');
    }
  }
  next();
}

const authMerchant = function (req, res, next) {
  console.log("authMerchant");
  if(req.session.authUser){
    switch (req.session.authUser.role) {
      case 'Admin':
        return res.redirect('/admin');
      case 'User':
        return res.redirect('/');
      case undefined:
        return res.redirect('/account/login');
    }
  }
  // to sent logout post request
  console.log(req.originalUrl);
  if(req.originalUrl === '/account/logout'){
    console.log("logout here");
    return next();
  }
  if (req.session.auth === false) {
    req.session.retUrl = req.originalUrl;
    return res.redirect('/account/login');
  }
  next();
};

const authAdmin = function (req, res, next) {
  console.log("authAdmin");
  // check user when enter url from different role
  if(req.session.authUser){
    switch (req.session.authUser.role) {
      case 'Merchant':
        return res.redirect('/merchant');
      case 'User':
        return res.redirect('/');
      case undefined:
        return res.redirect('/account/login');
    }
  }
  if(req.originalUrl === '/account/logout'){
    return next();
  }
  if (req.session.auth === false) {
    req.session.retUrl = req.originalUrl;
    return res.redirect('/account/login');
  }
  next();
}
export default {
  authUser,
  authLogout,
  authUserforStart,
  authMerchant,
  authAdmin
};

