/// <reference path="HtmlBuilder" />
/// <reference path="printapi/Pullrequest" />
/// <reference path="../markdown.d.ts" />

module PrintClient {
	export class PullrequestBuilder {
		static createPRBox(pr: PrintApi.Pullrequest, listView: boolean) {
			var container = HtmlBuilder.createElement("article", "", "id", pr.id);
			var content: Element;
			if (listView)
				content = PullrequestBuilder.buildListViewPRBox(pr);
			else
				content = PullrequestBuilder.buildPRBox(pr);
			container.appendChild(content);
			return container;
		}
		static updatePRBox(pr: PrintApi.Pullrequest, listView: boolean) {
			var success: boolean = false;
			var pr_container = document.getElementById(pr.id);
			if (pr_container) {
				if (listView) {
					pr_container.innerHTML = "";
					var content: Element;
					content = PullrequestBuilder.buildListViewPRBox(pr);
					pr_container.appendChild(content);
				}
				else
					PullrequestBuilder.updateSinglePRBox(pr);
				success = true;
			}
			return success;
		}
		static buildListViewPRBox(pr: PrintApi.Pullrequest) {
			var main = HtmlBuilder.createElement("main");
			var title = HtmlBuilder.createElement("h2", pr.title + " #" + String(pr.number), "onclick", "printClient.toggleDetails(event, this)");
            title.setAttribute("class", "toggle-switch");
            main.appendChild(title);
            var detailsButton = HtmlBuilder.createElement("a", "", "href", "/print/print-client/" + pr.repositoryName + "/pr/" + pr.id);
            detailsButton.setAttribute("class", "octicon octicon-chevron-right");
            main.appendChild(detailsButton);
			if (pr.executionResults.length > 0)
				main.appendChild(PullrequestBuilder.createStatusIconForList(pr.executionResults, pr.allJobsComplete));
			if (pr.labels.length > 0) {
				var labels = HtmlBuilder.createElement("p", "", "style", "display:inline-block;");
				pr.labels.forEach((label) => {
					var labelSpan = HtmlBuilder.createElement("span", label.name, "class", "label");
					labelSpan.setAttribute("style", "background-color:#" + label.color);
					labels.appendChild(labelSpan);
				});
				main.appendChild(labels);
			}
            main.appendChild(HtmlBuilder.createElement("p", "Latest update: " + PullrequestBuilder.getDateTimeString(new Date(pr.updatedAt)) + " " + pr.user.username + ":" + pr.head.ref));
            var description = HtmlBuilder.createElement("details", "", "style", "display:none;");
            description.innerHTML = marked(pr.description);
			main.appendChild(description);
			return main;
		}
		static buildPRBox(pr: PrintApi.Pullrequest) {
			var main = HtmlBuilder.createElement("main");
			main.appendChild(HtmlBuilder.createElement("h2", pr.title + " #" + String(pr.number)));
			if (pr.labels.length > 0) {
				var labels = HtmlBuilder.createElement("p", "", "style", "display:inline-block;");
				pr.labels.forEach((label) => {
					var labelSpan = HtmlBuilder.createElement("span", label.name, "class", "label");
					labelSpan.setAttribute("style", "background-color:#" + label.color);
					labels.appendChild(labelSpan);
				});
				main.appendChild(labels);
			}
            main.appendChild(HtmlBuilder.createElement("p", "Latest update: " + PullrequestBuilder.getDateTimeString(new Date(pr.updatedAt)) + " " + pr.user.username + ":" + pr.head.ref));
            main.innerHTML = main.innerHTML + marked(pr.description);
			main.appendChild(HtmlBuilder.createElement("p", "Execution status:"));
			pr.executionResults.forEach((result) => {
				var resultContainer = PullrequestBuilder.createExecutionResultPart(pr, result);
				main.appendChild(resultContainer);
			});
			return main;
		}
		static updateSinglePRBox(pr: PrintApi.Pullrequest) {
			var main = document.getElementById(pr.id).firstElementChild;
			var currentlyDisplayResults = main.getElementsByTagName("DIV");
			for (var i = currentlyDisplayResults.length-1; i >= 0; i--) {
				var remove = true;
				for (var j = 0; j < pr.executionResults.length; j++) {
					if (currentlyDisplayResults[i].id == pr.executionResults[j].task + pr.id) {
						remove = false;
						j = pr.executionResults.length;
					}
				}
				if (remove)
					currentlyDisplayResults[i].parentNode.removeChild(currentlyDisplayResults[i]);
			}
			pr.executionResults.forEach((result) => {
                var resultContainer = PullrequestBuilder.createExecutionResultPart(pr, result);
				var executionResult = document.getElementById(result.task + pr.id);
				if (!executionResult)
					main.appendChild(resultContainer);
				else if ((<HTMLElement>executionResult.getElementsByTagName("DETAILS")[0]).innerHTML != (<HTMLElement>resultContainer.getElementsByTagName("DETAILS")[0]).innerHTML)
					executionResult.innerHTML = resultContainer.innerHTML;
			});
		}
        static createExecutionResultPart(pr: PrintApi.Pullrequest, result: PrintApi.ExecutionResult) {
            var resultContainer = HtmlBuilder.createElement("div", "", "id", result.task + pr.id);
            var taskHeader = HtmlBuilder.createElement("header", "", "onclick", "printClient.toggleDetails(event, this)");
            taskHeader.setAttribute("class", "toggle-switch");
            taskHeader.appendChild(HtmlBuilder.createElement("p", result.task, "style", "display:inline-block;margin-right:10px;"));
            taskHeader.appendChild(PullrequestBuilder.createStatusIcon(result.result));
            resultContainer.appendChild(taskHeader);
            resultContainer.appendChild(HtmlBuilder.createElement("details", result.output.replace(/\033\[[0-9;]*m/g, ""), "style", "display:none;"));
            return resultContainer;
        }
		static createStatusIconForList(executionResults: PrintApi.ExecutionResult[], allJobsComplete: string) {
			var icon = "octicon-server";
			if (allJobsComplete == "true") {
				for (var i = 0; i < executionResults.length; i++) {
					icon = "octicon-check";
					if (executionResults[i].result != "0") {
						icon = "octicon-x";
						i = executionResults.length;
					}
				}
			}
			return HtmlBuilder.createElement("span", "", "class", "octicon " + icon);
		}
		static createStatusIcon(result: string) {
			var icon = "octicon-check";
			if (result == "999")
				icon = "octicon-server";
			else if (result != "0")
				icon = "octicon-x";
			return HtmlBuilder.createElement("span", "", "class", "octicon " + icon);
		}
		static clearExecutionResults() {
			var main = document.getElementById("pr-container").firstElementChild.firstElementChild;
			var executionResults = main.getElementsByTagName("DIV");
			for (var i = executionResults.length-1; i >= 0; i--) {
				executionResults[i].parentNode.removeChild(executionResults[i]);
			}
		}
        static getDateTimeString(date: Date) {
            var year = date.getFullYear().toString();
            var month = ("0" + (date.getMonth()+1).toString()).slice(-2);
            var dayOfMonth = ("0" + date.getDate().toString()).slice(-2);
            var hours = ("0" + date.getHours().toString()).slice(-2);
            var minutes = ("0" + date.getMinutes().toString()).slice(-2);
            var seconds = ("0" + date.getSeconds().toString()).slice(-2);
            return year + "-" + month + "-" + dayOfMonth + " " + hours + ":" + minutes + ":" + seconds;
        }
	}
}