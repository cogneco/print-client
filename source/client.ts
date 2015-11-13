/// <reference path="pullrequest/PRList" />

module PrintClient {
	function createElement(elementType: string, content: string) {
		var element = document.createElement(elementType);
		element.appendChild(document.createTextNode(content));
		return element;
	}
	// function appendElementById(id: string, elementType: string, content: string) {
	// 	document.getElementById(id).appendChild(createElement(elementType, content));
	// }
	function appendElementById(id: string, element: HTMLElement) {
		document.getElementById(id).appendChild(element);
	}
	function createPRBox(pr: Pullrequest.Pullrequest) {
		var container = createElement("article", "");
		container.setAttribute("id", pr.repo+pr.user+pr.branch);
		var list = buildPRBox(pr);
		container.appendChild(list);
		return container;
	}
	function updatePRBox(pr: Pullrequest.Pullrequest) {
		var success: boolean = false;
		var pr_container = document.getElementById(pr.repo+pr.user+pr.branch)
		if (pr_container) {
			pr_container.innerHTML = "";
			pr_container.appendChild(buildPRBox(pr));
			success = true;
		}
		return success;
	}
	function buildPRBox(pr: Pullrequest.Pullrequest) {
		var main = createElement("main", "");
		// list.appendChild(createElement("li", pr.repo));
		main.appendChild(createElement("h2", pr.branch));
		var part = createElement("div", "");
		part.appendChild(createElement("h5", "User: "));
		part.appendChild(createElement("p", pr.user));
		main.appendChild(part);
		part = createElement("div", "");
		part.appendChild(createElement("h5", "Build pc: "));
		part.appendChild(createElement("p", pr.status_build_pc));
		main.appendChild(part);
		part = createElement("div", "");
		part.appendChild(createElement("h5", "Build andriod: "));
		part.appendChild(createElement("p", pr.status_build_android));
		main.appendChild(part);
		part = createElement("div", "");
		part.appendChild(createElement("h5", "Magic: "));
		part.appendChild(createElement("p", pr.status_magic));
		main.appendChild(part);
		part = createElement("div", "");
		part.appendChild(createElement("h5", "Run: "));
		part.appendChild(createElement("p", pr.status_run));
		main.appendChild(part);
		part = createElement("div", "");
		part.appendChild(createElement("h5", "Memtest: "));
		part.appendChild(createElement("p", pr.status_memtest));
		main.appendChild(part);
		return main;
	}
	function loadXMLDoc(url: string) {
		var xhttp: any;
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4) {
				if (xhttp.status == 200) {
					var pr_list: Pullrequest.PRList = JSON.parse(xhttp.responseText);
					pr_list.pullrequests.forEach(function(pr) {
						if (!updatePRBox(pr)) {
							appendElementById(pr.repo, createPRBox(pr));
						}
					});
				}
				else
					alert("Error response returned with status " + xhttp.status);
			}
		};
		xhttp.open("GET", url, true);
		xhttp.send();
	}

	loadXMLDoc("/client/json")
	setInterval(function() { loadXMLDoc("/client/json") }, 5000);
}
