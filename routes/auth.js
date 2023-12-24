const express = require("express");
const {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController
} = require("../controllers/authController");
const { requireSignin, isAdmin } = require("../middlewares/authMiddleware");
const { body, validationResult } = require("express-validator");

// Router object
const router = express.Router();

// Validation middleware for register route
const registerValidation = [
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
];

// Routing

// Register || method: POST
router.post("/register", registerValidation, registerController);

// Login || method: POST
router.post("/login", loginController);

// Test route || method: POST
router.get("/test", requireSignin, isAdmin, testController);

//forgot question
router.post("/forgot-password", forgotPasswordController);

//protected User route for dashboard
router.get("/user-auth", requireSignin, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});
//update-profile
router.put("/profile", updateProfileController);

//protected Admin route for dashboard
router.get("/admin-auth", requireSignin, isAdmin, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

//order get

router.get("/orders", requireSignin, getOrdersController);


//all-order get

router.get("/all-orders", requireSignin,isAdmin, getAllOrdersController);

//order status get

router.put("/order-status/:orderId", requireSignin,isAdmin, orderStatusController);

module.exports = router;
