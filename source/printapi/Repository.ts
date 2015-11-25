/// <reference path="User" />

module PrintClient.PrintApi {
	export class Repository {
		id: string;
		name: string;
		fullName: string;
		owner: User;
		isPrivate: boolean;
		isFork: boolean;
		url: string;
		pullsUrl: string;
	}
}
