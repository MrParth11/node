const express = require('express');
const router = express.Router();
const adminController = require('../controller/AdminCtr'); 
const multer = require('multer');
const path = require('path'); 
const passport = require('../config/passport'); 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage });


router.get('/dashboard', passport.checkAuthentication, adminController.dashboard);
router.get('/AddAdmin', passport.checkAuthentication, adminController.AddAdmin);
router.get('/ViewAdmin', passport.checkAuthentication, adminController.ViewAdmin);
router.get('/MainCategory', passport.checkAuthentication, adminController.MainCategory);
router.get('/ViewMainCategory', passport.checkAuthentication, adminController.ViewMainCategory);
router.get('/EditMainCategory/:id', passport.checkAuthentication, adminController.EditMainCategory);
router.get('/SubCategory', passport.checkAuthentication, adminController.SubCategory);
router.get('/ViewSubCategory', passport.checkAuthentication, adminController.ViewSubCategory);
router.get('/EditSubCategory/:id', passport.checkAuthentication, adminController.EditSubCategory);
router.get('/Category', passport.checkAuthentication, adminController.Category);
router.get('/ViewCategory', passport.checkAuthentication, adminController.ViewCategory);
router.get('/EditCategory/:id', passport.checkAuthentication, adminController.EditCategory);
router.get('/ViewProduct', passport.checkAuthentication, adminController.ViewProducts); 
router.get('/AddProduct', passport.checkAuthentication, adminController.AddProduct); 


router.post('/AddNewProduct', passport.checkAuthentication, upload.array('images', 5), adminController.AddNewProduct);
router.post('/UpdateProduct/:id', passport.checkAuthentication, upload.array('images', 5), adminController.UpdateProduct); 
router.post('/DeleteProduct/:id', passport.checkAuthentication, adminController.DeleteProduct); 
router.post('/AddMainCategory', passport.checkAuthentication, upload.single('image'), adminController.AddMainCategory);
router.post('/UpdateMainCategory/:id', passport.checkAuthentication, upload.single('image'), adminController.UpdateMainCategory);
router.post('/DeleteMainCategory/:id', passport.checkAuthentication, adminController.DeleteMainCategory);
router.post('/AddSubCategory', passport.checkAuthentication, upload.single('image'), adminController.AddSubCategory);
router.post('/UpdateSubCategory/:id', passport.checkAuthentication, upload.single('image'), adminController.UpdateSubCategory);
router.post('/DeleteSubCategory/:id', passport.checkAuthentication, adminController.DeleteSubCategory);
router.post('/AddCategory', passport.checkAuthentication, upload.single('image'), adminController.AddCategory);
router.post('/UpdateCategory/:id', passport.checkAuthentication, upload.single('image'), adminController.UpdateCategory);
router.post('/DeleteCategory/:id', passport.checkAuthentication, adminController.DeleteCategory);

module.exports = router;
