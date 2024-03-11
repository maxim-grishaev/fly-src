-- CreateTable
CREATE TABLE "TicketFlight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromPlace" TEXT NOT NULL,
    "fromTime" DATETIME NOT NULL,
    "toPlace" TEXT NOT NULL,
    "toTime" DATETIME NOT NULL,
    "flightDuration" INTEGER NOT NULL,
    "flightNumber" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "priceAmout" DECIMAL NOT NULL,
    "priceCurrency" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "cacheTTLMs" INTEGER NOT NULL,
    "bestBefore" DATETIME NOT NULL,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Ticket_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SchedulerTask" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "refteshAfterMs" INTEGER NOT NULL,
    "retryAttempts" INTEGER NOT NULL,
    "backoffMs" INTEGER,
    "timeoutMs" INTEGER,
    "vendorId" TEXT NOT NULL,
    CONSTRAINT "SchedulerTask_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PowerusTask" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "taskId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "cacheTTL" INTEGER NOT NULL,
    CONSTRAINT "PowerusTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "SchedulerTask" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TicketToTicketFlight" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TicketToTicketFlight_A_fkey" FOREIGN KEY ("A") REFERENCES "Ticket" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TicketToTicketFlight_B_fkey" FOREIGN KEY ("B") REFERENCES "TicketFlight" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PowerusTask_taskId_key" ON "PowerusTask"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "PowerusTask_url_key" ON "PowerusTask"("url");

-- CreateIndex
CREATE UNIQUE INDEX "_TicketToTicketFlight_AB_unique" ON "_TicketToTicketFlight"("A", "B");

-- CreateIndex
CREATE INDEX "_TicketToTicketFlight_B_index" ON "_TicketToTicketFlight"("B");
