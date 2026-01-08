import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaClientSingleton = () => {
    const url = process.env.DATABASE_URL;

    if (!url) {
        console.error('[Prisma] DATABASE_URL is not set in environment variables');
        console.error('[Prisma] Creating a mock Prisma client for development');
        // Return a basic PrismaClient that will fail gracefully
        return new PrismaClient();
    }

    try {
        // For direct postgresql/postgres URLs, use the driver adapter
        if (url.startsWith('postgresql://') || url.startsWith('postgres://')) {
            console.log('[Prisma] Initializing with Pool and PrismaPg adapter');
            const pool = new Pool({
                connectionString: url,
                connectionTimeoutMillis: 5000, // 5 second timeout
            });
            const adapter = new PrismaPg(pool);
            return new PrismaClient({
                adapter,
                log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
            });
        }

        // For Prisma Accelerate / Data Proxy URLs (e.g. prisma+postgres://)
        console.log('[Prisma] Initializing with accelerateUrl');
        return new PrismaClient({
            accelerateUrl: url,
            log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        });
    } catch (error) {
        console.error('[Prisma] Failed to initialize Prisma client:', error);
        console.error('[Prisma] Falling back to basic client');
        return new PrismaClient();
    }
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

