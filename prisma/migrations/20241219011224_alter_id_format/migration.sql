/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `doadores` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `usuarios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuario_id]` on the table `doadores` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[google_id]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usuario_id` to the `doadores` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "doadores" DROP CONSTRAINT "doadores_usuarioId_fkey";

-- DropIndex
DROP INDEX "doadores_usuarioId_key";

-- DropIndex
DROP INDEX "usuarios_googleId_key";

-- AlterTable
ALTER TABLE "doadores" DROP COLUMN "usuarioId",
ADD COLUMN     "usuario_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "googleId",
ADD COLUMN     "google_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "doadores_usuario_id_key" ON "doadores"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_google_id_key" ON "usuarios"("google_id");

-- AddForeignKey
ALTER TABLE "doadores" ADD CONSTRAINT "doadores_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
