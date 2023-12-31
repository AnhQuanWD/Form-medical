const router = require("express").Router()
const {User} = require("../models/user")
const joi = require('joi')
const bcrypt = require('bcrypt')

router.post("/", async(req, res)=>{
  try {
    const {error} = validate(req.body)
    if(error){
      return res.status(400).send({message: error.detail[0].message})
    }

    const user = await User.findOne({email: req.body.email})
    if(!user){
      return res.status(401).send({message: "Invalid Email or Password"})
    }

    const validatePassword = await bcrypt.compare(
      req.body.password, user.password
    )
    if(!validatePassword){
      return res.status(401).send({message: "Invalid Email or Password"})
    }

    const token = user.generateAuthToken()
    res.status(200).send({data: token, message: "Logged in successfully"})
  } catch (error) {
    res.status(500).send({message: "Internal Server Error!"})
  }
})

const validate = (data) => {
  const schema = joi.object({
    email: joi.string().email().require().lable("Email"),
    password: joi.string().password().require().label("Password")
  }) 
  return schema.validate(data)
}

module.exports = router