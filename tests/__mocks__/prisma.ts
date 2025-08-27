const prisma = {
  user: { findUnique: jest.fn(), create: jest.fn(), delete: jest.fn() },
  todo: { findMany: jest.fn(), upsert: jest.fn() },
};
export default prisma;
