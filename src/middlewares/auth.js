const adminAuth = (req, res, next) => {
    console.log("User auth is getting check.");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(410).send("Unauthorized request.");
    }else{
        next();
    }
}

const userAuth = (req, res, next) => {
    console.log("User auth is getting check.");
    const token = "xyz";
    const userAuthorized = token === "xyz";
    if(!userAuthorized){
        res.status(401).send("Unauthorized request.");
    }else{
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth
}
