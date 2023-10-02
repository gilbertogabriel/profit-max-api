/*
  Warnings:

  - You are about to drop the column `CATEGORIAS` on the `investimento` table. All the data in the column will be lost.
  - Changed the type of `TPPROFIT` on the `profit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `investimento` DROP COLUMN `CATEGORIAS`;

-- AlterTable
ALTER TABLE `profit` DROP COLUMN `TPPROFIT`,
    ADD COLUMN `TPPROFIT` BOOLEAN NOT NULL;
