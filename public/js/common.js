// ScrollStart/ScrollStop events: http://james.padolsey.com/javascript/special-scroll-events-for-jquery/

$(document).ready(function() {

	var stickyOffset = $('#header').outerHeight() + $('.jumbotron').outerHeight();

	$('body').scrollspy({
	    target: '.bs-docs-sidebar',
	    offset: 40
	});
	$("#sidebar").affix({
	    offset: {
	      top: stickyOffset
	    }
	});

	$(window).on('load scrollstop', function(){

		$('.address').html(getAddress());
	});

	$(window).on('scroll', function(){

		if($('body').scrollTop() > stickyOffset){

			$('.address').removeClass('hidden');
			$('.address').addClass('affix');
		}
		else{
			
			$('.address').addClass('hidden');
			$('.address').removeClass('affix');
		}
	});


	$('.expand-all').click(function(){

		$('.all-bhashya').toggleClass('collapse');
	});
	// Insertion of headings
	
	insertChapterName();
	insertSectionName();
	insertAdhikaranaName();

	printNavigation();

	insertBhashyaTrigger();
	wrapAndFoldBhashya();

	insertTargetBlank();
	reformLinks();

	bindJumpToID();


	$('.full-page-mask').hide();
	
	$('#sidebar a').on('click', function(event){

		var jumpLoc = $($(this).attr('href')).offset().top - $('.address').height();

        $("html, body").animate({scrollTop: jumpLoc}, 500);
	});

	$( "a, button" ).click(function(){
        $( "#ajaxLoader" ).remove();
        $(this).append("<i id=\"ajaxLoader\" class=\"fa fa-spinner fa-spin\"></i>");
        $( "#ajaxLoader" ).hide();
    });

    $( document )
    .ajaxStart(function() {
        setTimeout( function(){$( "#ajaxLoader" ).fadeIn( 50 );}, 1);
    })
    .ajaxStop(function() {
        setTimeout( function(){$( "#ajaxLoader" ).fadeOut( 250 );}, 1);
    })
    ;
});

(function(){var e=jQuery.event.special,t="D"+ +(new Date),n="D"+(+(new Date)+1);e.scrollstart={setup:function(){var n,r=function(t){var r=this,i=arguments;if(n){clearTimeout(n)}else{t.type="scrollstart";jQuery.event.handle.apply(r,i)}n=setTimeout(function(){n=null},e.scrollstop.latency)};jQuery(this).bind("scroll",r).data(t,r)},teardown:function(){jQuery(this).unbind("scroll",jQuery(this).data(t))}};e.scrollstop={latency:300,setup:function(){var t,r=function(n){var r=this,i=arguments;if(t){clearTimeout(t)}t=setTimeout(function(){t=null;n.type="scrollstop";jQuery.event.dispatch.apply(r,i)},e.scrollstop.latency)};jQuery(this).bind("scroll",r).data(n,r)},teardown:function(){jQuery(this).unbind("scroll",jQuery(this).data(n))}}})();

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function getAddress(){

	var verse = $('div.verse:in-viewport').first();

	var address = '<span>' + $('.maintext').attr('data-bhashya') + '</span>';
	
	var chapter = verse.parents('.chapter').attr('data-name');
	if(!(chapter)) chapter = verse.parents('.chapter').attr('data-title');
	
	var section = verse.parents('.section').attr('data-name');
	if(!(section)) section = verse.parents('.section').attr('data-title');
	
	var subsection = verse.attr('data-adhikarana');
	var sutra = verse.children('.versetext').children('span').html();
	if(!(sutra)) sutra = verse.children('.versetext').html();
	sutraNumber = getSutraNumber(sutra);

	address += (chapter != null) ? '<span>' + chapter + '</span>' : '';
	address += (section != null) ? '<span>' + section + '</span>' : '';
	address += (subsection != null) ? '<span>' + subsection + '</span>' : '';
	address += (sutraNumber != null) ? '<span>' + sutraNumber + '</span>' : '';

	address = '<i class="fa fa-map-marker map-marker"></i>' + address;

	return address;
}

function getAddressByID(id){

	var verse = $( '#' + id);

	var address = '<span>' + $('.maintext').attr('data-bhashya') + '</span>';
	
	var chapter = verse.parent().parent('.chapter').attr('data-name');
	if(!(chapter)) chapter = verse.parent().parent('.chapter').attr('data-title');

	var section = verse.parent('.section').attr('data-name');
	if(!(section)) section = verse.parent('.section').attr('data-title');
	
	var subsection = verse.attr('data-adhikarana');
	var sutra = getSutraNumber(verse.children('.versetext').children('span').html());
	
	address += (chapter != null) ? '<span>' + chapter + '</span>' : '';
	address += (section != null) ? '<span>' + section + '</span>' : '';
	address += (subsection != null) ? '<span>' + subsection + '</span>' : '';
	address += (sutra != null) ? '<span>' + sutra + '</span>' : '';

	address = '<i class="fa fa-map-marker map-marker"></i>' + address;

	return address;
}

function insertChapterName(){

	$('.chapter').each(function(){
		
		var chapterName = $(this).attr('data-name');
		if(!(chapterName)) chapterName = $(this).attr('data-title');
		chapterName = '<h1>' + chapterName + '</h1>';

		$(this).prepend(chapterName);
	});
}

function insertSectionName(){

	$('.section').each(function(){
		
		var sectionName = $(this).attr('data-name');
		if(!(sectionName)) sectionName = $(this).attr('data-title');
		sectionName = '<h2>' + sectionName + '</h2>';

		$(this).prepend(sectionName);
	});
}

