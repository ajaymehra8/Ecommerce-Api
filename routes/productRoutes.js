const express = require("express");
const { requireSignin, isAdmin } = require("../middlewares/authMiddleware");
const {
  createProductController,
  getProductController,
  getOneProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  filterProductsController,
  productCountController,
  productListController,
  productSearchController,
  relatedProductController,
  productCategoryController,
  braintreePaymentController,
  braintreeTokenController
} = require("../controllers/productController");
const ExpressFormidable = require("express-formidable");
const { query } = require("express-validator");

const router = express.Router();

//routes

//creating products
router.post(
  "/create-product",
  requireSignin,
  isAdmin,
  ExpressFormidable(),
  createProductController
);

//getting products

router.get("/get-product", getProductController);

//filter products

router.post("/filter-products", filterProductsController);

//getting single products
router.get("/getSingle-product/:slug", getOneProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//product count
router.get("/product-count",productCountController);

//product per page

router.get("/product-list/:page",productListController);


//delete product

router.delete("/product-delete/:pid", deleteProductController);

//filter product by search
router.get("/search/:keyword",productSearchController);

//show related product by search
router.get("/related-product/:pid/:cid",relatedProductController);

//category wise product
router.get("/product-category/:slug",productCategoryController);

//payment route

router.get("/braintree/token",braintreeTokenController);

//post payment
router.post("/braintree/payment",requireSignin,braintreePaymentController);

//update product 
router.put("/update-product/:pid",  requireSignin,
isAdmin,  ExpressFormidable(),
query("name").notEmpty().withMessage("Person is required"),
query("price").notEmpty().withMessage("required thing"),
query("description").notEmpty().withMessage("required thing"),
query("category").notEmpty().withMessage("required thing"),
query("quantity").notEmpty().withMessage("required thing"),
query("photo").notEmpty().withMessage("required thing"),updateProductController);

module.exports = router;
