const User = require('../model/userSchema');
const Product = require("../model/ProductSchema");
const Category = require("../model/CetSchema");
const SubCategory = require("../model/SubCetSchema");
const passport = require('../config/passport');
const MainCategory = require("../model/MainCetSchema");
const fs = require('fs');
const path = require('path');

module.exports.dashboard = (req, res) => {
 res.render('Admin/dashboard', {
    admin: req.user.admin,
  });
};

module.exports.AddAdmin = (req, res) => {
 res.render("Admin/addAdmin");
};

module.exports.ViewAdmin = async (req, res) => {
 
  try {
    const products = await Product.find({}); 
    res.render('Admin/viewAdmin', { products });
  } catch (error) {
    console.error("Error fetching admin view data:", error);
  }
};


module.exports.AddProduct = async (req, res) => {
  try {
    const mainCategories = await MainCategory.find();
    const categories = await Category.find();
    const subcategories = await SubCategory.find();

    res.render('Admin/addProduct', {
      product: null, 
      mainCategories, 
      categories,     
      subcategories   
    });
  } catch (error) {
    console.error('Error rendering add product form:', error);
  }
};


module.exports.AddNewProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      mainCategory,
      category,
      subcategory,
      price,
      sizes,        
      sizeCounts,   
      estimatedDelivery,
      freeShipping
    } = req.body;
    const sizesArray = Array.isArray(sizes) ? sizes : [sizes];
    const sizeCountsArray = Array.isArray(sizeCounts) ? sizeCounts : [sizeCounts];

    
    let totalStock = sizeCountsArray.reduce((sum, count) => sum + parseInt(count), 0);

    
    let images = [];
    if (req.files) {
      images = req.files.map(file => ({ url: file.path }));
    }

    
    const newProduct = await Product.create({
      name,
      description,
      maincategory: mainCategory,
      category: category,
      subcategory: subcategory,
      price,
      size: {
        sizes: sizesArray,
        sizeCounts: sizeCountsArray.map(count => parseInt(count))
      },
      stock: totalStock,
      estimatedDelivery,
      freeShipping: !!freeShipping, 
      images
    });
    res.redirect('/Admin/ViewProduct');
  } catch (error) {
    console.error('Error creating product:', error);
    
  }
};


module.exports.ViewProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('maincategory').populate('category').populate('subcategory');
    if (!products) return res.status(404).send('No products found');
    res.render('Admin/ViewProduct', { products });
  } catch (error) {
    console.error('Error fetching products:', error);
     
  }
};





// Edit an existing product
exports.UpdateProduct = async (req, res) => {
  try {
      let product = await Product.findById(req.params.id);
      if (!product) {
          return res.status(404).send('Product not found');
      }

      product.name = req.body.name;
      product.description = req.body.description;
      product.mainCategory = req.body.mainCategory;
      product.category = req.body.category;
      product.subcategory = req.body.subcategory;
      product.price = req.body.price;
      product.sizes = req.body.sizes;
      product.sizeCounts = req.body.sizeCounts;
      product.stock = req.body.stock;
      product.reviews = req.body.reviews;
      product.estimatedDelivery = req.body.estimatedDelivery;
      product.freeShipping = req.body.freeShipping ? true : false;
      if (req.files) {
          if (product.images.length > 0) {
              product.images.forEach(image => {
                  const imagePath = path.join(__dirname, '../uploads/', image.url);
                  fs.unlink(imagePath, err => {
                      if (err) console.error('Error deleting image:', err);
                  });
              });
          }

          let newImages = [];
          req.files.forEach(file => {
              newImages.push({ url: file.filename });
          });

          product.images = newImages;
      }

      await product.save();
      res.redirect('/admin/ViewProduct');
  } catch (error) {
      console.error('Error updating product:', error);
       
  }
};

exports.DeleteProduct = async (req, res) => {
  try {
      let product = await Product.findById(req.params.id);
      if (!product) {
          return res.status(404).send('Product not found');
      }

      if (product.images.length > 0) {
          product.images.forEach(image => {
              const imagePath = path.join(__dirname, '../uploads/', image.url);
              fs.unlink(imagePath, err => {
                  if (err) console.error('Error deleting image:', err);
              });
          });
      }

      await Product.findByIdAndDelete(req.params.id);
      res.redirect('/admin/ViewProduct');
  } catch (error) {
      console.error('Error deleting product:', error);
       
  }
};


module.exports.MainCategory = (req, res) => {
 res.render("Admin/addMainCategory", { category: null });
};

