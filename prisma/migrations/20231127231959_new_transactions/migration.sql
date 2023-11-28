/*
  Warnings:

  - You are about to drop the column `IDCATEGORIA` on the `PROFIT` table. All the data in the column will be lost.
  - You are about to drop the column `IDINVESTIMENTO` on the `PROFIT` table. All the data in the column will be lost.
  - You are about to alter the column `TIPO` on the `TRANSACTIONS` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `INVESTIMENTO` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `NOME` to the `CATEGORIA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CATEGORIA_ID` to the `TRANSACTIONS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PAYMENT_ACCOUNT` to the `TRANSACTIONS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PAYMENT_TYPE_ID` to the `TRANSACTIONS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `STATUS_ID` to the `TRANSACTIONS` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `INVESTIMENTO` DROP FOREIGN KEY `INVESTIMENTO_IDUSUARIO_fkey`;

-- DropForeignKey
ALTER TABLE `PROFIT` DROP FOREIGN KEY `PROFIT_IDCATEGORIA_fkey`;

-- DropForeignKey
ALTER TABLE `PROFIT` DROP FOREIGN KEY `PROFIT_IDINVESTIMENTO_fkey`;

-- AlterTable
ALTER TABLE `CATEGORIA` ADD COLUMN `NOME` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `PROFIT` DROP COLUMN `IDCATEGORIA`,
    DROP COLUMN `IDINVESTIMENTO`;

-- AlterTable
ALTER TABLE `TRANSACTIONS` ADD COLUMN `CATEGORIA_ID` INTEGER NOT NULL,
    ADD COLUMN `DTPAGAMENTO` DATETIME(3) NULL,
    ADD COLUMN `PAYMENT_ACCOUNT` VARCHAR(191) NOT NULL,
    ADD COLUMN `PAYMENT_TYPE_ID` INTEGER NOT NULL,
    ADD COLUMN `STATUS_ID` INTEGER NOT NULL,
    MODIFY `TIPO` INTEGER NOT NULL;

-- DropTable
DROP TABLE `INVESTIMENTO`;

-- CreateTable
CREATE TABLE `STATUS` (
    `IDSTATUS` INTEGER NOT NULL AUTO_INCREMENT,
    `NOME` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`IDSTATUS`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PAYMENT_TYPE` (
    `IDPAYMENTTYPE` INTEGER NOT NULL AUTO_INCREMENT,
    `NOME` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`IDPAYMENTTYPE`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TRANSACTIONS` ADD CONSTRAINT `TRANSACTIONS_PAYMENT_TYPE_ID_fkey` FOREIGN KEY (`PAYMENT_TYPE_ID`) REFERENCES `PAYMENT_TYPE`(`IDPAYMENTTYPE`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TRANSACTIONS` ADD CONSTRAINT `TRANSACTIONS_CATEGORIA_ID_fkey` FOREIGN KEY (`CATEGORIA_ID`) REFERENCES `CATEGORIA`(`IDCATEGORIA`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TRANSACTIONS` ADD CONSTRAINT `TRANSACTIONS_STATUS_ID_fkey` FOREIGN KEY (`STATUS_ID`) REFERENCES `STATUS`(`IDSTATUS`) ON DELETE RESTRICT ON UPDATE CASCADE;
