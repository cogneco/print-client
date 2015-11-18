/// <reference path="printapi/PullRequest" />
/// <reference path="Ajax" />
/// <reference path="HtmlBuilder" />

module PrintClient {
	var intervalHandle: number;
	export class Client {
		static loadPR(event: Event, element: Element) {
			event.preventDefault();
			event.stopPropagation();
			HtmlBuilder.clearElement("pr-container");
			clearInterval(intervalHandle);
			HtmlBuilder.appendElementById("pr-container", HtmlBuilder.createElement("h1", element.firstElementChild.textContent));
			Ajax.loadXMLDoc(element.getAttribute("href"), "GET", Client.loadPRCallback, "json");
			intervalHandle = setInterval(() => { Ajax.loadXMLDoc(element.getAttribute("href"), "GET", Client.loadPRCallback, "json"); }, 5000);
		}
		static loadRepoPRs(value: string) {
			PrintClient.HtmlBuilder.clearElement("pr-container");
			clearInterval(intervalHandle);
			if (value != "none") {
				HtmlBuilder.appendElementById("pr-container", HtmlBuilder.createElement("h1", value));
				Ajax.loadXMLDoc("/print/" + value, "GET", Client.loadPRListCallback, "json");
				intervalHandle = setInterval(() => { Ajax.loadXMLDoc("/print/" + value, "GET", Client.loadPRListCallback, "json"); }, 5000);
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
				if (!HtmlBuilder.updatePRBox(pr, false)) {
					HtmlBuilder.appendElementById("pr-container", HtmlBuilder.createPRBox(pr, false));
				}
			});
		}
		static loadPRCallback(event: any) {
			var pullrequest = <PrintApi.PullRequest>event.target.response;
			if (!HtmlBuilder.updatePRBox(pullrequest, true)) {
				HtmlBuilder.appendElementById("pr-container", HtmlBuilder.createPRBox(pullrequest, true));
			}
		}
	}
}

PrintClient.Ajax.loadXMLDoc("/print", "GET", PrintClient.Client.loadReposCallback, "json");
