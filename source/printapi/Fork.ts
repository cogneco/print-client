/// <reference path="User" />
/// <reference path="Repository" />

module PrintClient.PrintApi {
	export class Fork {
		label: string;
		ref: string;
		sha: string;
		user: User;
		repository: Repository;
	}
}