function insertAdhikaranaName(){

	var adhikaranaIDList = [];
	$('.verse').each(function(){

		adhikaranaIDList.push($(this).attr('data-adhikaranaID'));
	});

	var uniqueAdhikaranaIDList=adhikaranaIDList.filter(function(itm,i,a){
	    return i==a.indexOf(itm);
	});

	for(i = 0; i < uniqueAdhikaranaIDList.length; i++){

		var adhikaranaID = uniqueAdhikaranaIDList[i];
		
		var verse = $('.verse[data-adhikaranaID="' + adhikaranaID + '"]');
		var adhikaranaName = verse.attr('data-adhikarana');
		
		verse.wrapAll('<div class="subsection" id="' + adhikaranaID + '" data-title="' + adhikaranaName + '">');
		
		$('#' + adhikaranaID).prepend('<h3>' + adhikaranaName + '</h3>');
	}
}

function insertBhashyaTrigger(){

	$('.verse .versetext').each(function(){

		// Include bhashya trigger only when bhashya paragraphs are available and type is not gadya
		
		if(($(this).siblings('.bhashya').length) && ($(this).attr('type') != 'gadya')) {

			var verseID = $(this).parent('.verse').attr('id');
			var verseContents = '<span>' + $(this).html() + '</span>'+ '<div class="show-bhashya"><a data-toggle="collapse" href="#bhashya-' + verseID + '"><i class="fa fa-long-arrow-down"></i> भाष्यम्</a></div>';
			$(this).html(verseContents);
		}
	});
}

function wrapAndFoldBhashya(){

	$('.verse').each(function(){

		var verseID = $(this).attr('id');

		$('[id^=' + verseID + '_B].bhashya').wrapAll('<div id="bhashya-' + verseID + '" class="all-bhashya collapse">');
	});
}

function printNavigation(){

	var nav = '';

	$('.chapter').each(function(){

		var chapter = $(this);
		nav += '<li>';
		nav += '<a href="#' + chapter.attr('id') + '">' + chapter.children('h1').html() + '</a>';
        
        if(chapter.children('.section').length) {                
			
			nav += '<ul class="nav nav-stacked">';
			chapter.children('.section').each(function(){

				var section = $(this);
				nav += '<li>';
				nav += '<a href="#' + section.attr('id') + '">' + section.children('h2').html() + '</a>';
				
		        if(section.children('.subsection').length) {                
					
					nav += '<ul class="nav nav-stacked">';
					section.children('.subsection').each(function(){

						var subsection = $(this);
						nav += '<li>';
						nav += '<a href="#' + subsection.attr('id') + '">' + subsection.attr('data-title') + '</a>';
						nav += '</li>';
					});
					nav += '</ul>';
				}

				nav += '</li>';
			});
			nav += '</ul>';
		}
		nav += '</li>\n';
	});

	$('#sidebar').prepend(nav);
}

function insertTargetBlank() {

	$('.qt a').attr('target', '_blank');
}

function reformLinks() {

	$('.qt a').each(function(){

		var href = $(this).attr('href');
		var anchorText = $(this).text();

		anchorText = anchorText.replace('‘', '');
		anchorText = anchorText.replace('’', '');
		anchorText = anchorText.replace(/ \(.*\)/, '');

		href = href + '&hl=' + anchorText;
		$(this).attr('href', href);
	});
}

function bindJumpToID() {

	var hloc = window.location.href;
    if(hloc.match('id=')){

    	var jumpID = getUrlParameter('id');
    	var re = new RegExp('_B[0-9]+$');
		jumpID = jumpID.replace(re, '');

	    if(hloc.match('hl=')){

    		var hlText = decodeURIComponent(getUrlParameter('hl'));
    		var jumpLoc = $('#' + jumpID).offset().top - 40;
        	$("html, body").animate({scrollTop: jumpLoc}, 1000, insertHlText(jumpID, hlText));
    	}
    	else if(hloc.match('hlBhashya=')){

	    	var bhashyaID = getUrlParameter('id');

    		var hlText = decodeURIComponent(getUrlParameter('hlBhashya'));
    		insertHlTextBhashya(jumpID, bhashyaID, hlText);

    		var jumpLoc = $('#' + bhashyaID).offset().top - 100;
        	$("html, body").animate({scrollTop: jumpLoc}, 1000);
    	}
    }
}

function insertHlText(id, text) {

	$('#' + id + ' .versetext').before('<div class="hl-text"><i class="fa fa-hand-o-right"></i> ' + text + '</div>');
	$('#bhashya-' + id).removeClass('collapse');

	// Highlight text

	var verse = $('#' + id + ' .versetext span').html();
	if(verse == null) verse = $('#' + id + ' .versetext').html();

	var re = new RegExp('(' + text + '.*?) ', "g");
	verse = verse.replace(re, '<span class="highlight">' + "$1" + '</span> ');

	$('#' + id + ' .versetext span').html(verse);
}

function insertHlTextBhashya(id, bhashyaID, text) {


	$('#' + bhashyaID).before('<div class="hl-text"><i class="fa fa-search"></i> ' + text + '</div>');
	$('#bhashya-' + id).removeClass('collapse');

	// Highlight text

	var bhashya = $('#' + bhashyaID).html();

	var re = new RegExp('(' + text + '.*?)([ <])', "g");
	bhashya = bhashya.replace(re, '<span class="highlight">' + "$1" + '</span>' + "$2");

	$('#' + bhashyaID).html(bhashya);
}

function getSutraNumber(verse) {

	if(verse) {

		var verseNumber = verse.replace(/.*॥ ([०१२३४५६७८९]+) ॥.*/, "$1");

		return (verseNumber == verse) ? '' : $('.maintext').attr('data-verseType') + ' ' + verseNumber;
	}
	return null;
}
