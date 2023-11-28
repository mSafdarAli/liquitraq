
export interface Role {
	_id: string,
	name: string;
	permissions: { [key: string]: { [key: string]: boolean } };
}
export interface User {
	_id: string,
	name: string,
	email: string,	
	role: Role;
}


