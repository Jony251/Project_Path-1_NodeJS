/**
 * Products Router - Handles all product-related routes
 * Implements CRUD operations with authentication and authorization
 */

const express = require('express');
const router = express.Router();
const ProductModel = require('../models/productModel');

/**
 * @route   POST /products
 * @desc    Create a new product
 * @access  Private - Requires authentication
 */
router.post('/', async (req, res) => {
    try {
        const result = await ProductModel.create(req.body);
        res.status(201).json({ 
            message: 'Product added!',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   GET /products
 * @desc    Get all products with creator information
 * @access  Private - Requires authentication
 */
router.get('/', async (req, res, next) => {
    try {
        const { limit } = req.query;
        if (limit && isNaN(limit)) {
            return res.status(400).json({ error: 'Parameter "limit" must be a number' });
        }

        const products = await ProductModel.findAll(limit ? parseInt(limit, 10) : null);
        res.json(products);
    } catch (error) {
        next(error);
    }
});       

/**
 * @route   GET /products/:id
 * @desc    Get a single product by ID
 * @access  Private - Requires authentication
 */
router.get('/:id', async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   PUT /products/:id
 * @desc    Update a product
 * @access  Private - Only creator or admin can update
 */
router.put('/:id', async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user has permission to update
        if (!req.session.isAdmin && product.created_by !== req.session.userId) {
            return res.status(403).json({ error: 'You can only update products you created' });
        }

        const result = await ProductModel.update(req.params.id, req.body);
        res.json({ 
            message: 'Product updated successfully',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route   DELETE /products/:id
 * @desc    Delete a product
 * @access  Private - Only creator or admin can delete
 */
router.delete('/:id', async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user has permission to delete
        if (!req.session.isAdmin && product.created_by !== req.session.userId) {
            return res.status(403).json({ error: 'You can only delete products you created' });
        }

        const result = await ProductModel.delete(req.params.id);
        res.json({ 
            message: 'Product deleted successfully',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;