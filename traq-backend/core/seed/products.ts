import { ObjectId } from "mongodb";
import { Products } from "../../models";

let products: any[] = []

for (let i = 0; i < 100; i++) {
	const category = ["Infrastructure", "IT", "Furniture"]
	const type = ["recycled", "disposed", "returnToCustomer"]
	const status = ["originalState", "completed", "in-progress"]
	var catString = Math.floor(Math.random() * category.length);
	var typeString = Math.floor(Math.random() * type.length);
	var statusString = Math.floor(Math.random() * status.length);
	products.push({
		_id: new ObjectId(),
		assetName: "Sample Asset" + i,
		category: category[catString],
		job: (parseInt("0001") + i).toString().padStart(4, '0'),
		quantity: 1,
		type: getType(category[catString]),
		make: 2022,
		model: "V6",
		serial: 1 + i,
		description: "Description",
		weight_each: 1 + i,
		price: 250 + Math.floor((Math.random() * 100) + 1),
		pictures: [
			"https://liquitraq-images.nyc3.digitaloceanspaces.com/Furniture/0-20230823192110382.png",
			"https://liquitraq-images.nyc3.digitaloceanspaces.com/Furniture/1-20230823192112093.jpg",
			"https://liquitraq-images.nyc3.digitaloceanspaces.com/Furniture/2-20230823192113575.png"
		],
		status: status[statusString],
		disposition: (status[statusString] == "completed") ? {
			data: {
				type: type[typeString],
				date: randomDate(new Date(2023, 0, 1), new Date()),
				who: "whonoit",
				ticketInfo: "info"
			}
		} : {
			data: {
				type: "",
				date: "",
				who: null,
				ticketInfo: ""
			}
		},
		active: true,
		isDeleted: false,
	})
}
function getType(type) {
	if (type == "IT") {
		return "laptop"
	} else if (type == "Furniture") {
		return "cubicle"
	} else {
		return "generator"
	}
}
function randomDate(start, end) {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export const product: Products[] = products