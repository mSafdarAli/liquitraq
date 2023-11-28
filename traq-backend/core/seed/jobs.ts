import { ObjectId } from "mongodb";
import { Job } from "../../models";


let job: any[] = [];
for (let i = 0; i < 30; i++) {
	const status = ["in-progress", "completed"]
	var statusString = Math.floor(Math.random() * status.length);
	job.push({
		_id: new ObjectId(),
		job_name: "xyz1"+i,
		job_no: (parseInt("0001") + i).toString().padStart(4, '0'),
		client: "Abc "+(i+1),
		address: "DHA",
		status: status[statusString],
		start_date: "2023-08-09T19:00:00.000Z",
		end_date: "2023-08-09T19:00:00.000Z",
		isDeleted: false
	})
}
export const jobs: Job[] = job