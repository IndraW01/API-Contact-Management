/*
  Warnings:

  - You are about to alter the column `postalCode` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE `addresses` MODIFY `street` VARCHAR(255) NULL,
    MODIFY `postalCode` VARCHAR(10) NOT NULL;
