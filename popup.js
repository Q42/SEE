// The Accordion Effect
$('.accordion-header a').click(function() {
	var $p = $(this).parent();
	if($p.is('.inactive-header'))
		$('.active-header').toggleClass('active-header inactive-header')
			.next().slideToggle(300).toggleClass('open-content');

	$('[tabindex="0"]').attr('tabindex','');
	$p.toggleClass('active-header inactive-header')
		.next().slideToggle(300).toggleClass('open-content')
		.find('input').focus().attr('tabindex','0');

	return false;
});

$('input[data-role=set-cover]').change(function(){com('cover',this.value*1?'images/'+this.id+'-'+this.value+'.png':null)});
$('input[data-role=set-color]').change(function(){com(this.id.replace('slider-',''),this.value)});
document.onkeyup = function(e){if(e.keyCode==8||e.keyCode==46)com('cover',null)};

com();

function com(a,v){chrome.extension.sendMessage({action:a,value:v},parseFilters)};
function parseFilters(d){
	for(var x in d) {
		var $e = null;
		if(x=='cover') {
			if(/^\"/.test(d[x]))d[x]=d[x].substr(1,d[x].length-2);
			$e=(d.cover?$('#'+d.cover.replace(/^.*\/(.*)-\d\.png$/,'$1')):$('input[data-role=set-cover]'))
				.val(d.cover?d.cover.replace(/^.*-(\d)\.png$/,'$1'):0);
		}
		else $e=$('#slider-'+x).val(d[x]);
		if($e&&d[x]) {
			var $ct = $e.closest('.accordion-content');
			if(!$ct.hasClass('open-content')) $ct.prev().children('a').click();
		}
	}
};
