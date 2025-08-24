// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const AouthRouter = require("./Routs/AouthRouters.js");
// require("dotenv").config();
// require("./Models/db.js");
// const port = process.env.PORT || 1515;
// app.get("/ping", (req, res) => res.send("Meer Gulshan"));
// app.listen(port,()=>console.log(Server is running on ${port}));
// app.use(bodyParser.json());
// app.use(cors());
// app.use("asl_aouth/",AouthRouter);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app=express()
const EmployeeModel = require("./Models/Employee.js");
const e = require("express");
app.use(express.json())
app.use(cors())
mongoose.connect("mongodb://127.0.0.1:27017/employees");
app.post('/login',(req,res)=>{
    const {email,password}=req.body;
    EmployeeModel.findOne({email:email,password:password})
    .then(data=> {
    if(data){
         if(data.password===password){
            res.json("Login Successfully")
        }
        else{
            res.json({message:"Invalid Credentials"})
        }
     }
        else{
            res.json({message:"No record Found"})
        }
        
    })
    .catch(err=>res.json(err))
})
app.post('/register',(req,res)=>{
    EmployeeModel.create(req.body)
    .then(data=>res.json(data))
    .catch(err=>res.json(err))

})
app.listen(1515,()=>console.log("Server is running on 1515"))
//Forget-password//
// index.js (backend)
app.post('/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await EmployeeModel.findOne({ email: email });

    if (!user) {
      return res.json({ success: false, message: "Email not registered" });
    }

    user.password = newPassword; // ⚠️ In production, hash with bcrypt
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Something went wrong" });
  }
});
