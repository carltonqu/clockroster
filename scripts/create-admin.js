const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash('admin123', 10);
  
  try {
    const admin = await prisma.user.create({
      data: {
        email: 'admin@clockroster.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });
    
    console.log('✅ Admin user created!');
    console.log('Email: admin@clockroster.com');
    console.log('Password: admin123');
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Admin user already exists');
    } else {
      console.error('Error:', error);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());