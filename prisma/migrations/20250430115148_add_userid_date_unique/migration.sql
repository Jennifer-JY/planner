/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `Todo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Todo_date_idx";

-- DropIndex
DROP INDEX "Todo_userId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Todo_userId_date_key" ON "Todo"("userId", "date");
