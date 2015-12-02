/// <reference path="printapi/Pullrequest" />
/// <reference path="Ajax" />
/// <reference path="HtmlBuilder" />
/// <reference path="PullrequestBuilder" />

module PrintClient {
	export class Client {
		private intervalHandle: number;
		private pollInterval: number;
		private lastEtag: string;
		private pullrequestIdList: string[] = [];
		private localhost: boolean = false;	
		constructor() {
			Ajax.loadXMLDoc("/print/print-client/am-i-localhost", "GET", this.localhostCallback, "json");
			this.pollInterval = 60000;
			Ajax.loadXMLDoc("/print/repolist", "GET", this.loadReposCallback, "json");
		}
		loadPR(event: Event, element: Element) {
			event.preventDefault();
			event.stopPropagation();
			HtmlBuilder.clearElementById("pr-container");
			clearInterval(this.intervalHandle);
			/*HtmlBuilder.appendElementById("pr-container", HtmlBuilder.createElement("h1", element.firstElementChild.textContent));*/
			var returnButton = HtmlBuilder.createElement("input", "", "type", "button");
			var href = element.getAttribute("href");
			returnButton.setAttribute("id", "return-button");
			returnButton.setAttribute("value", "Return to list");
			returnButton.setAttribute("onclick", "printClient.loadRepoPRs(\"" + href.split("/")[2] + "\")");
			if (this.localhost) {
				var exploreButton = HtmlBuilder.createElement("input", "", "type", "button");
				exploreButton.setAttribute("id", "explore-terminal-button");
				exploreButton.setAttribute("value", "Open in terminal");
				exploreButton.setAttribute("onclick", "printClient.explorePR(\"terminal\",\"" + href.split("/")[2] + "\",\"" + href.split("/")[4] + "\")");
				document.getElementsByTagName("header")[0].children[0].appendChild(exploreButton);
				exploreButton = HtmlBuilder.createElement("input", "", "type", "button");
				exploreButton.setAttribute("id", "explore-nautilus-button");
				exploreButton.setAttribute("value", "Open in nautilus");
				exploreButton.setAttribute("onclick", "printClient.explorePR(\"nautilus\",\"" + href.split("/")[2] + "\",\"" + href.split("/")[4] + "\")");
				document.getElementsByTagName("header")[0].children[0].appendChild(exploreButton);
			}
			document.getElementsByTagName("header")[0].children[0].appendChild(returnButton);
			Ajax.loadXMLDoc(href, "GET", this.loadPRCallback, "json");
			this.intervalHandle = setInterval(() => { Ajax.loadXMLDoc(href, "GET", this.loadPRCallback, "json", this.lastEtag); }, this.pollInterval);
		}
		loadRepoPRs(value: string) {
			PrintClient.HtmlBuilder.clearElementById("pr-container");
			HtmlBuilder.removeElementById("return-button");
			HtmlBuilder.removeElementById("explore-terminal-button");
			HtmlBuilder.removeElementById("explore-nautilus-button");
			this.pullrequestIdList = [];
			clearInterval(this.intervalHandle);
			if (value != "none") {
				/*HtmlBuilder.appendElementById("pr-container", HtmlBuilder.createElement("h1", value));*/
				Ajax.loadXMLDoc("/print/" + value, "GET", this.loadPRListCallback, "json");
				this.intervalHandle = setInterval(() => { Ajax.loadXMLDoc("/print/" + value, "GET", this.loadPRListCallback, "json", this.lastEtag); }, this.pollInterval);
			}
		}
		explorePR(application: string, repo: string, pr: string) {
			Ajax.loadXMLDoc("/print/explore/" + application + "/" + repo + "/" + pr, "GET");
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
			if (event.target.status == 200) {
				var pullrequests = <PrintApi.Pullrequest[]>event.target.response;
				var receivedPRs: string[] = [];
				pullrequests.forEach((pr) => {
					receivedPRs.push(pr.id);
					if (!PullrequestBuilder.updatePRBox(pr, true)) {
						printClient.pullrequestIdList.push(pr.id);
						HtmlBuilder.appendElementById("pr-container", PullrequestBuilder.createPRBox(pr, true));
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
			else {
				if (document.getElementsByClassName("error").length <= 0)
					HtmlBuilder.appendElementById("pr-container", HtmlBuilder.createElement("div", event.target.response.error, "class", "error"));
			}
		}
		loadPRCallback(event: any) {
			if (event.target.status == 200) {
				var pullrequest = <PrintApi.Pullrequest>event.target.response;
				if (!PullrequestBuilder.updatePRBox(pullrequest, false)) {
					HtmlBuilder.appendElementById("pr-container", PullrequestBuilder.createPRBox(pullrequest, false));
				}
				printClient.lastEtag = event.target.getResponseHeader("etag");
			}
			else {
				if (document.getElementsByClassName("error").length <= 0)
					HtmlBuilder.appendElementById("pr-container", HtmlBuilder.createElement("div", event.target.response.error, "class", "error"));
			}
		}
		localhostCallback(event: any) {
			if (event.target.response.localhost == "yes")
				printClient.localhost = true;
		}
	}
}
var printClient = new PrintClient.Client();