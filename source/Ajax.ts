module PrintClient {
	export class Ajax {
		static loadXMLDoc(url: string, method: string, callback: any = null, responseType: string = "", etag: string = "") {
			var xhttp: any;
			xhttp = new XMLHttpRequest();
			if (callback) { xhttp.onload = callback; }
			xhttp.open(method, url, true);
			if (responseType) { xhttp.responseType = responseType; }
			if (etag) { xhttp.setRequestHeader("etag", etag); }
			xhttp.send();
		}
	}
}