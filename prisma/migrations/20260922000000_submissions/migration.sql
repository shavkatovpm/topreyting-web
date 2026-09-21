-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN "telegramId" TEXT;

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "categoryId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "receiptFile" TEXT NOT NULL,
    "receiptMime" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'uz',
    "ipHash" TEXT,
    "brandId" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" DATETIME,
    "rejectReason" TEXT,
    "telegramMessageId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Submission_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Submission_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "AdminUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Submission_status_createdAt_idx" ON "Submission"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_telegramId_key" ON "AdminUser"("telegramId");

