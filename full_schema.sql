-- Create Enums
DO $$ BEGIN
    CREATE TYPE "TransactionType" AS ENUM ('VENTA', 'ALQUILER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PropertyType" AS ENUM ('TERRENO', 'DEPARTAMENTO', 'CASA', 'QUINTA', 'OFICINA', 'LOCAL', 'EDIFICIO_COMERCIAL', 'CAMPO', 'PH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "Currency" AS ENUM ('ARS', 'USD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Table: Property
CREATE TABLE IF NOT EXISTS "Property" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "transactionType" "TransactionType" NOT NULL DEFAULT 'VENTA',
    "propertyType" "PropertyType",
    "price" DECIMAL(15,2) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'ARS',
    "address" TEXT,
    "localidadId" TEXT,
    "localidadNombre" TEXT,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "areaM2" DECIMAL(10,2),
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- Create Index for Property
CREATE UNIQUE INDEX IF NOT EXISTS "Property_slug_key" ON "Property"("slug");

-- Create Table: AdminUser
CREATE TABLE IF NOT EXISTS "AdminUser" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- Create Index for AdminUser
CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_userId_key" ON "AdminUser"("userId");

-- Create Table: ContactMessage
CREATE TABLE IF NOT EXISTS "ContactMessage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "propertyId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- Enable RLS
ALTER TABLE "Property" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactMessage" ENABLE ROW LEVEL SECURITY;

-- Property Policies
DROP POLICY IF EXISTS "Public read access for properties" ON "Property";
CREATE POLICY "Public read access for properties" ON "Property"
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access for properties" ON "Property";
CREATE POLICY "Admin full access for properties" ON "Property"
FOR ALL USING (auth.role() = 'authenticated');

-- AdminUser Policies
DROP POLICY IF EXISTS "Admin full access for admin_users" ON "AdminUser";
CREATE POLICY "Admin full access for admin_users" ON "AdminUser"
FOR ALL USING (auth.role() = 'authenticated');

-- ContactMessage Policies
DROP POLICY IF EXISTS "Public insert for contact messages" ON "ContactMessage";
CREATE POLICY "Public insert for contact messages" ON "ContactMessage"
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin select contact messages" ON "ContactMessage";
CREATE POLICY "Admin select contact messages" ON "ContactMessage"
FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete contact messages" ON "ContactMessage";
CREATE POLICY "Admin delete contact messages" ON "ContactMessage"
FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update contact messages" ON "ContactMessage";
CREATE POLICY "Admin update contact messages" ON "ContactMessage"
FOR UPDATE USING (auth.role() = 'authenticated');
