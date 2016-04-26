/// <reference path="User.ts" />
/// <reference path="Repository.ts" />

module PrintClient.PrintApi {
	export class Fork {
		label: string;
		ref: string;
		sha: string;
		user: User;
		repository: Repository;
	}
}
