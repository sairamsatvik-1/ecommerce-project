const express=require("express");
const mongoose=require('mongoose');
const productschema=new mongoose.Schema({
    name:{type:String,required:true},
    price:{
        type:Number,
        required:true

    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    type: { type: String, required: true },  
  subcategory: { type: String, required: true }, 
  section:{
    type:String,
    required:true,
  },
});
const products=mongoose.model('product',productschema);
module.exports=products;