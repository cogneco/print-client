/// <reference path="printapi/PullRequest" />
/// <reference path="Ajax" />
/// <reference path="HtmlBuilder" />

module PrintClient {
	var intervalHandle: number;
	var pollInterval = 20000;
	var lastDataRetrival: string;
	export class Client {
		static loadPR(event: Event, element: Element) {
			event.preventDefault();
			event.stopPropagation();
			HtmlBuilder.clearElementById("pr-container");
			clearInterval(intervalHandle);
			HtmlBuilder.appendElementById("pr-container", HtmlBuilder.createElement("h1", element.firstElementChild.textContent));
			Ajax.loadXMLDoc(element.getAttribute("href"), "GET", Client.loadPRCallback, "json");
			intervalHandle = setInterval(() => { Ajax.loadXMLDoc(element.getAttribute("href"), "GET", Client.loadPRCallback, "json"); }, pollInterval);
		}
		static loadRepoPRs(value: string) {
			PrintClient.HtmlBuilder.clearElementById("pr-container");
			clearInterval(intervalHandle);
			if (value != "none") {
				HtmlBuilder.appendElementById("pr-container", HtmlBuilder.createElement("h1", value));
				Ajax.loadXMLDoc("/print/" + value, "GET", Client.loadPRListCallback, "json");
				intervalHandle = setInterval(() => { Ajax.loadXMLDoc("/print/" + value, "GET", Client.loadPRListCallback, "json"); }, pollInterval);
			}
		}
		static loadReposCallback(event: any) {
			var repos = <string[]>event.target.response;
			HtmlBuilder.appendElementById("repo-select", HtmlBuilder.createElement("option", "Choose repository", "value", "none"));
			repos.forEach(function(repo) {
				HtmlBuilder.appendElementById("repo-select", HtmlBuilder.createElement("option", repo, "value", repo));
			});
		}
		static loadPRListCallback(event: any) {
			var pullrequests = <PrintApi.PullRequest[]>event.target.response;
			pullrequests.forEach(function(pr) {
				if (!HtmlBuilder.updatePRBox(pr, true)) {
					HtmlBuilder.appendElementById("pr-container", HtmlBuilder.createPRBox(pr, true));
				}
			});
			lastDataRetrival = event.target.getResponseHeader("Date");
		}
		static loadPRCallback(event: any) {
			var pullrequest = <PrintApi.PullRequest>event.target.response;
			if (!HtmlBuilder.updatePRBox(pullrequest, false)) {
				HtmlBuilder.appendElementById("pr-container", HtmlBuilder.createPRBox(pullrequest, false));
			}
			lastDataRetrival = event.target.getResponseHeader("Date");
		}
	}
}

PrintClient.Ajax.loadXMLDoc("/print", "GET", PrintClient.Client.loadReposCallback, "json");
