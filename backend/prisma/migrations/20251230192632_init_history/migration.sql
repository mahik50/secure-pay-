-- CreateTable
CREATE TABLE "History" (
    "id" SERIAL NOT NULL,
    "sender" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "accId" INTEGER NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_accId_fkey" FOREIGN KEY ("accId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
