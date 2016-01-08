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
		static removeElementById(id: string) {
			var element = document.getElementById(id);
			if (element)
				element.parentNode.removeChild(element);
		}
	}
}