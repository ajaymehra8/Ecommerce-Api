const categoryModel = require("../models/categoryModel");
const slugify = require("slugify");
const userModel = require("../models/userModel");

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res
        .status(200)
        .send({ success: true, message: "Category already exist" });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();

    res
      .status(201)
      .send({ success: true, message: "New category created", category });
  } catch (error) {
    
    res.statue(404).send({
      success: false,
      message: "Problem in category",
    });
  }
};

//update category

const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res
      .status(200)
      .send({ success: true, message: "Category updated successfully" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Problem in Updating category",
    });
  }
};

//Get all category

const categoryController = async (req, res) => {
  try {

    const category=await categoryModel.find({});
    res.status(200).send({
        success:true,
        message:"All Categories List",
        category
    })
  } catch (error) {
    
    res.status(400).send({
      success: false,
      message: "Problem in category founding",
    });
  }
};

//single Category
const singleCatController=async(req,res)=>{
try{
const category=await categoryModel.findOne({slug:req.params.slug});
res.status(200).send({
    success:true,
    message:"This is your category",
    category
})
}catch (error) {
    
    res.status(400).send({
      success: false,
      message: "Problem in getting single category",
    });
  }
}

//delete category controller

const deleteCatController=async(req,res)=>{
try{
const {id}=req.params;
await categoryModel.findByIdAndDelete(id);
res.status(200).send({
    success:true,
    message:"Category Deleted successfully"
})

}catch(error){
    
    res.status(400).send({
        success:false,
        message:"Unsuccessful in deleting category"
    })
}
}

module.exports = {
  createCategoryController,
  updateCategoryController,
  categoryController,
  singleCatController,
  deleteCatController
};
