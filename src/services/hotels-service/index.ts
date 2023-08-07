import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import { AccommodationTypes, vacanciesTypes } from "@/protocols";
import redis, { DEFAULT_EXP } from "@/config/redis";

async function getHotelsRoomsBookings(userId: number) {
    //Tem enrollment?
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
        throw notFoundError();
    }
    //Tem ticket pago isOnline false e includesHotel true
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

    if (!ticket || ticket.status === "RESERVED" || !ticket.TicketType.includesHotel) {
        throw cannotListHotelsError();
    }
    if (ticket.TicketType.isRemote) {
        throw Error("NoHotel")
    }
    const hotelsRoomsBookings = await hotelRepository.getHotelsRoomsBookings();

    //console.log(hotelsRoomsBookings.rooms);
    //const hotelsRoomsBookingsArray = Object.values(hotelsRoomsBookings);
    //console.log(hotelsRoomsBookingsArray);
    const roomsArray = hotelsRoomsBookings.rooms;
    const hotelsArray = hotelsRoomsBookings.hotels;
    const bookingsArray = hotelsRoomsBookings.bookings;
    //console.log(roomsArray);
    //const roomWithCapacitySingle = (!!roomsArray.find((r) => r.capacity === 1)) ? "Single" : false;
    //const roomWithCapacityDouble = (!!roomsArray.find((r) => r.capacity === 2)) ? "Double" : false;
    //const roomWithCapacityTriple = (!!roomsArray.find((r) => r.capacity === 3)) ? "Triple" : false;
    ////console.log("roomWithCapacitySingleee", roomWithCapacitySingle);
    ////console.log("roomWithCapacityDoublee", roomWithCapacityDouble);
    ////console.log("roomWithCapacityTriple", roomWithCapacityTriple);
    //let capacityArray: string[] = [];
    //if (roomWithCapacitySingle) {
    //    capacityArray.push(roomWithCapacitySingle);
    //}
    //if (roomWithCapacityDouble) {
    //    capacityArray.push(roomWithCapacityDouble);
    //}
    //if (roomWithCapacityTriple) {
    //    capacityArray.push(roomWithCapacityTriple);
    //}
    ////console.log("capacityArray", capacityArray);
    //let capacityString: string = "";
    //if (capacityArray.length === 3) {
    //    capacityString = `${capacityArray[0]}, ${capacityArray[1]} e ${capacityArray[2]}`
    //} else if (capacityArray.length === 2) {
    //    capacityString = `${capacityArray[0]} e ${capacityArray[1]}`
    //} else if (capacityArray.length === 1) {
    //    capacityString = `${capacityArray[0]}`
    //}
    //console.log("capacityString", capacityString);
    const uniqueHotelIds = hotelsRoomsBookings.rooms.reduce((acc, room) => {
        if (!acc.includes(room.hotelId)) {
            acc.push(room.hotelId);
        }
        return acc;
    }, []);
    const numberOfUniqueHotelIds = uniqueHotelIds.length;
    //console.log("Número de hotelId únicos presentes em rooms:", numberOfUniqueHotelIds);
    //console.log("Array com os hotelId únicos:", uniqueHotelIds);
    const capacityStringArray: string[] = [];
    for (let i = 0; i < numberOfUniqueHotelIds; i++) {
        const roomsWithHotelId = hotelsRoomsBookings.rooms.filter((room) => room.hotelId === uniqueHotelIds[i]);
        //console.log("hotelId", uniqueHotelIds[i]);
        //console.log("roomsWithHotelId", roomsWithHotelId);
        const roomWithCapacitySingle = (!!roomsWithHotelId.find((r) => r.capacity === 1)) ? "Single" : false;
        const roomWithCapacityDouble = (!!roomsWithHotelId.find((r) => r.capacity === 2)) ? "Double" : false;
        const roomWithCapacityTriple = (!!roomsWithHotelId.find((r) => r.capacity === 3)) ? "Triple" : false;
        let capacityArray: string[] = [];
        if (roomWithCapacitySingle) {
            capacityArray.push(roomWithCapacitySingle);
        }
        if (roomWithCapacityDouble) {
            capacityArray.push(roomWithCapacityDouble);
        }
        if (roomWithCapacityTriple) {
            capacityArray.push(roomWithCapacityTriple);
        }
        let capacityString: string = "";
        if (capacityArray.length === 3) {
            capacityString = `${capacityArray[0]}, ${capacityArray[1]} e ${capacityArray[2]}`
        } else if (capacityArray.length === 2) {
            capacityString = `${capacityArray[0]} e ${capacityArray[1]}`
        } else if (capacityArray.length === 1) {
            capacityString = `${capacityArray[0]}`
        }
        //console.log("capacityString", capacityString);
        capacityStringArray.push(capacityString);
    }
    const hotelNameArray: string[] = [];
    const hotelImageArray: string[] = [];

    hotelsArray.forEach((h) => {
        hotelNameArray.push(h.name);
        hotelImageArray.push(h.image);
    });

    const accommodation: AccommodationTypes = {
        hotelIdArray: uniqueHotelIds,
        typeStringArray: capacityStringArray,
        hotelNameArray,
        hotelImageArray
    };

    function getAvailableRoomCapacity(roomId: number): number {
        const room = roomsArray.find((room) => room.id === roomId);
        if (!room) return 0;

        const totalBookings = bookingsArray.filter((b) => b.roomId === roomId).length;
        const availableCapacity = room.capacity - totalBookings;
        return availableCapacity >= 0 ? availableCapacity : 0;
    }


    let hotelVacanciesArray: number[] = [];
    let hotelIdRoomArray: number[] = [];
    roomsArray.forEach((r) => {
        const availableCapacity = getAvailableRoomCapacity(r.id);
        hotelVacanciesArray.push(availableCapacity);
        hotelIdRoomArray.push(r.hotelId);
        //console.log(`Quarto ${r.name} (hotelId: ${r.hotelId}) - Vagas disponíveis: ${availableCapacity}`);
    });

    const vacancies: vacanciesTypes = {
        hotelIdArray: hotelIdRoomArray,
        hotelVacanciesArray
    }

    //console.log('accommodation', accommodation);
    //console.log('vacancies', vacancies);

    //hotelsRoomsBookings.vacancies = vacancies;
    //hotelsRoomsBookings.accommodation = accommodation;

    //console.log('hotelsRoomsBookings', hotelsRoomsBookings);

    const sendableObject = {
        hotels: hotelsRoomsBookings.hotels.map((hotel) => {
            // Encontrar o índice correspondente do hotel em accommodation.hotelIdArray
            const index = accommodation.hotelIdArray.indexOf(hotel.id);

            // Verificar se o hotel está presente em accommodation.hotelIdArray
            const accommodationInfo = index !== -1 ? accommodation.typeStringArray[index] : "Informação não disponível";

            // Encontrar as vagas disponíveis do hotel em vacancies.hotelIdArray
            const vacanciesIndex = vacancies.hotelIdArray.indexOf(hotel.id);

            // Calcular a soma das vagas disponíveis do hotel
            let vacanciesSum = 0;
            if (vacanciesIndex !== -1) {
                for (let i = vacanciesIndex; i < vacancies.hotelIdArray.length; i++) {
                    if (vacancies.hotelIdArray[i] === hotel.id) {
                        vacanciesSum += vacancies.hotelVacanciesArray[i];
                    } else {
                        break;
                    }
                }
            }

            return {
                ...hotel,
                accommodation: accommodationInfo,
                vacanciesSum,
            };
        }),
        rooms: hotelsRoomsBookings.rooms,
        bookings: hotelsRoomsBookings.bookings,
        accommodation,
        vacancies,
    };

    return sendableObject;
}



