/*
  Warnings:

  - The values [Client,Freelancer] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `aboutOrg` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `organization` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `portfolio_url` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Application` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('ForSale', 'Sold', 'Completed');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('Apartment', 'Villa', 'Independent', 'Studio', 'Other');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('Owner', 'Tenant', 'Admin');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Application" DROP CONSTRAINT "Application_freelancer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Application" DROP CONSTRAINT "Application_project_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_client_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "aboutOrg",
DROP COLUMN "age",
DROP COLUMN "city",
DROP COLUMN "experience",
DROP COLUMN "gender",
DROP COLUMN "organization",
DROP COLUMN "portfolio_url",
DROP COLUMN "skills";

-- DropTable
DROP TABLE "public"."Application";

-- DropTable
DROP TABLE "public"."Project";

-- DropEnum
DROP TYPE "public"."ProjectStatus";

-- CreateTable
CREATE TABLE "House" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "property_type" "PropertyType" NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "area_sqft" INTEGER NOT NULL,
    "rent" DECIMAL(12,2),
    "available_from" TIMESTAMP(3),
    "status" "PropertyStatus" NOT NULL DEFAULT 'ForSale',
    "amenities" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "House_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
