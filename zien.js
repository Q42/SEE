//by marcel@q42.nl & johan@q42.nl

var ws = [0,0],mcoo = [0,0];
window.onmousemove = function(e){mcoo = [(e.clientX/ws[0])*2-1,-(e.clientY/ws[1])*2+1]};
function wResize(){ws = [window.innerWidth,window.innerHeight]};
window.addEventListener('resize',wResize);
wResize();
var imgControl;
var fu = chrome.extension?chrome.extension.getURL('anomalies.svg'):'anomalies.svg';
var ctype = 1;
var html = document.getElementsByTagName('html')[0];
var vp = document.createElement('div');
vp.id = 'sight-cover';
var raf = false;

var def = {
	protanomaly: 0,
	deutanomaly: 0,
	tritanomaly: 0,
	cataract: 0,
	achromatopsy: 0,
	cover: null
};


//eye conditions
function setCover(u){
	if(!u) return;
	u = chrome.extension.getURL(u);
	vp.style.backgroundImage = 'url('+u+')';
	vp.style.display = 'block';
	vp.style.width = null;
	vp.style.height = null;
	vp.style.margin = null;
	if(!raf) loop(raf=true);
};

function loop(){
	if(!imgControl.filters.cover) return raf=false;
	vp.style.left = (0.2*mcoo[0]*ws[0])+'px';
	vp.style.top = (-0.2*mcoo[1]*ws[1])+'px';
	if(raf) webkitRequestAnimationFrame(loop);
};

function diabeticRet(imgURL){
	vp.className = 'diabetic-ret';
	setCover(imgURL);
	vp.style.width = 1.5*ws[0]+'px';
	vp.style.height = 1.5*ws[1]+'px';
	vp.style.margin = (-0.25*ws[1])+'px 0 0 '+(-0.25*ws[0])+'px';
};
function retPigmentosa(imgURL){vp.className = 'ret-pigmentosa';setCover(imgURL)};
function glaucoom(imgURL){vp.className = 'glaucoom';setCover(imgURL)};
function maculaDeg(imgURL){vp.className = 'macula-deg';setCover(imgURL)};


// colour blindness & cataract
function ImageControl() {
	var sliders = ['protanomaly','deuteranomaly','tritanomaly','cataract','achromatopsy'];

	function redraw(){
		changeColors(
			sls[0].value,
			sls[1].value,
			sls[2].value,
			sls[3].value,
			sls[4].value
		)
	};

	var _cnt = newEl('div','color-control',null,chrome.extension?null:document.body);
	var sls = [];
	var controller=this;
	for(var i=0;i<sliders.length;i++) {
		var _sl = newEl('input',null,null,_cnt);
		_sl.type = 'range';
		_sl.step = 0.1;
		_sl.min = 0;
		_sl.max = 1;
		_sl.title = sliders[i];
		_sl.value = 0;
		if(sliders[i]=='achromatopsy') _sl.value = 1;
		_sl.onchange = redraw;
		sls.push(_sl)
	}

	var cover = null;

	this.filters = {
		get protanomaly(){return sls[0].value},
		set protanomaly(v){sls[0].value=v;redraw()},
		get deutanomaly(){return sls[1].value},
		set deutanomaly(v){sls[1].value=v;redraw()},
		get tritanomaly(){return sls[2].value},
		set tritanomaly(v){sls[2].value=v;redraw()},
		get cataract(){return sls[3].value},
		set cataract(v){sls[3].value=v;redraw()},
		get achromatopsy(){return sls[4].value},
		set achromatopsy(v){sls[4].value=1-v*1;redraw()},
		get cover(){return cover},
		set cover(u){
			if(/^\"/.test(u))u=u.substr(1,u.length-2);
			u=u=='null'?null:u;
			if(cover==u) return; cover = u;
			if(u==null) vp.style.display='none';
			else if(/macula/.test(u)) maculaDeg(u);
			else if(/pigmentosa/.test(u)) retPigmentosa(u);
			else if(/glaucoom/.test(u)) glaucoom(u);
			else if(/diabetic/.test(u)) diabeticRet(u);
			window[(u!=null?'add':'del')+'Class'](document.body,'re-cursor');
		}
	}
};

function changeColors(prot,deut,trit,cataract,sat) {
	var f = [];

	if(cataract!=0) f.push('blur('+cataract*10+'px) sepia('+cataract*100+'%)');
	if(sat!=1) f.push('saturate('+sat*100+'%)');
	
	//var videos = document.getElementsByTagName('video');
	//for(var i=0;i<videos.length;i++) videos[i].style.webkitFilter = f.length?f.join(' '):null;

	if(prot>0) f.push('url(#prot'+prot*100+')');
	if(deut>0) f.push('url(#deut'+deut*100+')');
	if(trit>0) f.push('url(#trit'+trit*100+')');
	
	var flt = f.length;
	html.style.webkitFilter = flt?f.join(' '):null;
	var allEls = document.getElementsByTagName('div');
	for(var i=0;i<allEls.length;i++) {
		var trans = getComputedStyle(allEls[i],null).getPropertyValue('-webkit-transform');
		if(trans && (flt && trans != 'none'))
			allEls[i].style.webkitTransform = flt?'none':null;
	}
};


//init
if(chrome.extension) {
	imgControl = new ImageControl();
	setTimeout(function(){
		chrome.extension.sendMessage({},function(d){
			for(var x in d) imgControl.filters[x]=d[x];
		})
	});
}
else addEventListener('DOMContentLoaded',function(){imgControl = new ImageControl()});

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(e){
	if(xhr.readyState==4){
		if(xhr.status!=200) return console.error('Your browser does not support cross-domain XHR!');
		var el = document.createElement('div');
		el.style.display = 'none';
		el.innerHTML = xhr.responseText;
		document.body.appendChild(el);
		document.body.appendChild(vp);
	}
};
xhr.open('GET',fu,true);
xhr.send(null);

function com(o){for(var x in o) chrome.extension.sendMessage({action:x,value:o[x]})};
document.onkeyup = function (e) {if (e.keyCode == 27)com(def)};

//to prevent jQuery
function addClass(_,n) {if(hasClass(_,n))return;_.className+=' '+n.toLowerCase()};
function delClass(_,n) {n=n.toLowerCase();if(!hasClass(_,n))return;var c=_.className.split(' ');for(var i=0;i<c.length;i++)if(c[i].toLowerCase()==n){c.splice(i,1);break;}_.className = c.join(' ')};
function hasClass(_,n) {n=n.toLowerCase();var c=_.className.split(' ');for(var i=0;i<c.length;i++)if(c[i].toLowerCase()==n)return true;return false};
function getEl(id){return document.getElementById(id)};
function newEl(name,cl,txt,par){var el = document.createElement(name);if(cl)el.className=cl;if(txt&&txt.length)el.textContent=txt;if(par instanceof Element)par.appendChild(el);return el};
function db(i,c,s){if((s=i)&&typeof i=='object'&&!(s=''))for(var x in i) try{s+=x+': '+(i[x] instanceof Function?'function(){..}':i[x])+'\n'}catch(e){};console.log(s)};
