let orderNumber = 132;

export const receiptData  = {
    restaurantName: "FISH & CHIPS RESTAURANT",
    address: "1234 Main Street",
    phone: "123-456-7890",
    orderNumber: "123",
    host: "Alice Johnson", 
    date: "12/12/2020",
    time: "12:00 PM",
    items: [
        { name: "Fish & Chips", price: 12.99 },
        { name: "Lemonade", price: 2.99 },
        { name: "Tartar Sauce", price: 1.99 },
        { name: "Ketchup", price: 0.99 }
    ]
}

export function generateTableNumber() {
    return Math.floor(Math.random()*112);
}

export function getOrderNumber(){
    orderNumber -= 1;
    return orderNumber;
}

export const mockEmployees = [
    {
        favorite: true,
        address: "GBVSEKXHL4JK6A2UUYPC463UQTWXTLLQ4MF246C3Y26GXLTROLSKCTOF",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw9JZbsJE4aTF1SIp8Ytk7P7A62HQskbmvgg&s",
        name: "Alice Johnson",
        id: "1"
    },
    {
        favorite: false,
        address: "GAEQOSDIE54ZZMSMVGL5REZ47NBN5GJR46XIWOOA6PXDGRWYZONNOFZB",
        name: "Bob Smith",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_YywG_8PeFm6bYNVrfWRS_xBNdNkvHZhM9w&s",
        id: "2"
    },
    {
        favorite: true,
        address: "GD4LI5O4M2C76EDD6GWPPFP2L7AREXGBGQL3KAF2OGTWBD3WYSISM5JD",
        name: "Charlie Brown",
        image: "https://img.freepik.com/premium-photo/young-african-american-waiter-man-hold-tray_521733-6356.jpg?w=740",
        id: "3"
    },
    {
        favourite: false,
        address: "GBAODDLR7OZK75JICEF46UNZ4KS3VF3OBTJNISDEZ73HXKEBL2IJRCD5",
        name: "George Clooney",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl4E3oJ_zOoBVQZLjry0piHlrc6mKntxxcqw&s",
        id: "4"
    }
];