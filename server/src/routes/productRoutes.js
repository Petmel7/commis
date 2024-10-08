
// server/src/routes/productRoutes.js
const express = require('express');
const { getProducts, getProductById, getUserProducts, addProduct, updateProduct, deleteProduct, deleteImage, searchProducts, getProductsByCategory } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');
const router = express.Router();

router.get('/', protect, getUserProducts);
router.get('/all', getProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);
router.post('/', protect, upload.array('images'), addProduct);
router.patch('/:id', protect, upload.array('images'), updateProduct);
router.delete('/:id', protect, deleteProduct);
router.delete('/:id/images', protect, deleteImage);

module.exports = router;



