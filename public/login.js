const mongoose=require("mongoose");
const express=require('express');
const loginsch=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    cart: [
        {
            productId: String,
            image:String,
            price:Number,
            quantity: Number,
        }
    ]
})
const logininfo=mongoose.model('logininfo',loginsch,'logininfo');
module.exports=logininfo;
