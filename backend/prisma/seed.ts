/// <reference types="node" />

import { PrismaClient, ProductStatus, Product } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Create a merchant user
  const merchant = await prisma.user.create({
    data: {
      nickname: 'Merchant User',
      email: 'merchant@example.com',
      role: 'MERCHANT',
    },
  });
  console.log(`Created user with id: ${merchant.id}`);

  // Create 10 products for the merchant
  const products = [
    {
      name: 'High-Quality Wireless Headphones',
      description: 'Experience immersive sound with these noise-cancelling headphones.',
      price: 15000, // 150.00
      originalPrice: 20000, // 200.00
      stock: 100,
      images: { urls: ['/assets/images/products/product-1.png'] },
      category: 'Electronics',
      tags: { list: ['audio', 'wireless', 'noise-cancelling'] },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: 'Stylish Leather Backpack',
      description: 'A durable and stylish backpack for daily use.',
      price: 8000, // 80.00
      originalPrice: 10000, // 100.00
      stock: 50,
      images: { urls: ['/assets/images/products/product-2.png'] },
      category: 'Bags',
      tags: { list: ['fashion', 'leather', 'backpack'] },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: 'Smart Fitness Watch',
      description: 'Track your health and fitness with this advanced smartwatch.',
      price: 25000, // 250.00
      originalPrice: 30000, // 300.00
      stock: 75,
      images: { urls: ['/assets/images/products/product-3.png'] },
      category: 'Electronics',
      tags: { list: ['fitness', 'smartwatch', 'health'] },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: 'Organic Cotton T-Shirt',
      description: 'Comfortable and eco-friendly cotton t-shirt.',
      price: 2500, // 25.00
      originalPrice: 3500, // 35.00
      stock: 200,
      images: { urls: ['/assets/images/products/product-4.png'] },
      category: 'Clothing',
      tags: { list: ['organic', 'cotton', 'casual'] },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: 'Professional Camera Lens',
      description: 'High-quality lens for professional photography.',
      price: 45000, // 450.00
      originalPrice: 55000, // 550.00
      stock: 25,
      images: { urls: ['/assets/images/products/product-5.png'] },
      category: 'Electronics',
      tags: { list: ['photography', 'lens', 'professional'] },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: 'Ceramic Coffee Mug Set',
      description: 'Beautiful handcrafted ceramic mugs, set of 4.',
      price: 3200, // 32.00
      originalPrice: 4000, // 40.00
      stock: 80,
      images: { urls: ['/assets/images/products/product-6.png'] },
      category: 'Home & Kitchen',
      tags: { list: ['ceramic', 'coffee', 'handcrafted'] },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: 'Yoga Mat Premium',
      description: 'Non-slip premium yoga mat for all your workout needs.',
      price: 4500, // 45.00
      originalPrice: 6000, // 60.00
      stock: 120,
      images: { urls: ['/assets/images/products/product-7.png'] },
      category: 'Sports',
      tags: { list: ['yoga', 'fitness', 'non-slip'] },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: 'Bluetooth Portable Speaker',
      description: 'Compact speaker with amazing sound quality.',
      price: 6500, // 65.00
      originalPrice: 8500, // 85.00
      stock: 90,
      images: { urls: ['/assets/images/products/product-8.png'] },
      category: 'Electronics',
      tags: { list: ['bluetooth', 'speaker', 'portable'] },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: 'Wooden Desk Organizer',
      description: 'Keep your workspace tidy with this elegant organizer.',
      price: 3800, // 38.00
      originalPrice: 4800, // 48.00
      stock: 60,
      images: { urls: ['/assets/images/products/product-9.png'] },
      category: 'Office',
      tags: { list: ['wooden', 'organizer', 'desk'] },
      status: ProductStatus.PUBLISHED,
    },
    {
      name: 'Stainless Steel Water Bottle',
      description: 'Insulated water bottle that keeps drinks cold for 24 hours.',
      price: 2800, // 28.00
      originalPrice: 3500, // 35.00
      stock: 150,
      images: { urls: ['/assets/images/products/product-10.png'] },
      category: 'Sports',
      tags: { list: ['stainless-steel', 'insulated', 'water-bottle'] },
      status: ProductStatus.PUBLISHED,
    },
  ];

  const createdProducts: Product[] = [];
  for (const productData of products) {
    const product = await prisma.product.create({
      data: {
        ...productData,
        merchantId: merchant.id,
      },
    });
    createdProducts.push(product);
    console.log(`Created product with id: ${product.id} - ${product.name}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
