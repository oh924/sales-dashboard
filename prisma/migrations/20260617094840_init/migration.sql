-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "salesRepName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesReport" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SalesReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesData" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "salesRepName" TEXT NOT NULL,
    "rowOrder" INTEGER NOT NULL,
    "w1Orders" DOUBLE PRECISION,
    "w1Profit" DOUBLE PRECISION,
    "w1Rate" DOUBLE PRECISION,
    "w2Orders" DOUBLE PRECISION,
    "w2Profit" DOUBLE PRECISION,
    "w2Rate" DOUBLE PRECISION,
    "w3Orders" DOUBLE PRECISION,
    "w3Profit" DOUBLE PRECISION,
    "w3Rate" DOUBLE PRECISION,
    "w4Orders" DOUBLE PRECISION,
    "w4Profit" DOUBLE PRECISION,
    "w4Rate" DOUBLE PRECISION,
    "w5Orders" DOUBLE PRECISION,
    "w5Profit" DOUBLE PRECISION,
    "w5Rate" DOUBLE PRECISION,
    "monthlyOrders" DOUBLE PRECISION,
    "monthlyProfit" DOUBLE PRECISION,
    "monthlyRate" DOUBLE PRECISION,
    "cumulativeOrders" DOUBLE PRECISION,
    "cumulativeProfit" DOUBLE PRECISION,
    "expenses" DOUBLE PRECISION,
    "netProfit" DOUBLE PRECISION,
    "h1CumulativeProfit" DOUBLE PRECISION,
    "h1Target" DOUBLE PRECISION,
    "h2CumulativeProfit" DOUBLE PRECISION,
    "h2Target" DOUBLE PRECISION,

    CONSTRAINT "SalesData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SalesReport_year_month_key" ON "SalesReport"("year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "SalesData_reportId_salesRepName_key" ON "SalesData"("reportId", "salesRepName");

-- AddForeignKey
ALTER TABLE "SalesReport" ADD CONSTRAINT "SalesReport_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesData" ADD CONSTRAINT "SalesData_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "SalesReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
