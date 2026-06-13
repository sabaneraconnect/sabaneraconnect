-- CreateTable
CREATE TABLE "Mensaje" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "remitenteId" INTEGER NOT NULL,
    "contenido" TEXT NOT NULL,
    "fechaEnvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mensaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resena" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "organizadorId" INTEGER NOT NULL,
    "bandaId" INTEGER NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "respuestaBanda" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resena_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "montoTotal" DOUBLE PRECISION NOT NULL,
    "comision" DOUBLE PRECISION NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'anticipo_y_saldo',
    "porcentajeAnticipo" INTEGER NOT NULL DEFAULT 50,
    "estadoPagoUno" TEXT NOT NULL DEFAULT 'pendiente',
    "estadoPagoDos" TEXT NOT NULL DEFAULT 'pendiente',
    "stripePaymentIntentUno" TEXT,
    "stripePaymentIntentDos" TEXT,
    "fechaHabilitacionPagoDos" TIMESTAMP(3),
    "notificado48h" BOOLEAN NOT NULL DEFAULT false,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resena_solicitudId_key" ON "Resena"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_solicitudId_key" ON "Pago"("solicitudId");

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_remitenteId_fkey" FOREIGN KEY ("remitenteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resena" ADD CONSTRAINT "Resena_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resena" ADD CONSTRAINT "Resena_organizadorId_fkey" FOREIGN KEY ("organizadorId") REFERENCES "Organizador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resena" ADD CONSTRAINT "Resena_bandaId_fkey" FOREIGN KEY ("bandaId") REFERENCES "Banda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
