/// <reference types="node" />

import { PrismaClient } from '@prisma/client';

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

  // Create some products for the merchant
  const product1 = await prisma.product.create({
    data: {
      name: 'High-Quality Wireless Headphones',
      description:
        'Experience immersive sound with these noise-cancelling headphones.',
      price: 15000, // 150.00
      originalPrice: 20000, // 200.00
      stock: 100,
      images: {
        urls: ['/assets/images/products/product-1.png'],
      },
      category: 'Electronics',
      tags: { list: ['audio', 'wireless', 'noise-cancelling'] },
      status: 'PUBLISHED',
      merchantId: merchant.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Stylish Leather Backpack',
      description: 'A durable and stylish backpack for daily use.',
      price: 8000, // 80.00
      originalPrice: 10000, // 100.00
      stock: 50,
      images: {
        urls: ['/assets/images/products/product-2.png'],
      },
      category: 'Bags',
      tags: { list: ['fashion', 'leather', 'backpack'] },
      status: 'PUBLISHED',
      merchantId: merchant.id,
    },
  });

  console.log(`Created product with id: ${product1.id}`);
  console.log(`Created product with id: ${product2.id}`);

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
