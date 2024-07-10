const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
const JWT = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const orderModel = require("../models/orderModel");


const registerController = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(200)
        .json({ success: false, message: "Password is too short" });
    }

    const { name, email, password, phone, address, question } = req.body;

    // Check existing user
    const existingUser = await userModel.findOne({ email });

    // Existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered, please login",
      });
    }

    // Register user
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      question,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

//POST LOGIN
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // Compare passwords
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).send({
      success: false,
      message: "Error in login",
    });
  }
};


const forgotPasswordController = async (req, res) => {
  try {
    const { email, question, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ success: false, message: "Email is required" });
    }
    if (!question) {
      res.status(400).send({ success: false, message: "Question is required" });
    }
    if (!newPassword) {
      res.status(400).send({ success: false, message: "Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, question });

    if (!user) {
      res.status(404).send({ success: false, message: "You are hacker" });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password changed",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

//test controller
const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    res.send({ error });
  }
};

//update controller

const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.find({ email: email });
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      user[0]?._id,
      {
        name: name||user.name,
        password: hashedPassword||user.password,
        phone: phone||user.phone,
        address: address||user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products")
      .select("-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    res.status(200).send({
      success: false,
      message: "Problem in orders",
    });
  }
};

const getAllOrdersController = async (req, res) => {
  try {
      const orders = await orderModel
        .find({})
        .populate("products")
        .populate("buyer");
      res.json(orders);
    }  catch (error) {

      res.status(200).send({
      success: false,
      message: "Problem in orders",
    });
  };
};
//order status controller

const orderStatusController=async(req,res)=>{
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { statue:status },
      { new: true }
    );
    res.json(orders);
  } catch(err){
    res.status(500).send({
      success:false,
      message:"Problem in updating status"
    })
  }
}

module.exports = {
  loginController,
  registerController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController
};
