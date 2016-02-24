/// <reference path="ExecutionResult" />
/// <reference path="User" />
/// <reference path="Fork" />
/// <reference path="Label" />

module PrintClient.PrintApi {
	export class Pullrequest {
		id: string;
		number: number;
		title: string;
		description: string;
		createdAt: string;
		updatedAt: string;
		statusesUrl: string;
		commitCount: number;
		url: string;
		diffUrl: string;
		repositoryName: string;
		user: User;
		head: Fork;
		base: Fork;
		executionResults: ExecutionResult[] = [];
		allJobsComplete: string;
        labels: Label[];
	}
}
