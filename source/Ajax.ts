module PrintClient {
	export class Ajax {
		static loadXMLDoc(url: string, method: string, callback: any, responseType: string) {
			var xhttp: any;
			xhttp = new XMLHttpRequest();
			xhttp.onload = callback;
			xhttp.open(method, url, true);
			xhttp.responseType = responseType;
			xhttp.send();
		}
	}
}