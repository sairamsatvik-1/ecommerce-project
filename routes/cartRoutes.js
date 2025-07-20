const express = require('express');
const router = express.Router();
const logininfo = require('../public/login');
router.post('/addtocart',async (req,res)=>{
    let {productId,image,price,quantity}=req.body;
    quantity=parseInt(quantity);
    price=parseInt(price);
    try{
        if (!req.session.user) {
            return res.status(401).json("Unauthorized");
        }
        const user = await logininfo.findById(req.session.user.id);
        if(!user){
            return res.status(404).send("User not found");
       
        }
        const existingProduct = user.cart.find(item => item.productId === productId);
        if(existingProduct){
            existingProduct.quantity += quantity;
        }
else{
    user.cart.push({ productId, image, price, quantity });
       
}
    await user.save();
    res.status(200).json(user.cart);
    }
    catch(err){
        console.error(err);
        res.status(500).send("Server error");
    }
});
router.post('/removefromcart', async (req, res) => {
    const {productId} = req.body;

    try {
       
        if (!req.session.user) {
            return res.status(401).json("Unauthorized");
        }
        const user = await logininfo.findById(req.session.user.id);

        if (!user) {
            return res.status(404).json("User not found");
        }
        user.cart = user.cart.filter(item => item.productId !== productId);

       await user.save();

        res.status(200).json(user.cart);
    } catch (err) {
        console.error(err);
        res.status(500).json("Server error");
    }
});
router.post("/updatecart",async (req,res)=>{
    let {productId,quantity}=req.body;
    console.log(quantity);
    quantity=parseInt(quantity);
    try{
        if (!req.session.user) {
            return res.status(401).json("Unauthorized");
        }
        const user = await logininfo.findById(req.session.user.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const item = user.cart.find(i => i.productId === productId);
        if (!item) return res.status(404).json({ msg: "Item not found" });
        if (quantity === 0) {
            user.cart = user.cart.filter(i => i.productId !== productId);
          } else {
            item.quantity = quantity;
          }
          await user.save();
          res.status(200).json(user.cart);
    }
    catch(err){
        console.error(err);
        res.status(500).json("Server error");
  
    }
});
router.get("/showcart",async (req,res)=>{
   try{ if (!req.session.user) {
        return res.status(401).json("Unauthorized");
    }
    const user = await logininfo.findById(req.session.user.id);
    if (!user) {
        return res.status(404).json("User not found");
    }
    console.log(user.cart);
    res.status(200).json(user.cart);
}
    catch(err){
        console.log(err);
        res.status(500).json("error");
    }
});
router.get("/clear",async (req,res)=>{
    try{
        if (!req.session.user) {
            return res.status(401).json("Unauthorized");
        }
        const user = await logininfo.findById(req.session.user.id);
        if (!user) {
            return res.status(404).json("User not found");
        }
        user.cart=[];
await user.save();
res.status(200).json("cleared");
    }
    catch(err){
        console.log(err);
        res.status(500).json("error");

    }
})
router.get("/checkout",async (req,res)=>{
    try{ if (!req.session.user) {
         return res.status(401).json("Unauthorized");
     }
     const user = await logininfo.findById(req.session.user.id);
     if (!user) {
         return res.status(404).json("User not found");
     }
     console.log(user.cart);
     res.status(200).json(user.cart);
 }
     catch(err){
         console.log(err);
         res.status(500).json("error");
     }
 });
module.exports=router;