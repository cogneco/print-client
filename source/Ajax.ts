module PrintClient {
	export class Ajax {
		static loadXMLDoc(url: string, method: string, callback: any = null, responseType: string = "", etag: string = "") {
			var xhttp: XMLHttpRequest;
			xhttp = new XMLHttpRequest();
			if (callback) { xhttp.onload = callback; }
			xhttp.open(method, url, true);
			if (responseType) { xhttp.responseType = responseType; }
			if (etag) {
				xhttp.setRequestHeader("etag", etag);
				xhttp.setRequestHeader("If-None-Match", etag);
			}
			xhttp.send();
		}
	}
}