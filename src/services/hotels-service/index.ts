import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";

async function getHotelsRoomsBookings(userId: number) {
    //Tem enrollment?
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
        throw notFoundError();
    }
    //Tem ticket pago isOnline false e includesHotel true
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

    if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
        throw cannotListHotelsError();
    }
    const hotelsRoomsBookings = await hotelRepository.getHotelsRoomsBookings();

    //console.log(hotelsRoomsBookings.rooms);
    //const hotelsRoomsBookingsArray = Object.values(hotelsRoomsBookings);
    //console.log(hotelsRoomsBookingsArray);
    const roomsArray = hotelsRoomsBookings.rooms;
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
    type AccommodationTypes = {
        hotelIdArray: number[];
        typeStringArray: string[];
    };
    const accommodation: AccommodationTypes = {
        hotelIdArray: uniqueHotelIds,
        typeStringArray: capacityStringArray
    };

    console.log('accommodation',accommodation);


    return hotelsRoomsBookings;
}

async function listHotels(userId: number) {
    //Tem enrollment?
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
        throw notFoundError();
    }
    //Tem ticket pago isOnline false e includesHotel true
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

    if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
        throw cannotListHotelsError();
    }
}

async function getHotels(userId: number) {
    await listHotels(userId);

    const hotels = await hotelRepository.findHotels();
    return hotels;
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
    await listHotels(userId);
    const hotel = await hotelRepository.findRoomsByHotelId(hotelId);

    if (!hotel) {
        throw notFoundError();
    }
    return hotel;
}

const hotelService = {
    getHotelsRoomsBookings,
    getHotels,
    getHotelsWithRooms,
};

export default hotelService;
