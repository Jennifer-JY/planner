/*
  Warnings:

  - You are about to drop the column `day` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Todo` table. All the data in the column will be lost.
  - Added the required column `date` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Todo_year_month_day_idx";

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "day",
DROP COLUMN "month",
DROP COLUMN "year",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Todo_date_idx" ON "Todo"("date");
