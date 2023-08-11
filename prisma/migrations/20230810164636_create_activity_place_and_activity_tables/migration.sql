-- CreateTable
CREATE TABLE "ActivityPlace" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityPlace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "activityPlaceId" INTEGER NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "maxCapacity" INTEGER NOT NULL DEFAULT 27,
    "currentCapacity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ActivityPlaceToEvent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ActivityToEnrollment" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityPlaceToEvent_AB_unique" ON "_ActivityPlaceToEvent"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityPlaceToEvent_B_index" ON "_ActivityPlaceToEvent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityToEnrollment_AB_unique" ON "_ActivityToEnrollment"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityToEnrollment_B_index" ON "_ActivityToEnrollment"("B");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_activityPlaceId_fkey" FOREIGN KEY ("activityPlaceId") REFERENCES "ActivityPlace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityPlaceToEvent" ADD CONSTRAINT "_ActivityPlaceToEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "ActivityPlace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityPlaceToEvent" ADD CONSTRAINT "_ActivityPlaceToEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToEnrollment" ADD CONSTRAINT "_ActivityToEnrollment_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToEnrollment" ADD CONSTRAINT "_ActivityToEnrollment_B_fkey" FOREIGN KEY ("B") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
