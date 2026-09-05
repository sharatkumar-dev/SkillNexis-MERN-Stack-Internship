import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();

const users = [
  {
    name: 'Administrator',
    email: 'admin@skillnexis.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Jane Customer',
    email: 'customer@skillnexis.com',
    password: 'customer123',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
];

const sampleProducts = [
  {
    name: 'AeroSound Pro Wireless ANC Headphones',
    description: 'Premium active noise-cancelling wireless headphones with 40-hour battery life, high-resolution spatial audio, and memory-foam plush earcups.',
    price: 199.99,
    category: 'Electronics',
    brand: 'AeroSound',
    countInStock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    numReviews: 42,
    isFeatured: true,
  },
  {
    name: 'Zenith Custom RGB Mechanical Keyboard',
    description: 'Hot-swappable mechanical switches with custom PBT dye-sub keycaps, sound-dampening silicone gasket mount, and programmable wireless connectivity.',
    price: 129.5,
    category: 'Electronics',
    brand: 'Zenith',
    countInStock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    numReviews: 38,
    isFeatured: true,
  },
  {
    name: 'Horizon 34-inch Curved UltraWide Monitor',
    description: 'Immersive WQHD 144Hz IPS display featuring 99% sRGB color accuracy, HDR400 certification, and USB-C 90W power delivery for seamless productivity.',
    price: 499.0,
    category: 'Electronics',
    brand: 'Horizon Display',
    countInStock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    numReviews: 19,
    isFeatured: false,
  },
  {
    name: 'Vanguard Full-Grain Leather Commuter Backpack',
    description: 'Handcrafted water-resistant commuter pack with a dedicated 16-inch padded laptop compartment, luggage pass-through sleeve, and antique brass hardware.',
    price: 145.0,
    category: 'Fashion',
    brand: 'Vanguard Goods',
    countInStock: 14,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    numReviews: 54,
    isFeatured: true,
  },
  {
    name: 'Atelier Minimalist Breathable Linen Shirt',
    description: 'Relaxed-fit pure European flax linen button-up designed for warm-weather breathability, natural drape, and timeless casual elegance.',
    price: 64.99,
    category: 'Fashion',
    brand: 'Atelier',
    countInStock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    numReviews: 23,
    isFeatured: false,
  },
  {
    name: 'Chronos Heritage Automatic Chronograph Watch',
    description: 'Precision Japanese automatic movement housed in a 316L stainless steel case with sapphire crystal glass and genuine Italian calfskin strap.',
    price: 289.0,
    category: 'Fashion',
    brand: 'Chronos',
    countInStock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    numReviews: 31,
    isFeatured: true,
  },
  {
    name: 'ErgoPro High-Back Mesh Ergonomic Chair',
    description: 'Advanced dynamic lumbar support, 4D adjustable armrests, breathable temperature-regulating mesh, and 135-degree smooth recline tilt mechanism.',
    price: 320.0,
    category: 'Home & Living',
    brand: 'ErgoPro',
    countInStock: 6,
    imageUrl: 'https://images.unsplash.com/photo-1580481077195-c3a824552965?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    numReviews: 67,
    isFeatured: true,
  },
  {
    name: 'BaristaCraft Artisanal Pour-Over Coffee Set',
    description: 'Heat-resistant borosilicate glass carafe with double-mesh stainless steel reusable dripper, olive wood collar, and precision gooseneck kettle.',
    price: 58.5,
    category: 'Home & Living',
    brand: 'BaristaCraft',
    countInStock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    numReviews: 45,
    isFeatured: false,
  },
  {
    name: 'Aura Minimalist Nordic Ambient Smart Lamp',
    description: 'Stepless dimming LED glow with tunable warm-to-cool white light, capacitive touch base, and wireless phone fast-charging pad.',
    price: 79.99,
    category: 'Home & Living',
    brand: 'Aura Living',
    countInStock: 16,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    numReviews: 18,
    isFeatured: false,
  },
  {
    name: 'TitanPro Pulse Multisport Smartwatch',
    description: 'Continuous optical heart-rate monitoring, onboard GPS, SpO2 sensor, water resistance up to 50 meters, and 14-day ultra battery mode.',
    price: 169.95,
    category: 'Fitness',
    brand: 'TitanPro',
    countInStock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    numReviews: 50,
    isFeatured: true,
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Clear old records
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Seed users (passwords get hashed via UserSchema pre-save)
    const createdUsers = [];
    for (const u of users) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    // Seed products
    await Product.insertMany(sampleProducts);

    console.log('✅ Capstone Sample Data Successfully Seeded:');
    console.log(`   - ${createdUsers.length} Users Created (Admin: admin@skillnexis.com / admin123)`);
    console.log(`   - ${sampleProducts.length} Products Populated across multiple categories`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('🗑️ Database Cleared!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Data Destruction failed: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
