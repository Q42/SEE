//zien app communication script
var filters = {
	protanomaly: 0,
	deutanomaly: 0,
	tritanomaly: 0,
	cataract: 0,
	achromatopsy: 0,
	cover: null
};

chrome.extension.onMessage.addListener(function(r,s,sR) {
	if(r.action) for(var x in filters) setValue(x,x==r.action?r.value:x=='cover'?null:0);
	if(sR) sR(filters);
});

function setValue(type,value) {
	if(filters[type]==value) return;
	filters[type]=(type!='cover'?value*1:value!=null?'"'+value+'"':null);
	chrome.windows.getAll({"populate" : true}, function(windows) {
		for(var i = 0; i < windows.length; i++) {
			for(var j = 0; j < windows[i].tabs.length; j++) {
				var tab = windows[i].tabs[j];
				if(/^https?\:\/\//.test(tab.url))
					chrome.tabs.executeScript(tab.id, {code:"imgControl.filters."+type+" = "+filters[type]});
			}
		}
	});
};
