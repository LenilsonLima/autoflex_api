-- CreateTable
CREATE TABLE "product" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw_material" (
    "id" BIGSERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "stock_quantity" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "raw_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_raw_material" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "raw_material_id" BIGINT NOT NULL,
    "required_quantity" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "product_raw_material_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_code_key" ON "product"("code");

-- CreateIndex
CREATE UNIQUE INDEX "raw_material_code_key" ON "raw_material"("code");

-- CreateIndex
CREATE UNIQUE INDEX "uk_product_raw_material" ON "product_raw_material"("product_id", "raw_material_id");

-- AddForeignKey
ALTER TABLE "product_raw_material" ADD CONSTRAINT "product_raw_material_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_raw_material" ADD CONSTRAINT "product_raw_material_raw_material_id_fkey" FOREIGN KEY ("raw_material_id") REFERENCES "raw_material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
