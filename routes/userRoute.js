// these component used to organization to redius routing in app.js

const express = require('express');
const router = express.Router();

  // user controllers
const {register,login,checkUser} = require("../controller/userController");
const authMiddleware = require('../middleware/authMiddleware');
     

    // register route

    router.post( "/register",register)
    
    // login user
    router.post( "/login",login)
        
    // check user
    router.get( "/check", authMiddleware, checkUser)

 module.exports = router

