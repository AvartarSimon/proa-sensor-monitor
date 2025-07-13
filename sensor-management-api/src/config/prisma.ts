import { PrismaClient } from '../../generated/prisma/client';

let prisma: PrismaClient;

export const getPrismaClient = (): PrismaClient => {
    if (!prisma) {
        prisma = new PrismaClient({
            log: process.env['NODE_ENV'] === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });
    }
    return prisma;
};

export const closePrismaClient = async (): Promise<void> => {
    if (prisma) {
        await prisma.$disconnect();
    }
};

// Graceful shutdown
process.on('beforeExit', async () => {
    await closePrismaClient();
}); 