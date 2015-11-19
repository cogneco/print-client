module PrintClient {
	export class HtmlBuilder {
		static createElement(elementType: string, content: string = "", attribute: string = "", attributeValue = "") {
			var element = document.createElement(elementType);
			element.appendChild(document.createTextNode(content));
			if (attribute)
				element.setAttribute(attribute, attributeValue);
			return element;
		}
		static clearElementById(id: string) {
			document.getElementById(id).innerHTML = "";
		}
		static appendElementById(id: string, element: Element) {
			document.getElementById(id).appendChild(element);
		}
		static createPRBox(pr: PrintApi.PullRequest, listView: boolean) {
			var container = HtmlBuilder.createElement("article", "", "id", pr.id);
			var content: Element;
			if (listView)
				content = HtmlBuilder.buildListViewPRBox(pr);
			else
				content = HtmlBuilder.buildPRBox(pr);
			container.appendChild(content);
			return container;
		}
		static updatePRBox(pr: PrintApi.PullRequest, listView: boolean) {
			var success: boolean = false;
			var pr_container = document.getElementById(pr.id)
			if (pr_container) {
				pr_container.innerHTML = "";
				var content: Element;
				if (listView)
					content = HtmlBuilder.buildListViewPRBox(pr)
				else
					content = HtmlBuilder.buildPRBox(pr)
				pr_container.appendChild(content);
				success = true;
			}
			return success;
		}
		static buildListViewPRBox(pr: PrintApi.PullRequest) {
			var main = HtmlBuilder.createElement("main");
			var title = HtmlBuilder.createElement("a", "", "href", "/print/" + pr.repositoryName + "/pr/" + pr.id);
			title.setAttribute("onclick", "PrintClient.Client.loadPR(event, this)");
			title.appendChild(HtmlBuilder.createElement("h2", pr.title + " #" + String(pr.number)));
			main.appendChild(title);
			main.appendChild(HtmlBuilder.createElement("p", pr.description));
			return main;
		}
		static buildPRBox(pr: PrintApi.PullRequest) {
			var main = HtmlBuilder.createElement("main");
			main.appendChild(HtmlBuilder.createElement("p", pr.description));
			return main;
		}
	}
}