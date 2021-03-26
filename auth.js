function auth(req, res, next){
    console.log("Autheicating...")
    next();
}

module.exports = auth;