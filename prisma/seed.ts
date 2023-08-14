import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();



async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  await prisma.ticketType.create({
    data: {
      name: "Presencial",
      price: 250,
      isRemote: false,
      includesHotel: true,
    },
  });

  await prisma.ticketType.create({
    data: {
      name: "Presencial",
      price: 250,
      isRemote: false,
      includesHotel: false,
    },
  });

  await prisma.ticketType.create({
    data: {
      name: "Online",
      price: 100,
      isRemote: true,
      includesHotel: false,
    },
  });

  const activityPlace1 = await prisma.activityPlace.create({
    data: {
      name: "Auditório Principal",
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      Event: {
        connect: {
          id: event.id
        }
      }
    }
  });

  const activityPlace2 = await prisma.activityPlace.create({
    data: {
      name: "Auditório Lateral",
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      Event: {
        connect: {
          id: event.id
        }
      }
    }
  });

  const activityPlace3 = await prisma.activityPlace.create({
    data: {
      name: "Sala de WorkShop",
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      Event: {
        connect: {
          id: event.id
        }
      }
    }
  });

  let day = 1;
  while (day <= 3) {
    await prisma.activity.create({
      data: {
        name: "Minecraft: montando o PC ideal",
        activityPlaceId: activityPlace1.id,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        startTime: dayjs().add(day, "day").startOf("day").add(9, "hour").toDate(),
        endTime: dayjs().add(day, "day").startOf("day").add(9, "hour").clone().add(1, "hour").toDate(),
        capacity: 27,
      }
    });

    await prisma.activity.create({
      data: {
        name: "LoL: montando o PC ideal",
        activityPlaceId: activityPlace1.id,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        startTime: dayjs().add(day, "day").startOf("day").add(9, "hour").toDate(),
        endTime: dayjs().add(day, "day").startOf("day").add(9, "hour").clone().add(1, "hour").toDate(),
        capacity: 27,
      }
    });

    await prisma.activity.create({
      data: {
        name: "Palestra x",
        activityPlaceId: activityPlace2.id,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        startTime: dayjs().add(day, "day").startOf("day").add(9, "hour").toDate(),
        endTime: dayjs().add(day, "day").startOf("day").add(9, "hour").clone().add(1, "hour").toDate(),
        capacity: 27,
      }
    });

    await prisma.activity.create({
      data: {
        name: "Palestra y",
        activityPlaceId: activityPlace3.id,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        startTime: dayjs().add(day, "day").startOf("day").add(9, "hour").toDate(),
        endTime: dayjs().add(day, "day").startOf("day").add(9, "hour").clone().add(1, "hour").toDate(),
        capacity: 27,
      }
    });

    await prisma.activity.create({
      data: {
        name: "Palestra z",
        activityPlaceId: activityPlace3.id,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        startTime: dayjs().add(day, "day").startOf("day").add(9, "hour").toDate(),
        endTime: dayjs().add(day, "day").startOf("day").add(9, "hour").clone().add(1, "hour").toDate(),
        capacity: 27,
      }
    });

    day++;
  }

  const hotel1 = await prisma.hotel.create({
    data: {
      image: "https://media-cdn.tripadvisor.com/media/photo-s/1c/b3/e4/10/costao-do-santinho-resort.jpg",
      name: "Driven Beach",
    }
  });

  const hotel2 = await prisma.hotel.create({
    data: {
      image: "https://media-cdn.tripadvisor.com/media/photo-s/16/f2/69/4b/ocean-palace-beach-resort.jpg",
      name: "Driven Malibu",
    }
  });

  const hotel3 = await prisma.hotel.create({
    data: {
      image: "https://media-cdn.tripadvisor.com/media/photo-s/21/d0/01/33/mabu-thermas-grand-resort.jpg",
      name: "Driven Palace",
    }
  });

  await prisma.room.deleteMany({});

  function createRooms(hotelId: number, floors: number) {
    const array: any = [];
    const roomsPerFloor = 10;

    for (let floor = 1; floor <= floors; floor++) {
      for (let roomNumber = 1; roomNumber <= roomsPerFloor; roomNumber++) {
        const room = {
          capacity: floor,
          name: `${floor}${roomNumber < 10 ? "0" : ""}${roomNumber}`,
          hotelId,
        };
        array.push(room);
      }
    }

    return array;
  }

  const roomsHotel1 = createRooms(hotel1.id, 2);
  await prisma.room.createMany({ data: roomsHotel1 });
  const roomshotel2 = createRooms(hotel2.id, 3);
  await prisma.room.createMany({ data: roomshotel2 });
  const roomsHotel3 = createRooms(hotel3.id, 4);
  await prisma.room.createMany({ data: roomsHotel3 });

  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
