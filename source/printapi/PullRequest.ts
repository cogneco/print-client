/// <reference path="ExecutionResult" />

module PrintClient.PrintApi {
	export class PullRequest {
		id: string;
		number: number;
		title: string;
		description: string;
		createdAt: string;
		updatedAt: string;
		url: string;
		diffUrl: string;
		repositoryName: string;
		executionResults: ExecutionResult[] = [];
	}
}