async function listHotels(userId: number) {
    //Tem enrollment?
    const cacheKey = `listHotels:${userId}`;
    const cachedEnrrolment = await redis.get(cacheKey);

    if (cachedEnrrolment) return JSON.parse(cachedEnrrolment);

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
        throw notFoundError();
    }
    //Tem ticket pago isOnline false e includesHotel true
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

    if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
        throw cannotListHotelsError();
    }

    redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(ticket));
}

async function getHotels(userId: number) {
    await listHotels(userId);

    const cacheKey = `getHotels:${userId}`;
    const cachedHotels = await redis.get(cacheKey);

    if (cachedHotels) return JSON.parse(cachedHotels);

    const hotels = await hotelRepository.findHotels();
    redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(hotels));

    return hotels;
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
    await listHotels(userId);

    const cacheKey = `HotelsWithRooms:${userId}`;
    const cachedHotelsWithRooms = await redis.get(cacheKey);

    if (cachedHotelsWithRooms) return JSON.parse(cachedHotelsWithRooms);

    const hotel = await hotelRepository.findRoomsByHotelId(hotelId);

    if (!hotel) {
        throw notFoundError();
    }

    redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(hotel));
    return hotel;
}

const hotelService = {
    getHotelsRoomsBookings,
    getHotels,
    getHotelsWithRooms,
};

export default hotelService;
