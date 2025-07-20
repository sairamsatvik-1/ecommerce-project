const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const reviewRoutes = require('./routes/reviews');
const bodyParser = require('body-parser');
const cartRoutes = require('./routes/cartRoutes'); 
const bcrypt = require('bcrypt');
const product = require('./public/product');
const logininfo = require('./public/login');
const nodemailer=require('nodemailer');
const otpmap=new Map();
const pendingUserMap = new Map(); 
function generateotp(){
    return Math.floor(100000+Math.random()*900000).toString();
}
app.use(express.json());
app.use(bodyParser.json());
app.use(session({
    secret:"myshopsecret2005",
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI, collectionName: 'sessions' }),
    cookie:{
        maxAge:1000*60*60*24,
        secure: false,
    }
}));
app.use('/api/reviews', reviewRoutes);
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'myshopatforyou@gmail.com',
        pass: 'waoc crbz fyjt jugm',
    }
});

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));
app.use('/api/cart', cartRoutes);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'myproject.html'));
});
app.get('/api/products', async (req, res) => {
    const section = req.query.section;
    const limit = parseInt(req.query.limit) || 0;
    const query = section ? { section } : {};
    try {
          const products = await product.find(query).limit(limit);
          console.log("products are",products);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
app.post("/Login",async (req,res)=>{
    try{
        const { email, password } = req.body;
        console.log( email, password );
        const user = await logininfo.findOne({ email });
      if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        req.session.user = {
            id: user._id,
            email: user.email,
            name: user.username
          };
          console.log("Session after login:", req.session);  // Debug session
       
          res.status(200).json({ redirect: "/dashboard" });
        
        
    }
    catch(err){
        res.status(500).json({ error: "Server error" });
    }

});
function isAuthenticated(req, res, next) {
    if (req.session.user) {
      next(); 
    } else {
        res.sendFile(path.join(__dirname, 'public', 'account.html'));
  
    }
  }
app.get('/dashboard',isAuthenticated,(req,res)=>{
    console.log('User session:', req.session.user);  // Log session to check data
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'public', 'myproject.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public', 'account.html'));
    }});
app.get('/check-session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, name: req.session.user.name });
    } else {
        res.json({ loggedIn: false });
    }
});

app.post("/Otpsend",async (req,res)=>{
    const { email, password ,username} = req.body;
  
  const userExits=await logininfo.findOne({username});
  if(userExits){
    return res.status(409).json("userexits");
  }
  console.log(username, email, password);
  const emailExists = await logininfo.findOne({ email });
  if (emailExists) return res.status(409).json("emailexits");

  const otp = generateotp();
  const expiresAt = Date.now() + 5 * 60 * 1000;
        otpmap.set(email, { otp, expiresAt });
        pendingUserMap.set(email, { email,password,username});
    const mailOptions = {
        from: 'myshopatforyou@gmail.com',
        to: email,
        subject: 'Your OTP for MyShop Signup',
        text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent successfully' });
    }

    catch(err){
        console.error(err);
        res.status(500).json({ error: "failed to send otp" });
    }

});


app.post('/otp',async (req,res)=>{
    const { email, otp: receivedOtp } = req.body;
   const record = otpmap.get(email);
    if (!record) return res.status(400).json("otpexpired");
    const { otp, expiresAt } = record;
    if (Date.now() > expiresAt) {
        otpmap.delete(email);
        pendingUserMap.delete(email);
        return res.status(400).json("otpexpired");
    }

    if (receivedOtp !== otp) return res.status(409).json("invalidotp");
    const userData = pendingUserMap.get(email);
    if (!userData) return res.status(400).json("usernotfound");
    try {
        userData.password = await bcrypt.hash(userData.password,10);
        const newUser = new logininfo(userData);
        await newUser.save();
        otpmap.delete(email);
        pendingUserMap.delete(email);
        res.status(200).json("signupsuccess");
    } catch (err) {
        console.error("Error saving user:", err);
        res.status(500).json("servererror");
    }





})
app.get("/profile",async (req,res)=>{
    const pdata=req.session.user;
    if(pdata){
        res.status(200).json(pdata);
    }
    else{
        res.status(500).json("servererror");
    }
});
app.get("/logout",async (req,res)=>{
    if(req.session.user){
        req.session.destroy((err) => {
            if (err) {
              console.log("Error destroying session:", err);
              return res.status(500).send("Server error");
            }
            res.clearCookie("connect.sid"); 
            res.status(200).send("Logged out");
          });
    }
});
const reviewRoutes = require('./routes/reviews');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
