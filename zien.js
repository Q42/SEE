//by marcel@q42.nl & johan@q42.nl

svg = document.createElement('div');svg.style.display = 'none';
vp = document.createElement('div');vp.id = 'sight-cover';
ws = [0,0],mcoo = [0,0],raf = false;

current = {
	protanomaly: 0,
	deutanomaly: 0,
	tritanomaly: 0,
	cataract: 0,
	achromatopsy: 0,
	cover: null,
	covers: {}
};

filters = {
	get protanomaly(){return current.protanomaly},
	set protanomaly(v){current.protanomaly=v;changeColors()},
	get deutanomaly(){return current.deutanomaly},
	set deutanomaly(v){current.deutanomaly=v;changeColors()},
	get tritanomaly(){return current.triteranomaly},
	set tritanomaly(v){current.triteranomaly=v;changeColors()},
	get cataract(){return current.cataract},
	set cataract(v){current.cataract=v;changeColors()},
	get achromatopsy(){return current.achromatopsy},
	set achromatopsy(v){current.achromatopsy=1-v*1;changeColors()},
	get cover(){return current.cover},
	set cover(u){
		if(/^\"/.test(u))u=u.substr(1,u.length-2);
		u=u=='null'?null:u;
		if(current.cover==u) return; current.cover = u;
		window[(u!=null?'add':'del')+'Class'](document.body,'re-cursor');
		current.covers = {
			macula: /macula/.test(u),
			pigmentosa: /pigmentosa/.test(u),
			glaucoma: /glaucoom/.test(u),
			diabetic_ret: /diabetic/.test(u)
		};
		if(u==null) { if(vp.parentNode) document.body.removeChild(vp); return }
		for(x in current.covers) if(current.covers[x]) vp.className = x;
		var diab = current.covers.diabetic_ret;
		if(!vp.parentNode) document.body.appendChild(vp);
		vp.style.backgroundImage = 'url('+chrome.extension.getURL(u)+')';
		vp.style.width = diab?1.5*innerWidth+'px':null;
		vp.style.height = diab?1.5*innerHeight+'px':null;
		vp.style.margin = diab?(-0.25*innerHeight)+'px 0 0 '+(-0.25*innerWidth)+'px':null;
		if(!raf) loop(raf=true);
	}
};

function changeColors() {
	var c = [], f = filters;

	if(f.cataract!=0) c.push('blur('+f.cataract*10+'px) sepia('+f.cataract*100+'%)');
	if(f.achromatopsy!=1) c.push('saturate('+f.achromatopsy*100+'%)');
	if(f.protanomaly>0) c.push('url(#prot'+f.protanomaly*100+')');
	if(f.deutanomaly>0) c.push('url(#deut'+f.deutanomaly*100+')');
	if(f.tritanomaly>0) c.push('url(#trit'+f.tritanomaly*100+')');

	if(f.protanomaly>0||f.deutanomaly>0||f.tritanomaly>0) {
	  if(!svg.parentNode) document.body.appendChild(svg);
	}
	else if(svg.parentNode) document.body.removeChild(svg);
	
	document.getElementsByTagName('html')[0].style.webkitFilter = c.length?c.join(' '):null;
	var allEls = document.getElementsByTagName('div');
	for(var i=0;i<allEls.length;i++) {
		var trans = getComputedStyle(allEls[i],null).getPropertyValue('-webkit-transform');
		if(trans && (c.length && trans != 'none'))
			allEls[i].style.webkitTransform = c.length?'none':null;
	}
};

function loop(){
	if(!filters.cover) return raf=false;
	vp.style.left = (0.2*mcoo[0]*innerWidth)+'px';
	vp.style.top = (-0.2*mcoo[1]*innerHeight)+'px';
	if(raf) webkitRequestAnimationFrame(loop);
};

function com(o){for(var x in o) chrome.extension.sendMessage({action:x,value:o[x]})};
function addClass(_,n) {if(hasClass(_,n))return;_.className+=' '+n.toLowerCase()};
function delClass(_,n) {n=n.toLowerCase();if(!hasClass(_,n))return;var c=_.className.split(' ');for(var i=0;i<c.length;i++)if(c[i].toLowerCase()==n){c.splice(i,1);break;}_.className = c.join(' ')};
function hasClass(_,n) {n=n.toLowerCase();var c=_.className.split(' ');for(var i=0;i<c.length;i++)if(c[i].toLowerCase()==n)return true;return false};

onkeyup = function (e){if (e.keyCode == 27)com(current)};
onmousemove = function (e){mcoo = [(e.clientX/innerWidth)*2-1,-(e.clientY/innerHeight)*2+1]};

xhr = new XMLHttpRequest();
xhr.onload=function(){svg.innerHTML = xhr.responseText};
xhr.open('GET',chrome.extension.getURL('anomalies.svg'),true);
xhr.send(null);

setTimeout(function(){chrome.extension.sendMessage({},function(d){
	for(var x in d) filters[x]=d[x];
})});
