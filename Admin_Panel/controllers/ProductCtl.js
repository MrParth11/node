const Product = require('../model/ProductSchema'); // Assuming ProductSchema is the correct path

// Render Add Product Page
exports.addProduct = (req, res) => {
    res.render('Admin/addProduct');
};

// View All Products
exports.viewProduct = async (req, res) => {
    try {
        const products = await Product.find({});
        if (products.length > 0) {
            res.render("Admin/viewProduct", { products });
        } else {
            console.log("No products found");
            res.render("Admin/viewProduct", { products: [] });
        }
    } catch (error) {
        console.log("Something went wrong:", error);
        res.status(500).send("Error fetching products");
    }
};

// Create New Product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, mainCategory, categories, stock, reviews, estimatedDelivery, freeShipping, sizes, sizeCounts } = req.body;
        
        // Process uploaded images
        const images = req.files ? req.files.map(file => ({ url: file.filename })) : [];

        // Process sizes and sizeCounts
        // Check if sizes is a string, if so, split it into an array
        const sizeArray = Array.isArray(sizes) ? sizes.map(size => size.trim()) : sizes ? sizes.split(',').map(size => size.trim()) : [];
        const sizeCountArray = Array.isArray(sizeCounts) ? sizeCounts.map(count => parseInt(count.trim(), 10)) : sizeCounts ? sizeCounts.split(',').map(count => parseInt(count.trim(), 10)) : [];

        // Create a new product document
        const newProduct = new Product({
          name,
          description,
          price,
          images,
          mainCategory,
          categories: categories ? categories.split(',').map(cat => cat.trim()) : [],
          stock,
          reviews,
          estimatedDelivery,
          freeShipping: !!freeShipping,
          sizes: sizeArray,
          sizeCounts: sizeCountArray
        });
    
        await newProduct.save();
        res.redirect('/admin/dashboard'); // Adjust redirect as needed
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};




// Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('User/index', { products });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Error fetching products");
    }
};

// Get Product by ID for Edit
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.render('Admin/editProduct', { product });
        } else {
            res.status(404).send("Product not found");
        }
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).send("Error fetching product");
    }
};

// Update Product by ID
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, mainCategory, categories, stock } = req.body;
        
        // Handle updating images (if multiple images)
        const images = req.files ? req.files.map(file => ({ url: file.filename })) : [];

        // Splitting categories by commas and trimming whitespace
        const categoryArray = categories.split(',').map(cat => cat.trim());

        const updateData = {
            name,
            description,
            price,
            stock,
            mainCategory,  // Ensure this is included
            categories: categoryArray 
        };

        if (images.length > 0) {
            updateData.images = images;  // Updating images array if new images are uploaded
        }

        await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        const products = await Product.find({});
        res.render('Admin/viewProduct', { products });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Error updating product");
    }
};


// Delete Product by ID
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/viewProduct');
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("Error deleting product");
    }
};

// Get Products by Size
exports.getProductsBySize = async (req, res) => {
    const size = req.params.size;
    try {
        const products = await Product.find({ sizes: size }); // Assuming 'sizes' is an array in your product schema
        if (products.length > 0) {
            res.render('User/index', { products });
        } else {
            res.render('User/index', { products: [] }); // No products found
        }
    } catch (error) {
        console.error("Error fetching products by size:", error);
        res.status(500).send("Error fetching products");
    }
};

exports.SingleProduct = async (req, res) => {
    const productId = req.params.id; // ID of the product from the URL
    try {
        // Fetch the single product by ID
        const singleProduct = await Product.findById(productId);

        if (singleProduct) {
           console.log(singleProduct)
            res.render('User/single', { product: singleProduct });
        } else {
            // Render the page with no product found (pass null)
            res.render('User/single', { product: null });
        }
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        res.status(500).send("Error fetching product");
    }
};


exports.getCategoryProducts = async (req, res) => {
    try {
      const category = req.params.category;
      let size = req.query.size; // Access size filter from query parameters
  
      const filter = { category };
      if (size) {
        filter.size = size; // Apply size filter if provided
      }
  
      const products = await Product.find(filter);
  
      // Log products and category for debugging
      console.log(products);
      console.log(category);
  
      // Fetch categories and sizes for filters
      const categories = await Product.distinct('category');
      const sizes = await Product.distinct('size');
  
      res.render('User/collection', {
        products,
        category,
        categories,
        sizes,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };
  

exports.getProductsByCategory = async (req, res) => {
    const category = req.params.category;

    try {
        // Fetch products that match the category
        const products = await Product.find({ categories: category });
        
        if (products.length === 0) {
            return res.status(404).send('No products found in this category.');
        }

        // Render the product view and pass the products
        res.render('user/Product_view', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
exports.getProductsBymainCategory = async (req, res) => {
    try {
        console.log('Request Params:', req.params); // Log all params to see what's being received
        const category = req.params.mainCategory;  // Fetching category from the route params
        console.log('Selected Category:', category); // Log the category

        // Fetch products based on the selected category
        const products = await Product.find({ mainCategory: category });

        // Log the fetched products to the console for debugging
        console.log('Fetched Products:', products);

        // Render the view and pass the fetched products and category
        res.render('User/collection', {
            products: products,
            category: category
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
