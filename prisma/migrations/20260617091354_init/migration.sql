-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "salesRepName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SalesReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "SalesReport_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SalesData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reportId" TEXT NOT NULL,
    "salesRepName" TEXT NOT NULL,
    "rowOrder" INTEGER NOT NULL,
    "w1Orders" REAL,
    "w1Profit" REAL,
    "w1Rate" REAL,
    "w2Orders" REAL,
    "w2Profit" REAL,
    "w2Rate" REAL,
    "w3Orders" REAL,
    "w3Profit" REAL,
    "w3Rate" REAL,
    "w4Orders" REAL,
    "w4Profit" REAL,
    "w4Rate" REAL,
    "w5Orders" REAL,
    "w5Profit" REAL,
    "w5Rate" REAL,
    "monthlyOrders" REAL,
    "monthlyProfit" REAL,
    "monthlyRate" REAL,
    "cumulativeOrders" REAL,
    "cumulativeProfit" REAL,
    "expenses" REAL,
    "netProfit" REAL,
    "h1CumulativeProfit" REAL,
    "h1Target" REAL,
    "h2CumulativeProfit" REAL,
    "h2Target" REAL,
    CONSTRAINT "SalesData_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SalesReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SalesReport_year_month_key" ON "SalesReport"("year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "SalesData_reportId_salesRepName_key" ON "SalesData"("reportId", "salesRepName");