module.exports.AddMainCategory = async (req, res) => {
 
  try {
    if (req.file) {
      req.body.image = req.file.filename; 
    } else {
      throw new Error('No file uploaded'); 
    }
    await MainCategory.create(req.body);
    res.redirect('/Admin/ViewMainCategory'); 
  } catch (error) {
    console.error(error);
     
  }
};

module.exports.ViewMainCategory = async (req, res) => {
 
  try {
    const data = await MainCategory.find(); 
    res.render('Admin/ViewMainCategory', { data }); 
  } catch (error) {
    console.error(error);
  
  }
};

module.exports.UpdateMainCategory = async (req, res) => {
 

  try {
    const updatedData = {
      name: req.body.name 
    };

    if (req.file) {
      updatedData.image = req.file.filename; 
    }
    await MainCategory.findByIdAndUpdate(req.params.id, updatedData);
    res.redirect('/Admin/ViewMainCategory');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating category');
  }
};

module.exports.EditMainCategory = async (req, res) => {
 
  try {
  
    const category = await MainCategory.findById(req.params.id);
    res.render('Admin/addMainCategory', { category }); 
  } catch (error) {
    console.error(error);
  }
};

module.exports.DeleteMainCategory = async (req, res) => {
 

  try {
    const categoryId = req.params.id;
    await MainCategory.findByIdAndDelete(categoryId);

    res.redirect('/Admin/ViewMainCategory');
  } catch (error) {
    console.error('Error deleting category:', error);
  }
};



module.exports.SubCategory = (req, res) => {
 res.render("Admin/addSubCategory", { SubCet: null });
};

module.exports.AddSubCategory = async (req, res) => {
 
  try {
    if (req.file) {
      req.body.image = req.file.filename; 
    } else {
      throw new Error('No file uploaded'); 
    }
    await SubCategory.create(req.body);
    res.redirect('/Admin/ViewSubCategory');
  } catch (error) {
    console.error(error);
     
  }
};

module.exports.ViewSubCategory = async (req, res) => {
  if (!req.user) {
    return res.redirect('/');  
  }
  
  try {
    const Subdata = await SubCategory.find(); 
    res.render('Admin/ViewSubCategory', { Subdata }); 
  } catch (error) {
    console.error(error);
  
  }
};

module.exports.UpdateSubCategory = async (req, res) => {
 

  try {
    const updatedData = {
      name: req.body.name 
    };
    if (req.file) {
      updatedData.image = req.file.filename; 
    }
    await SubCategory.findByIdAndUpdate(req.params.id, updatedData);
    res.redirect('/Admin/ViewSubCategory');
  } catch (error) {
    console.error(error);
  }
};

module.exports.EditSubCategory = async (req, res) => {
 
  try {
    const SubCet = await SubCategory.findById(req.params.id);
    res.render('Admin/addSubCategory', { SubCet });
  } catch (error) {
    console.error(error);
  }
};

module.exports.DeleteSubCategory = async (req, res) => {
 
  try {
    const categoryId = req.params.id;
    await SubCategory.findByIdAndDelete(categoryId);

    res.redirect('/Admin/ViewSubCategory');
  } catch (error) {
    console.error('Error deleting category:', error);
  }
};




module.exports.Category = (req, res) => {
 
  res.render("Admin/addCategory", { SubCet: null });
};

module.exports.AddCategory = async (req, res) => {
 
  try {
    if (req.file) {
      req.body.image = req.file.filename; 
    } else {
      throw new Error('No file uploaded'); 
    }
    await Category.create(req.body);
    res.redirect('/Admin/ViewCategory'); 
  } catch (error) {
    console.error(error);
  }
};

module.exports.ViewCategory = async (req, res) => {
 
  try {
    const data = await Category.find();
    res.render('Admin/ViewCategory', { data });
  } catch (error) {
    console.error(error);
  }
};

module.exports.UpdateCategory = async (req, res) => {
 
  try {
    const updatedData = {
      name: req.body.name
    };
    if (req.file) {
      updatedData.image = req.file.filename; 
    }
    await Category.findByIdAndUpdate(req.params.id, updatedData);
    res.redirect('/Admin/ViewCategory');
  } catch (error) {
    console.error(error);
  }
};

module.exports.EditCategory = async (req, res) => {
 
  try {
    const SubCet = await Category.findById(req.params.id);
    res.render('Admin/addCategory', { SubCet }); 
  } catch (error) {
    console.error(error);
  }
};

module.exports.DeleteCategory = async (req, res) => {
 
  try {
    const categoryId = req.params.id;
    await Category.findByIdAndDelete(categoryId);
    res.redirect('/Admin/ViewCategory');
  } catch (error) {
    console.error('Error deleting category:', error);
  }
};