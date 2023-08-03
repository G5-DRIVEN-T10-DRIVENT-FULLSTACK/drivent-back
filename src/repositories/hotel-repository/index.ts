import { prisma } from "@/config";

async function findHotels() {
    return prisma.hotel.findMany();
}

async function getHotelsRoomsBookings() {
    // Consulta para retornar todos os Hotéis
    const allHotels = await prisma.hotel.findMany();
    // Consulta para retornar todos os Quartos
    const allRooms = await prisma.room.findMany();

    allRooms.sort((room1, room2) => room1.hotelId - room2.hotelId);
    // Consulta para retornar todas as Reservas
    const allBookings = await prisma.booking.findMany();
    return {
        hotels: allHotels,
        rooms: allRooms,
        bookings: allBookings,
    };
}

async function findRoomsByHotelId(hotelId: number) {
    return prisma.hotel.findFirst({
        where: {
            id: hotelId,
        },
        include: {
            Rooms: true,
        }
    });
}

const hotelRepository = {
    getHotelsRoomsBookings,
    findHotels,
    findRoomsByHotelId,
};

export default hotelRepository;
