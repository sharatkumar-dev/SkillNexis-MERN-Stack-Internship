import Product from '../models/Product.js';

// @desc    Fetch all products with search, filter, sort & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    // Search by name / description
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search.trim(), $options: 'i' } },
        { description: { $regex: req.query.search.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (req.query.sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (req.query.sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (req.query.sort === 'rating_desc') {
      sortOptions = { rating: -1 };
    } else if (req.query.sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        products,
        page,
        pages: Math.ceil(totalProducts / limit) || 1,
        totalProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch unique product categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json({
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      countInStock,
      isFeatured,
    } = req.body;

    let imageUrl = req.body.imageUrl;
    // If a file was uploaded via Multer
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!name || !description || price === undefined || !category || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, price, category, and an image',
      });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      brand: brand || 'SkillNexis Essentials',
      countInStock: Number(countInStock) || 0,
      imageUrl,
      isFeatured: isFeatured === 'true' || isFeatured === true,
    });

    const createdProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: createdProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const {
      name,
      description,
      price,
      category,
      brand,
      countInStock,
      isFeatured,
      rating,
    } = req.body;

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    if (price !== undefined) product.price = Number(price);
    product.category = category ?? product.category;
    product.brand = brand ?? product.brand;
    if (countInStock !== undefined) product.countInStock = Number(countInStock);
    if (isFeatured !== undefined) {
      product.isFeatured = isFeatured === 'true' || isFeatured === true;
    }
    if (rating !== undefined) product.rating = Number(rating);

    // If a new image was uploaded
    if (req.file) {
      product.imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      product.imageUrl = req.body.imageUrl;
    }

    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product removed successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
