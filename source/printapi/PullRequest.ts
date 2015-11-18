module PrintClient.PrintApi {
	export class PullRequest {
		id: string;
		repository: string;
		number: number;
		title: string;
		description: string;
		createdAt: string;
		updatedAt: string;
		url: string;
		diffUrl: string;
	}
}
