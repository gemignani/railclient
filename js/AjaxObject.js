/**
 * @constructor
 */
function ajaxObject(url, callbackFunction) {
  var that=this;
  this.updating = false;
  this.timeoutID = null;
  this.timeOutErrorHandler = null;
  this.lastRequest = "";
  this.retryCnt = 0;
  
  this.abort = function() {
    if (that.updating) {
      that.updating=false;
		that.AJAX.onreadystatechange = null;
      that.AJAX.abort();
      that.AJAX=null;
		clearTimeout(that.timeoutID);
    }
  }
  
  this.reSend = function(){
	  that.updating = new Date;
	  
    if(window.XMLHttpRequest) {
      that.AJAX = new XMLHttpRequest
    }else {
      that.AJAX = new ActiveXObject("Microsoft.XMLHTTP")
    }
    if(that.AJAX == null) {
      return false
    }else {
        var uri = urlCall+"?resend-no-cache="+(new Date).getTime();
		  that.AJAX.onreadystatechange = onStateChange;
		  
        that.AJAX.open("POST", uri, true);
        that.AJAX.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        that.AJAX.withCredentials = "true";
        that.AJAX.send(that.lastRequest);
		  
			that.timeoutID = setTimeout(function() {that.timeOutErrorHandler()}, 2000);		  
	 }
  }  
  
	function onStateChange(){
		if(that.AJAX.readyState == 4) {
			clearTimeout(that.timeoutID);
			that.updating = false;

			if(that.AJAX.status == 200){
				that.lastRequest = "";
				that.callback(that.AJAX.responseText, that.AJAX.status, that.AJAX.responseXML);
				that.AJAX = null;
			} else {
				if(that.retryCnt++ < 3){
					setTimeout(function(){that.reSend();}, 3000);
				} else {
					that.callback(that.AJAX.responseText, that.AJAX.status, that.AJAX.responseXML);
				}
				that.AJAX = null;
			}
		}	  
	}  
  
  this.update = function(passData,postMethod) {
    if (that.updating) { return false; }
    that.AJAX = null;
    if (window.XMLHttpRequest) {
      that.AJAX=new XMLHttpRequest();
    } else {
      that.AJAX=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (that.AJAX==null) {
      return false;
    } else {
      that.AJAX.onreadystatechange = onStateChange;
		
      that.updating = new Date();
      if (/post/i.test(postMethod)) {
        var uri=urlCall+"?no-cache="+(new Date).getTime();
        that.AJAX.open("POST", uri, true);
        that.AJAX.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        //that.AJAX.setRequestHeader("Content-Length", passData.length);
		  that.AJAX.withCredentials = "true";
		  
		  that.lastRequest = passData;
		  that.retryCnt = 0;		  
		  
        that.AJAX.send(passData);
      } else {
        var uri=urlCall+'?'+passData+'&timestamp='+(that.updating.getTime());
        that.AJAX.open("GET", uri, true);
        that.AJAX.send(null);
      }

		that.timeoutID = setTimeout(function(){that.timeOutErrorHandler()},45000);
      return true;
    }
  }
  var urlCall = url;
  this.callback = callbackFunction || function () { };
}