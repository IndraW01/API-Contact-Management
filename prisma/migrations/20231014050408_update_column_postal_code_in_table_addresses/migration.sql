/*
  Warnings:

  - Made the column `postalCode` on table `addresses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `addresses` MODIFY `postalCode` VARCHAR(100) NOT NULL;
