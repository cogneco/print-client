/// <reference path="ExecutionResult.ts" />
/// <reference path="User.ts" />
/// <reference path="Fork.ts" />
/// <reference path="Label.ts" />

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
