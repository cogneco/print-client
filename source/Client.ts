/// <reference path="printapi/PullRequest" />
/// <reference path="Ajax" />
/// <reference path="HtmlBuilder" />

module PrintClient {
	export class Client {
		private intervalHandle: number;
		private pollInterval: number;
		private lastEtag: string;
		private pullrequestIdList: string[] = [];		
		constructor() {
			this.pollInterval = 60000;
			Ajax.loadXMLDoc("/print", "GET", this.loadReposCallback, "json");
		}
		loadPR(event: Event, element: Element) {
			event.preventDefault();
			event.stopPropagation();
			HtmlBuilder.clearElementById("pr-container");
			clearInterval(this.intervalHandle);
			HtmlBuilder.appendElementById("pr-container", HtmlBuilder.createElement("h1", element.firstElementChild.textContent));
			var returnButton = HtmlBuilder.createElement("input", "", "type", "button");
			var href = element.getAttribute("href");
			returnButton.setAttribute("id", "return-button");
			returnButton.setAttribute("value", "Return to list");
			returnButton.setAttribute("onclick", "printClient.loadRepoPRs(\"" + href.split("/")[2] + "\")");
			document.getElementsByTagName("header")[0].children[0].appendChild(returnButton);
			Ajax.loadXMLDoc(href, "GET", this.loadPRCallback, "json");
			this.intervalHandle = setInterval(() => { Ajax.loadXMLDoc(href, "GET", this.loadPRCallback, "json"); }, this.pollInterval);
		}
		loadRepoPRs(value: string) {
			PrintClient.HtmlBuilder.clearElementById("pr-container");
			HtmlBuilder.removeElementById("return-button");
			this.pullrequestIdList = [];
			clearInterval(this.intervalHandle);
			if (value != "none") {
				/*HtmlBuilder.appendElementById("pr-container", HtmlBuilder.createElement("h1", value));*/
				Ajax.loadXMLDoc("/print/" + value, "GET", this.loadPRListCallback, "json");
				this.intervalHandle = setInterval(() => { Ajax.loadXMLDoc("/print/" + value, "GET", this.loadPRListCallback, "json", this.lastEtag); }, this.pollInterval);
			}
		}
		loadReposCallback(event: any) {
			var repos = <string[]>event.target.response;
			/*HtmlBuilder.appendElementById("repo-select", HtmlBuilder.createElement("option", "Choose repository", "value", "none"));*/
			for (var i = 0; i < repos.length; i++) {
				var option = HtmlBuilder.createElement("option", repos[i], "value", repos[i]);
				if (i == 0) {
					option.setAttribute("selected", "");
					printClient.loadRepoPRs(repos[i]);
				}
				HtmlBuilder.appendElementById("repo-select", option);					
			}
		}
		loadPRListCallback(event: any) {
			var pullrequests = <PrintApi.PullRequest[]>event.target.response;
			var receivedPRs: string[] = [];
			pullrequests.forEach((pr) => {
				receivedPRs.push(pr.id);
				if (!HtmlBuilder.updatePRBox(pr, true)) {
					printClient.pullrequestIdList.push(pr.id);
					HtmlBuilder.appendElementById("pr-container", HtmlBuilder.createPRBox(pr, true));
				}
			});
			printClient.pullrequestIdList.forEach((id) => {
				if (receivedPRs.indexOf(id) < 0) {
					HtmlBuilder.removeElementById(id);
					printClient.pullrequestIdList = printClient.pullrequestIdList.filter((filterID) => {
						return filterID != id; 
					});
				}
			});
			printClient.lastEtag = event.target.getResponseHeader("etag");
		}
		loadPRCallback(event: any) {
			var pullrequest = <PrintApi.PullRequest>event.target.response;
			if (!HtmlBuilder.updatePRBox(pullrequest, false)) {
				HtmlBuilder.appendElementById("pr-container", HtmlBuilder.createPRBox(pullrequest, false));
			}
		}
	}
}
var printClient = new PrintClient.Client();