function auth(req, res, next){
  if(req.isAuthenticated()){
    next();
  }else{
    res.json({msg: "User Not Authorized"})
  }

}

function isLogedIn(req, res, next){
  if(req.isAuthenticated()){
    req.isLogedIn = true;
  }else{
    req.isLogedIn = false;
  }
  next();
}


module.exports = {auth, isLogedIn};
