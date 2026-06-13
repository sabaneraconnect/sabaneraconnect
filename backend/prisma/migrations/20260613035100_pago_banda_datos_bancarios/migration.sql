-- AlterTable
ALTER TABLE "Banda" ADD COLUMN     "banco" TEXT,
ADD COLUMN     "numeroCuenta" TEXT,
ADD COLUMN     "tipoCuenta" TEXT;

-- AlterTable
ALTER TABLE "Pago" ADD COLUMN     "estadoPagoBandaDos" TEXT NOT NULL DEFAULT 'pendiente',
ADD COLUMN     "estadoPagoBandaUno" TEXT NOT NULL DEFAULT 'pendiente',
ADD COLUMN     "montoTransferidoDos" DOUBLE PRECISION,
ADD COLUMN     "montoTransferidoUno" DOUBLE PRECISION;
