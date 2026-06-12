-- AlterTable
ALTER TABLE "Banda" ADD COLUMN     "aniosExperiencia" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "estadoPerfil" TEXT NOT NULL DEFAULT 'borrador',
ADD COLUMN     "generos" TEXT,
ADD COLUMN     "integrantes" TEXT,
ADD COLUMN     "municipiosCobertura" TEXT;

-- CreateTable
CREATE TABLE "MultimediaBanda" (
    "id" SERIAL NOT NULL,
    "bandaId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fechaCarga" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MultimediaBanda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MultimediaBanda" ADD CONSTRAINT "MultimediaBanda_bandaId_fkey" FOREIGN KEY ("bandaId") REFERENCES "Banda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
