-- CreateTable
CREATE TABLE "DisponibilidadBanda" (
    "id" SERIAL NOT NULL,
    "bandaId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "franjaInicio" TEXT NOT NULL,
    "franjaFin" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'disponible',

    CONSTRAINT "DisponibilidadBanda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DisponibilidadBanda" ADD CONSTRAINT "DisponibilidadBanda_bandaId_fkey" FOREIGN KEY ("bandaId") REFERENCES "Banda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
