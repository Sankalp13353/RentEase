-- CreateTable
CREATE TABLE "Interest" (
    "id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "house_id" INTEGER NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Interest_tenant_id_idx" ON "Interest"("tenant_id");

-- CreateIndex
CREATE INDEX "Interest_house_id_idx" ON "Interest"("house_id");

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_house_id_fkey" FOREIGN KEY ("house_id") REFERENCES "House"("id") ON DELETE CASCADE ON UPDATE CASCADE;
