const express = require("express");
const { isAdmin, requireSignin } = require("../middlewares/authMiddleware");
const {
  createCategoryController,
  updateCategoryController,
  categoryController,
  singleCatController,
  deleteCatController,
} = require("../controllers/createCategoryController");

const router = express.Router();

//routes
//create-category
router.post(
  "/create-category",
  requireSignin,
  isAdmin,
  createCategoryController
);

//update-category
router.put(
  "/update-category/:id",
  requireSignin,
  isAdmin,
  updateCategoryController
);

//get all category
router.get("/categories", categoryController);
//single category
router.get("/single-category/:slug",singleCatController);

//delete category
router.delete("/delete-category/:id",deleteCatController)

module.exports = router;
