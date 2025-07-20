const mongoose=require('mongoose');
const logininfo=require('./login');
const bcrypt = require('bcrypt');
mongoose.connect("mongodb://127.0.0.1:27017/myshop",{
    useNewUrlParser:true,
    useUnifiedTopology:true

}).then(()=>{
    console.log('Connected to MongoDB for seeding');
    hashPasswords(); 
}).catch((err)=>{
    console.error("mongo error:",err);
});

async function hashPasswords() {
    try {
      const users = await logininfo.find({});
      for (const user of users) {

        const isAlreadyHashed = user.password.startsWith('$2b$');
        if (!isAlreadyHashed) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
          await user.save();
          console.log(`Password hashed for user: ${user.username}`);
        } else {
          console.log(`Already hashed: ${user.username}`);
        }
      }
      console.log(' Password update completed.');
      process.exit();
    } catch (err) {
      console.error('Error hashing passwords:', err);
      process.exit(1);
    }
  }