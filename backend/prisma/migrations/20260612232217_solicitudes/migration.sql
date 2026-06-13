-- CreateTable
CREATE TABLE "Solicitud" (
    "id" SERIAL NOT NULL,
    "bandaId" INTEGER NOT NULL,
    "organizadorId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "franjaInicio" TEXT NOT NULL,
    "franjaFin" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "tipoEvento" TEXT NOT NULL,
    "duracionHoras" INTEGER NOT NULL,
    "presupuesto" DOUBLE PRECISION NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "contraOferta" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_bandaId_fkey" FOREIGN KEY ("bandaId") REFERENCES "Banda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_organizadorId_fkey" FOREIGN KEY ("organizadorId") REFERENCES "Organizador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
