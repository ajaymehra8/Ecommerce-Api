const dotenv = require("dotenv");
const slugify = require("slugify");
const productModel = require("../models/productModel");
const fs = require("fs");
const categoryModel = require("../models/categoryModel");
const braintree = require("braintree");
const orderModel = require("../models/orderModel");
dotenv.config();

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_Merchant_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    const product = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      message: "Problem in creating product",
    });
  }
};

//get all products

const getProductController = async (req, res) => {
  try {
    const product = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      total: product.length,
      message: "Product are available",
      product,
    });
  } catch (error) {
    
    res.status(4000).send({
      success: true,
      message: "Error in getting product",
    });
  }
};

//getting single product

const getOneProductController = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productModel.findOne({ slug }).select("-photo");
    res.status(200).send({
      success: true,
      message: "Single Product are available",
      product,
    });
  } catch (error) {
    
    res.status(4000).send({
      success: true,
      message: "Error in getting single product",
    });
  }
};
//get photos

const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    
    res.status(400).send({
      success: true,
      message: "Error in getting photo",
    });
  }
};

const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    
    res.status(400).send({
      success: true,
      message: "Error in deleting product",
    });
  }
};

const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error); // Log the detailed error for debugging
    res.status(400).send({
      success: false,
      message: `Error in updating product: ${error.message}`, // Send a more detailed error message
    });
  }
};

//filter product controller

const filterProductsController = async (req, res) => {
  try {
    const { check, radio } = req.body;
    let args = {};
    if (check.length > 0) args.category = check;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      message: "Products filtered successfully",
      products,
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      message: "Problem in filtering product",
    });
  }
};

//Product count controller

const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      message: "Product counted successfully",
      total,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Problem in Pagination",
    });
  }
};

//product list controller

const productListController = async (req, res) => {
  try {
    const perPage = 8;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      message: "problem in pagination 2",
    });
  }
};

//search product controller

const productSearchController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(result);
  } catch (error) {
    
    res.status(400).send({
      success: false,
      message: "Product not fount",
    });
  }
};

//Related product controller

const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit("3")
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Problem in showing related products",
    });
  }
};

//product category controller

const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const product = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      message: "Product according to category ",
      category,
      product,
    });
  } catch (error) {
    
    res.status(400).send({
      success: false,
      message: "Error while showing product category wise",
    });
  }
};

//payment token controller

const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, result) {
      if (err) res.status(500).send(err);
      else {
        res.send(result);
      }
    });
  } catch (error) {
    
    res.status(400).send({
      success: false,
      message: "Problem in payment token",
    });
  }
};

//payment controller

const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (err, res) {
        if (res) {
          const order = new orderModel({
            products: cart,
            payment: res,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send("Error");
        }
      }
    );
  } catch (error) {
    
    res.status(400).send({
      success: false,
      message: "Problem in payment token",
    });
  }
};
module.exports = {
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
  braintreeTokenController,
  braintreePaymentController,
};
