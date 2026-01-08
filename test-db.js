const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

async function main() {
    const url = process.env.DATABASE_URL;
    console.log('Attempting to connect with DATABASE_URL provided...');
    
    let prisma;
    if (url.startsWith('postgresql://') || url.startsWith('postgres://')) {
        console.log('[Test] Initializing with Pool and PrismaPg adapter');
        const pool = new Pool({ connectionString: url });
        const adapter = new PrismaPg(pool);
        prisma = new PrismaClient({ adapter });
    } else {
        console.log('[Test] Initializing with accelerateUrl');
        prisma = new PrismaClient({
            accelerateUrl: url
        });
    }

    try {
        console.log('Checking connection...');
        const userCount = await prisma.user.count();
        console.log('Connection successful! User count:', userCount);
    } catch (error) {
        console.error('Connection failed:', error);
        if (error.message && error.message.includes('authentication failed')) {
            console.log('\nTIP: Your password contains an "@" symbol. If connection fails, we might need to URL-encode it as "%40".');
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
