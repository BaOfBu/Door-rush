const authUser = function (req, res, next) {
  //console.log(req.session.authUser);
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

const authUserforStart = function (req, res, next) {
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
  if(req.originalUrl === '/merchant'){
    return next();
  }
  if(req.session.authUser){
    switch (req.session.authUser.role) {
      case 'Admin':
        return res.redirect('/admin');
      case 'User':
        return res.redirect('/');
    }
  }
  if (req.session.auth === false) {
    req.session.retUrl = req.originalUrl;
    return res.redirect('/account/login');
  }
  next();
};

const authAdmin = function (req, res, next) {
  if(req.session.authUser){
    switch (req.session.authUser.role) {
      case 'Merchant':
        return res.redirect('/merchant');
      case 'User':
        return res.redirect('/');
    }
  }
  if (req.session.auth === false) {
    req.session.retUrl = req.originalUrl;
    return res.redirect('/account/login');
  }
  next();
}
export default {
  authUser,
  authUserforStart,
  authMerchant,
  authAdmin
};

