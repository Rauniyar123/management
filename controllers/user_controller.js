/*.........import models............*/
const User = require("../models/user_models");


/*............import dependancies................*/
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();
const moment = require('moment-timezone');


/*.................make function and user it........*/
function unique_user() {
  const OTP = Math.floor(100000 + Math.random() * 900000);
  return OTP;
}

function generateRandomString() {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const length = 8;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(index);
  }

  return randomString;
}

function generateuniqueId() {
  const characters = "0123456789";
  const length = 8;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(index);
  }

  return randomString;
}

function generateFriendQrcode() {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const length = 250;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(index);
  }

  return randomString;
}

function generatePaymentQrcode() {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const length = 250;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(index);
  }

  return randomString;
}

function generateOrderQrcode() {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const length = 50;
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(index);
  }

  return randomString;
}

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}




const addUser = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      conformPassword,
      fcmId,
      phone,
      dob,
      gender,
     
    } = req.body;
   
    if (
      !userName ||
      !email ||
      !password ||
      !conformPassword ||
      !fcmId
    ) {
      return res.status(400).json({
        result: "false",
        message:
          "required parameters are userName,email,countryName,password,conformPassword,fcmId,phone, dob,gender,userProfile",
      });
    }
    
    const exist_user = await User.findOne({email});
    if (exist_user) {
      return res
        .status(400)
        .json({ result: "false", message: "User allready exist" });
    }
    if (password !== conformPassword) {
      return res
        .status(400)
        .json({ result: "false", message: "Passwords do not match." });
    }

    const hashedPasswords = await bcrypt.hash(password, 10);
    const uniqueId = generateuniqueId();

    const insertUser=new User({userName,uniqueId,email,password:hashedPasswords,phone,gender,dob,userProfile,fcmId});
      const data=  await insertUser.save();
        res.status(200).json({
          result: "true",
          message: "User added sucessfully",
          data: data,
        });

  } catch (err) {
    res.status(400).json({ result: "false", message: err.message });
    console.log(err.message);
  }
};




/*................user_login.................*/
const allUserList = async (req, res) => {
  try {
      const Data = await User.find({userStatus:0});
      if (!Data) {
        return res
          .status(400)
          .json({ result: "false", message: "Users does not found" });
      } 
            res.status(200).json({
              result: "true",
              message: "User login successfully",
              data: Data,
            });
          
  } catch (err) {
    res.status(400).json({ result: "false", message: err.message });
  }
};


/*...................update userProfile............*/
const updateUserProfile = async (req, res) => {
  try {
    const { userName,email,phone, dob, gender, userId } = req.body;
    const userProfile = req.file ? req.file.filename : null;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({
        result: "false",
        message: "required parameter is userId, and optional parameters are userName, countryName, phone, dob, gender, userProfile",
      });
    }

    // Check if the user exists
    const matchData = await User.findById(userId);
    if (!matchData) {
      return res.status(404).json({
        result: "false",
        message: "User does not exist",
      });
    }

    // Build update data object based on whether a profile image is uploaded
    let updateData = {
      userName,
      countryName,
      phone,
      dob,
      gender,
    };
    if (userProfile) {
      updateData.userProfile = userProfile;
    }

    // Update the user profile
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(500).json({
        result: "false",
        message: "Failed to update user",
      });
    }

    res.status(200).json({
      result: "true",
      message: "User data updated successfully",
      data: updatedUser,  // Return the updated user data for confirmation
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      result: "false",
      message: "An error occurred while updating the user profile",
    });
  }
};




/*................getUser_profile................*/
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
     return res
        .status(400)
        .json({ result: "false", message: "required parameter userId" });
    }
      const matchData = await User.findOne({ _id: userId });
      if(!matchData){
        return res
        .status(400)
        .json({ result: "false", message: "Record not found" });
      }
     
        res.status(200).json({
          result: "true",
          message: "user profile data are",
          path:process.env.image_url,
          data: [matchData],
        });
    
  } catch (err) {
    res.status(400).json({ result: "false", message: err.message });
  }
};



/*....................exports variables...........*/
module.exports = {
  addUser,
  allUserList,
  updateUserProfile,
  getUserProfile,
 
  
 
};
