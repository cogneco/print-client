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
		private admin: boolean = false;
		constructor() {
            if (window.location.pathname.split("/")[4] == "pr")
                Ajax.loadXMLDoc("/print/print-client/check-privileges", "GET", this.privilegesCallback, "json");
			this.pollInterval = 10000;
			Ajax.loadXMLDoc("/print/repolist", "GET", this.loadReposCallback, "json");
		}
		loadPR(repo: string, pr: string) {
			HtmlBuilder.clearElementById("pr-container");
			clearInterval(this.intervalHandle);
			var returnButton = HtmlBuilder.createElement("input", "", "type", "button");
			returnButton.setAttribute("id", "return-button");
			returnButton.setAttribute("value", "Return to list");
			returnButton.setAttribute("onclick", "printClient.changeRepo(\"" + repo + "\")");
			document.getElementsByTagName("header")[0].children[0].appendChild(returnButton);
			var exploreButton = HtmlBuilder.createElement("input", "", "type", "button");
			exploreButton.setAttribute("id", "run-tests-button");
			exploreButton.setAttribute("value", "Run tests");
			exploreButton.setAttribute("onclick", "printClient.explorePR(\"runtests\",\"" + repo + "\",\"" + pr + "\")");
			document.getElementsByTagName("header")[0].children[0].appendChild(exploreButton);
			Ajax.loadXMLDoc("/print/" + repo + "/pr/" + pr, "GET", this.loadPRCallback, "json");
			this.intervalHandle = setInterval(() => { Ajax.loadXMLDoc("/print/" + repo + "/pr/" + pr, "GET", this.loadPRCallback, "json", this.lastEtag); }, this.pollInterval);
		}
		loadRepoPRs(value: string) {
			PrintClient.HtmlBuilder.clearElementById("pr-container");
			HtmlBuilder.removeElementById("return-button");
			HtmlBuilder.removeElementById("explore-terminal-button");
			HtmlBuilder.removeElementById("explore-nautilus-button");
			HtmlBuilder.removeElementById("flash-android-button");
			HtmlBuilder.removeElementById("run-tests-button");
			this.pullrequestIdList = [];
			clearInterval(this.intervalHandle);
			if (value != "none") {
				Ajax.loadXMLDoc("/print/" + value, "GET", this.loadPRListCallback, "json");
				this.intervalHandle = setInterval(() => { Ajax.loadXMLDoc("/print/" + value, "GET", this.loadPRListCallback, "json", this.lastEtag); }, this.pollInterval);
			}
		}
		explorePR(application: string, repo: string, pr: string) {
			var callback: any = null;
			if (application == "runtests")
				callback = this.runTestsCallback;
			Ajax.loadXMLDoc("/print/explore/" + application + "/" + repo + "/" + pr, "GET", callback);
		}
		changeRepo(value: string) {
			window.location.assign("/print/print-client/" + value);
		}
		runTestsCallback(event: any) {
			if (event.target.status == 200) {
				PullrequestBuilder.clearExecutionResults();
			}
		}
		loadReposCallback(event: any) {
			if (event.target.status == 200) {
				var repos = <string[]>event.target.response;
				var currentRepo = window.location.pathname.split("/")[3];
				var prId: string;
				if (window.location.pathname.split("/")[4] == "pr")
					prId = window.location.pathname.split("/")[5];
				for (var i = 0; i < repos.length; i++) {
					var option = HtmlBuilder.createElement("option", repos[i], "value", repos[i]);
					if (currentRepo) {
						if (currentRepo == repos[i]) {
							option.setAttribute("selected", "");
							if (prId)
								printClient.loadPR(repos[i], prId);
							else
								printClient.loadRepoPRs(repos[i]);
						}
					}
					else if (i == 0) {
						option.setAttribute("selected", "");
						if (prId)
							printClient.loadPR(repos[i], prId);
						else
							printClient.loadRepoPRs(repos[i]);
					}
					HtmlBuilder.appendElementById("repo-select", option);
				}
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
			else if (event.target.status != 304) {
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
			else if (event.target.status != 304) {
				if (document.getElementsByClassName("error").length <= 0)
					HtmlBuilder.appendElementById("pr-container", HtmlBuilder.createElement("div", event.target.response.error, "class", "error"));
			}
		}
		privilegesCallback(event: any) {
			if (event.target.status == 200) {
				if (event.target.response.admin == "yes") {
                    var repo = window.location.pathname.split("/")[3]
                    var pr = window.location.pathname.split("/")[5]
                    var exploreButton = HtmlBuilder.createElement("input", "", "type", "button");
                    exploreButton.setAttribute("id", "explore-terminal-button");
                    exploreButton.setAttribute("value", "Open in terminal");
                    exploreButton.setAttribute("onclick", "printClient.explorePR(\"terminal\",\"" + repo + "\",\"" + pr + "\")");
                    document.getElementsByTagName("header")[0].children[0].appendChild(exploreButton);
                    exploreButton = HtmlBuilder.createElement("input", "", "type", "button");
                    exploreButton.setAttribute("id", "explore-nautilus-button");
                    exploreButton.setAttribute("value", "Open in nautilus");
                    exploreButton.setAttribute("onclick", "printClient.explorePR(\"nautilus\",\"" + repo + "\",\"" + pr + "\")");
                    document.getElementsByTagName("header")[0].children[0].appendChild(exploreButton);
                    exploreButton = HtmlBuilder.createElement("input", "", "type", "button");
                    exploreButton.setAttribute("id", "flash-android-button");
                    exploreButton.setAttribute("value", "Flash Android");
                    exploreButton.setAttribute("onclick", "printClient.explorePR(\"android\",\"" + repo + "\",\"" + pr + "\")");
                    document.getElementsByTagName("header")[0].children[0].appendChild(exploreButton);
					printClient.admin = true;
                }
			}
		}
		toggleDetails(event: Event, element: HTMLElement) {
			var detailsElement = <HTMLElement>(<HTMLElement>element.parentNode).getElementsByTagName("DETAILS")[0];
			if (detailsElement.style.display == "none")
				detailsElement.style.display = "block";
			else
				detailsElement.style.display = "none";

		}
	}
}
var printClient = new PrintClient.Client();