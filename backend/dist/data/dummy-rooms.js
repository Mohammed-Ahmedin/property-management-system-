"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dummyRoomsData = void 0;
exports.dummyRoomsData = [
    {
        name: "Ocean View Single",
        roomId: "ROOM-001",
        type: "SINGLE",
        price: 80,
        description: "Cozy single room with an ocean view, perfect for solo travelers.",
        availability: true,
        square_meters: 20,
        max_occupancy: 1,
        propertyId: "YOUR_GUEST_HOUSE_ID_1",
        beds: {
            singleBeds: 1,
            doubleBeds: 0,
            queenBeds: 0,
            kingBeds: 0,
            sofaBeds: 0,
            cribs: false,
        },
        livingFeatures: {
            privateBathroom: true,
            shower: true,
            tv: true,
            wifiAvailable: true,
            bathtub: false,
        },
        kitchenFeatures: {
            coffeeMaker: true,
            refrigerator: true,
            microwave: true,
        },
        accessibility: {
            wheelchairAccessible: false,
        },
        hygieneFeatures: {
            sanitizer: true,
            digitalKeys: true,
        },
        images: [
            {
                url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd9kGl3tRP4NToluVBrGaXBBMooz8uRmF4cw&s",
                name: "Ocean view",
            },
        ],
    },
    {
        name: "Deluxe Double",
        roomId: "ROOM-002",
        type: "DOUBLE",
        price: 150,
        description: "Spacious double room with deluxe amenities and balcony view.",
        availability: true,
        square_meters: 35,
        max_occupancy: 2,
        propertyId: "YOUR_GUEST_HOUSE_ID_1",
        beds: {
            singleBeds: 0,
            doubleBeds: 1,
            queenBeds: 0,
            kingBeds: 0,
            sofaBeds: 1,
            cribs: false,
        },
        livingFeatures: {
            privateBathroom: true,
            bathtub: true,
            tv: true,
            wifiAvailable: true,
            minibar: true,
        },
        kitchenFeatures: {
            coffeeMaker: true,
            refrigerator: true,
            microwave: true,
        },
        accessibility: {
            wheelchairAccessible: true,
        },
        hygieneFeatures: {
            sanitizer: true,
            hygieneKits: true,
            digitalKeys: true,
        },
        images: [
            {
                url: "https://images.squarespace-cdn.com/content/v1/56dfd5cc9f7266ed7f04b64d/1585743751085-N2317B7K3I2YBZHPHENO/image-asset.jpeg",
                name: "Deluxe view",
            },
        ],
    },
    {
        name: "Suite Executive",
        roomId: "ROOM-003",
        type: "EXECUTIVE",
        price: 250,
        description: "Luxury suite with executive facilities, ideal for business travelers.",
        availability: true,
        square_meters: 50,
        max_occupancy: 3,
        propertyId: "YOUR_GUEST_HOUSE_ID_1",
        beds: {
            singleBeds: 1,
            doubleBeds: 1,
            queenBeds: 1,
            kingBeds: 0,
            sofaBeds: 1,
            cribs: true,
        },
        livingFeatures: {
            privateBathroom: true,
            bathtub: true,
            shower: true,
            tv: true,
            wifiAvailable: true,
            minibar: true,
            streamingTv: true,
        },
        kitchenFeatures: {
            coffeeMaker: true,
            refrigerator: true,
            microwave: true,
        },
        accessibility: {
            wheelchairAccessible: true,
        },
        hygieneFeatures: {
            sanitizer: true,
            hygieneKits: true,
            digitalKeys: true,
        },
        images: [
            {
                url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd9kGl3tRP4NToluVBrGaXBBMooz8uRmF4cw&s",
                name: "Executive view",
            },
            {
                url: "https://images.squarespace-cdn.com/content/v1/56dfd5cc9f7266ed7f04b64d/1585743751085-N2317B7K3I2YBZHPHENO/image-asset.jpeg",
                name: "Executive lounge",
            },
        ],
    },
];
