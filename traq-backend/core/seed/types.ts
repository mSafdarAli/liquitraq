import { ObjectId } from "mongodb";
import { Equipment_Type } from "../../models";

export const Types: Equipment_Type[] = [
    {
        _id: new ObjectId(),
        name: "Network Gear",
        value: "network gear",
        category: "IT"
    },
    {
        _id: new ObjectId(),
        name: "Servers",
        value: "servers",
        category: "IT"
    },
    {
        _id: new ObjectId(),
        name: "PCs",
        value: "PCs",
        category: "IT"
    },
    {
        _id: new ObjectId(),
        name: "Laptops",
        value: "laptops",
        category: "IT"
    },
    {
        _id: new ObjectId(),
        name: "Rack",
        value: "rack",
        category: "IT"
    },
    {
        _id: new ObjectId(),
        name: "Telecom",
        value: "telecom",
        category: "IT"
    },
    {
        _id: new ObjectId(),
        name: "Monitors",
        value: "monitors",
        category: "IT"
    },
    {
        _id: new ObjectId(),
        name: "Camera",
        value: "camera",
        category: "IT"
    },
    {
        _id: new ObjectId(),
        name: "Printers",
        value: "printers",
        category: "IT"
    },
    {
        _id: new ObjectId(),
        name: "Other",
        value: "other",
        category: "IT"
    },
    {
        _id: new ObjectId(),
        name: "Cubicle",
        value: "cubicle",
        category: "Furniture"
    },
    {
        _id: new ObjectId(),
        name: "Casegood",
        value: "casegood",
        category: "Furniture"
    },
    {
        _id: new ObjectId(),
        name: "Chair",
        value: "chair",
        category: "Furniture"
    },
    {
        _id: new ObjectId(),
        name: "Wall Hanging",
        value: "wall hanging",
        category: "Furniture"
    },
    {
        _id: new ObjectId(),
        name: "Appliance",
        value: "appliance",
        category: "Furniture"
    },
    {
        _id: new ObjectId(),
        name: "Other",
        value: "other",
        category: "Furniture"
    },
    {
        _id: new ObjectId(),
        name: "Generator",
        value: "generator",
        category: "Infrastructure"
    },
    {
        _id: new ObjectId(),
        name: "CRAC Unit",
        value: "crac unit",
        category: "Infrastructure"
    },
    {
        _id: new ObjectId(),
        name: "UPS",
        value: "ups",
        category: "Infrastructure"
    },
    {
        _id: new ObjectId(),
        name: "ATS",
        value: "ats",
        category: "Infrastructure"
    },
    {
        _id: new ObjectId(),
        name: "Bypass",
        value: "bypass",
        category: "Infrastructure"
    },
    {
        _id: new ObjectId(),
        name: "Switchgear",
        value: "switchgear",
        category: "Infrastructure"
    },
    {
        _id: new ObjectId(),
        name: "Batteries",
        value: "batteries",
        category: "Infrastructure"
    },
    {
        _id: new ObjectId(),
        name: "Wiring, Low-Voltage",
        value: "wiring, low-voltage",
        category: "Infrastructure"
    },
    {
        _id: new ObjectId(),
        name: "Wiring, High-Voltage",
        value: "wiring, high-voltage",
        category: "Infrastructure"
    },
    {
        _id: new ObjectId(),
        name: "Fire Suppressant",
        value: "fire suppressant",
        category: "Infrastructure"
    },
    {
        _id: new ObjectId(),
        name: "Raised Flooring",
        value: "raised flooring",
        category: "Infrastructure"
    },
    {
        _id: new ObjectId(),
        name: "Paint/Chemical",
        value: "paint/chemical",
        category: "Infrastructure"
    },
    {
        _id: new ObjectId(),
        name: "Other",
        value: "other",
        category: "Infrastructure"
    },
]







// export const Types: Type[] = [
//     {
//         _id: new ObjectId(),
//         name: "IT",
//         fields: [
//             'Network gear',
//             'Servers',
//             'PCs',
//             'Laptops',
//             'Rack',
//             'Telecom',
//             'Monitors',
//             'Camera',
//             'Printers',
//             'Other',
//         ]
//     },
//     {
//         _id: new ObjectId(),
//         name: "Furniture",
//         fields: [
//             'Cubicle',
//             'Casegood',
//             'Chair',
//             'Wall hanging',
//             'Appliance',
//             'Other',
//         ]
//     },
//     {
//         _id: new ObjectId(),
//         name: "Infrastructure",
//         fields: [
//             'Generator',
//             'CRAC Unit',
//             'UPS',
//             'ATS',
//             'Bypass',
//             'Switchgear',
//             'Batteries',
//             'Wiring, Low-Voltage',
//             'Wiring, High-Voltage',
//             'Fire Suppressant',
//             'Raised Flooring',
//             'Paint/Chemical',
//             'Other',
//         ]
//     },
// ]
