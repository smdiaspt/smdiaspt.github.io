
function Rotator () 
{
	var zone = new Array(), container, buttons, playbutton, current = 0, next = 1, transitionTime = 50, playing = true, laststate = true, timer, replayText, skipText;
	
	function setTimer(method, time)
	{
		if (timer != null)
		{
			clearTimeout(timer);
		}
		
		timer = setTimeout(method, time);
	}
	
	function showimage(button)
	{
		if (container.style.display == 'none')
		{
			showRotator();
		}
		
		contentIndex = button.contentIndex;
		playerstate = playing;
		SetButtonClass(next, 'rotatorindexlink');
		SetButtonClass(current, 'rotatorindexlink');
		SetButtonClass(contentIndex, 'rotatorindexcurrentlink');
		
		if (playing)
		{
			playing = false;
			SetPlayButtonClass('rotatorplay');
		}
		
		if (contentIndex == next)
		{
			if (zone[contentIndex].zoneOpacity <= 0)
			{
				zone[contentIndex].zoneOpacity = .05;
			}
			
			setTimer(rotateFade, container.transition);
		}
		else if (contentIndex == current)
		{
			if (zone[next].zoneOpacity > 0)
			{
				current = next;
				next = contentIndex;
				
				if (zone[contentIndex].zoneOpacity <= 0)
				{
					zone[contentIndex].zoneOpacity = .05;
				}
				
				setTimer(rotateFade, container.transition);
			}
		}
		else
		{
			zone[contentIndex].zoneOpacity = zone[next].zoneOpacity > 0 ? zone[next].zoneOpacity : .05;
			
			if (zone[next].zoneOpacity != 0)
			{
				zone[next].zoneOpacity = 0;
				setOpacity(zone[next]);
			}
			
			zone[next].style.display = 'none';
			next = contentIndex;
			setOpacity(zone[next]);
			zone[next].style.display = 'block';
			setTimer(rotateFade, container.transition);
		}
		
	}

	function pauseplay()
	{
		if (container.style.display == 'none')
		{
			laststate = true;
			
			showRotator();
		}
		else
		{
			playing = !playing;
			
			if (playing)
			{
				setTimer(rotateFade, container.timeout);
				SetPlayButtonClass('rotatorpause');
			}
			else
			{
				SetPlayButtonClass('rotatorplay');
			}
		}
	}	

	function setOpacity(item) 
	{
		if(item.zoneOpacity > 1) 
		{
			item.zoneOpacity = 1;
			item.style.filter = "alpha(opacity=100, enabled=false)";
		}
		else
		{
			item.style.opacity = item.zoneOpacity;
			item.style.MozOpacity = item.zoneOpacity;
			item.style.filter = "alpha(opacity=" + (item.zoneOpacity * 100) + ", enabled=true)";
		}
	}	
	
	function rotateFade() 
	{
		if (!playing && zone[next].zoneOpacity == 0)
		{
			return;
		}
		
		zone[current].zoneOpacity -=.05; 
		zone[next].zoneOpacity += .05;
		zone[next].style.display = 'block';
		setOpacity(zone[current]);
		setOpacity(zone[next]);
		
		if(zone[current].zoneOpacity <= 0) 
		{
			zone[current].zoneOpacity = 0;
			zone[current].style.display = 'none';
			zone[current].style.position ='absolute';
			zone[next].style.position = '';
			SetButtonClass(next, 'rotatorindexcurrentlink');
			SetButtonClass(current, 'rotatorindexlink');
			current = next;
			next = zone[current + 1] ? current + 1 : 0;
			
			if (playing)
			{
				setTimer(rotateFade, container.timeout);
			}
		} 
		else 
		{
			setTimer(rotateFade, container.transition);
		}
	}
	
	function SetPlayButtonClass(className)
	{
		if (playbutton)
		{
			playbutton.className = className;
		}
	}
	
	function SetButtonClass(index, className)
	{
		if (buttons)
		{
			buttons[index].className = className;
		}
	}

	function hideRotator()
	{
		laststate = playing;
		playing = !playing;
		
		if (zone[next].zoneOpacity > 0)
		{
			zone[current].zoneOpacity = 0;
			zone[next].zoneOpacity = 1;
			setOpacity(zone[current]);
			setOpacity(zone[next]);
			zone[current].style.display = 'none';
			SetButtonClass(next, 'rotatorindexcurrentlink');
			SetButtonClass(current, 'rotatorindexlink');
			current = next;
			next = zone[current + 1] ? current + 1 : 0;
		}
		else
		{
			zone[current].zoneOpacity = 1;
			zone[next].zoneOpacity = 0;
			setOpacity(zone[current]);
			setOpacity(zone[next]);
		}
		
		SetPlayButtonClass('rotatorplay');
		
		container.style.display = 'none';
	}
	
	function hideVideo()
	{
		if(container.hasflash)
		{
			container.videoouterdiv.style.display = 'none';
			container.videoinnerdiv.innerHTML = '';
			container.link.innerHTML = replayText;
			container.link.onclick = showVideo;
		}
	}
	
	function showVideo()
	{
		if(container.hasflash)
		{
			hideRotator();
			container.videoouterdiv.style.display = '';
			container.link.innerHTML = skipText;
			container.link.onclick = showRotator;
			var so = new SWFObject('player.swf', container.video,'100%','100%','9.0.115.0');
			so.addParam('allowscriptaccess','always');
			so.addParam('allowfullscreen','false');
			so.addParam('wmode', 'transparent');
			so.addParam('flashvars', 'file=' + container.videourl + '&autostart=true&displayclick=none&controlbar=none&rotatorcontainer=' + container.id)
			so.write(container.videoinnerdiv.id);



		}
		
		return false;
	}
	
	function showRotator()
	{
		hideVideo();
		container.style.display = '';
		playing = laststate;
		
		if (playing)
		{
			setTimer(rotateFade, container.timeout);
			SetPlayButtonClass('rotatorpause');
		}
		
		return false;
	}
	
	function hasCookie(name)
	{
		if (document.cookie.length > 0)
		{
			return document.cookie.indexOf(name) > -1;
		}
		
		return false;
	}

	function loadContainer(containerId, tagname, classname, timeout, transition, controllerId, videoId, videoInnerDivId, videoOuterDivId, videoUrl, linkId)
	{
		container = document.getElementById(containerId);
		container.Show = function(){showRotator();};
		
		if (document.getElementById(controllerId))
		{
			container.controller = document.getElementById(controllerId);
			container.controller.style.display = '';
		}
		
		container.tagname = tagname;
		container.classname = classname;
		container.timeout = timeout ? timeout : 3000;
		container.transition = transition ? transition : 50;
		
		if (videoId)
		{
			container.video = document.getElementById(videoId);
			container.videoinnerdiv = document.getElementById(videoInnerDivId);
			container.videoouterdiv = document.getElementById(videoOuterDivId);
			container.videourl = videoUrl;
			container.link = document.getElementById(linkId);
			var so = new SWFObject('player.swf', videoId,'0','0','9.0.115.0');
			so.addParam('allowscriptaccess','always');
			so.addParam('allowfullscreen','false');
			
			container.hasflash = so.write(container.videoinnerdiv.id);
		}
		
		return container;
	}
	
	
	function loadControllerButtons()
	{
		if (container.controller)
		{
			controllerButtons = container.controller.getElementsByTagName('a');
			contentIndex = 0;
			buttons = new Array();
			
			for (index = controllerButtons.length - 1; index > -1; index--)
			{
				if (controllerButtons[index].className == 'rotatorpause')
				{
					playbutton = controllerButtons[index];
					playbutton.onclick = function() { pauseplay(); return false; }; 
				}
				
				if (controllerButtons[index].className == 'rotatorindexcurrentlink' || controllerButtons[index].className == 'rotatorindexlink')
				{
					controllerButtons[index].contentIndex = contentIndex;
					controllerButtons[index].onclick = function(){showimage(this);return false;};
					buttons.push(controllerButtons[index]);
					contentIndex++;
				}
			}
		}
	}

	function loadZones()
	{
		zones = container.getElementsByTagName(container.tagname);
		
		for(index = 0; index < zones.length; index++)
		{	
			if (zones[index].className == container.classname)
			{
				zone.length > 0 ? zones[index].zoneOpacity = 0 : zones[index].zoneOpacity = 1;
				zone.push(zones[index]);
			}
		}
	}
	
	function startRotator(cookiename)
	{
		if (cookiename && !hasCookie(cookiename) && container.hasflash)
		{
			showVideo();
			var date = new Date();
			date.setDate(date.getDate() + 365);
			document.cookie = cookiename + '=true;expires=' + date.toGMTString() + '; path=/';
		}
		else
		{
			showRotator(1);
		}
	}
	

	
	this.Init = function(containerId, tagname, classname, timeout, transition, controllerId, videoId, videoInnerDivId, videoOuterDivId, videoUrl, cookiename, linkId, replay, skip)
	{
	    replayText = replay;
	    skipText = skip;
		container = loadContainer(containerId, tagname, classname, timeout, transition, controllerId, videoId, videoInnerDivId, videoOuterDivId, videoUrl, linkId);
		loadControllerButtons();
		loadZones();
		startRotator(cookiename);
	}
}

function playerReady(thePlayer) 
{
	player = document.getElementById(thePlayer.id);
	
	if (player.getConfig().rotatorcontainer)
	{
	    player.sendEvent("STOP", "true");
	    player.sendEvent("PLAY", "true");
	}
	
	addListeners(player);
}

function stateListener(obj) 
{ 
	if (obj.newstate == "COMPLETED")
	{
		player = document.getElementById(obj.id);
		
		if (player.getConfig().rotatorcontainer)
		{
			document.getElementById(player.getConfig().rotatorcontainer).Show();
		}
	}
}

function addListeners(player) 
{
	player.addModelListener("STATE", "stateListener");
}

try { document.execCommand("BackgroundImageCache", false, true); } catch (e) { }

String.prototype.trim = function() {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
};

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}

function getShareTitle() {
    return ($("h1").length) ? encodeURIComponent(htmlDecode($("h1").html().replace('<[^<>]*>', " ")).replace(" ", "%20")).replace("%2520", "%20") : '';
}

function initshareflyout(flyout) {
    if (flyout.find('.GFO_SHARE_DropOuter').length) {
        flyout.hover(function() {
            flyout.find('.GFO_SHARE_DropOuter').css('display', 'block').end()
                    .find('.GFO_SHARE_TopDefault').css('display', 'none').end().width('222');
        },
                 function() {
                     flyout.find('.GFO_SHARE_DropOuter').css('display', 'none').end()
                    .find('.GFO_SHARE_TopDefault').css('display', 'block').end().width('');
                 });
    }

    flyout.find('a').click(function() {
        var url = $(window).data('share') ? encodeURIComponent($(window).data('share')) : encodeURIComponent(window.location);
        var title = getShareTitle();
        var href = $(this).attr('href').replace('#', '').split('_');
        if (typeof (s) != 'undefined') { s.prop40 = href[0]; s.prop41 = href[1]; TrackPage(); }
        switch (href[0]) {
            case 'facebook': window.open('http://www.facebook.com/sharer.php?u=' + url + '&t=' + title, 'sharer', 'toolbar=0,status=0,width=626,height=436'); break;
            case 'delicious': window.open('http://delicious.com/save?v=5&amp;noui&amp;jump=close&amp;url=' + url + '&amp;title=' + title, 'delicious', 'toolbar=no,width=550,height=550'); break;
            case 'digg': window.open('http://digg.com/submit?url=' + url + '&title=' + title); break;
            case 'twitter': window.open('http://twitter.com/home?status=' + url); break;
            case 'newsvine': window.open('http://www.newsvine.com/_tools/seed?popoff=1&u=' + url); break;
            case 'reddit': window.open('http://www.reddit.com/r/reddit.com/submit?url=' + url); break;
            case 'stumbleupon': window.open('http://www.stumbleupon.com/submit?url=' + url); break;
            case 'email': if (title.length) { document.location.href = 'mailto:?subject=' + title + '&body=' + title + '%0D%0A' + url; } else { document.location.href = 'mailto:?body=' + url; } break;
        }
        return false;
    });
}

function initmenu(verticals, flyouts) {
    var channel = window.location.pathname.split('/')[1].toLowerCase();

    $('.menuverticalborder').hover(
		function() { $(this).removeClass().addClass('menuverticalborderover').find('div').removeClass().addClass('menuhorizontalborderover'); },
		function() { $(this).removeClass().addClass('menuverticalborder').find('div').removeClass().addClass('menuhorizontalborder'); });

    $.each(verticals, function(i, vertical) {
        var menu = $('#vert_' + vertical);
        var tab = $('#' + vertical);
        var ih = Number(menu.attr('ih'));
        var frame = $('#' + vertical + 'menuiframe');
        var ip = (menu.attr('ch') == channel) ? 3 * ih : 0;
        var link = $('#' + vertical + 'link').css('backgroundPosition', '0px -' + ip + 'px');
        menu.find('li:first').mouseover(function() { link.css('backgroundPosition', '0px -' + (ip + ih) + 'px'); })
		.next('li').mouseover(function() { link.css('backgroundPosition', '0px -' + (ip + (ih * 2)) + 'px'); }).end().end()
		.find('a').click(function() { tab.hide(); link.css('backgroundPosition', '0px -' + ip + 'px'); }).end()
		.find('ul').hover(function() { tab.show(); if (!tab.attr('sf')) { tab.attr('sf', 1); if (frame.length) { frame.height(tab.height()).width(tab.width()); } } },
						  function() { tab.hide(); link.css('backgroundPosition', '0px -' + ip + 'px'); });
    });

    $.each(flyouts, function(i, flyout) {
        var menu = $('#flyout_' + flyout);
        var tab = $('#' + flyout + 'tab');
        var table = $('#' + flyout + 'table');
        var content = $('#' + flyout + 'center');
        var frame = $('#' + flyout + 'iframe');
        if (menu.attr('ch') == channel) { menu.find('.flyouttaboff').css('backgroundPosition', '0px -' + menu.attr('ih') + 'px'); }
        menu.hover(function() {
            tab.removeClass().addClass('flyouttabon ie6fix'); table.removeClass().addClass('flyouttable');
            if (!content.attr('sh')) {
                content.attr('sh', 1).find('li.flyoutverticaldash').each(function() { $(this).height(content.height() - 50); });
                if (frame.length) { frame.height(table.height()).width(table.width()); } 
            } 
        },
				   function() { tab.removeClass().addClass('flyouthidden'); table.removeClass().addClass('flyouthidden'); }).find('li a')

		.hover(function() { $(this).children('span').removeClass().addClass(menu.attr('lh')); },
			   function() { $(this).children('span').removeClass().addClass(menu.attr('lo')); }).end()
		.find('a').click(function() { tab.removeClass().addClass('flyouthidden'); table.removeClass().addClass('flyouthidden'); });
    });

    switch (channel) {
        case "about": $('#leftpipe').removeClass().addClass('leftpipe pipeoff'); break;
        case "programs": $('#leftpipe').removeClass().addClass('leftpipe pipeoff'); $('#rightpipe').removeClass().addClass('rightpipe pipeoff'); break;
        case "learning": $('#rightpipe').removeClass().addClass('rightpipe pipeoff'); break;
    }
}

function showloading() {
    if ($('#loading').length) {
        $('#loading').height($('#searcharea').height());
        window.scrollTo(0, 0);
        $('#loadingdiv').css('display', 'block');
    }
}

function initmultidim() {
    var brickstates = $('input:hidden[id*=brickstate]').attr('value').split(',');
    $('.categorycontainer').each(function(index) {
        if (brickstates[index] == 'none') {
            $(this).find('a').removeClass().addClass('categorylink').end()
				.find('.categorytagcontainer').css('display', 'none');
        }
    });

    $('.categorycontainer').find('a').click(function() {
        var link = $(this);
        var div = link.next('div').find('.categorytagcontainer');
        if (div.css('display') == 'none') {
            link.removeClass().addClass('categorylinkoff');
            div.css('display', 'block');
        }
        else {
            link.removeClass().addClass('categorylink');
            div.css('display', 'none');
        }
        var state = [];
        $('.categorytagcontainer').each(
            function() {
                state.push(($(this).css('display') == 'none') ? 'none' : 'block');
            });
        $("input:hidden[id*=brickstate]").attr('value', state.toString());
        return false;
    });
}

var GFOVideo = {
    LoadPlayer: function(detail) {
        var result = true;

        container = $('#' + detail.container).html('');

        var streamer = detail.streamer ? '&streamer=' + streamer : '';

        var embedcode = detail.embed ? '&embed.code=' + escape('<embed src="http://' + document.domain + 'player.swf" width="400" height="225" bgcolor="000000" allowfullscreen="true" allowscriptaccess="always" flashvars="file=' + detail.path + '&image=http://' + document.domain + detail.img + streamer + '"></embed>') + '&embed.show_window_after_complete=true' : '';

        var so = new SWFObject('player.swf', 'video', '100%', '100%', '9.0.115.0');
        so.addParam('allowscriptaccess', 'always');
        so.addParam('allowfullscreen', 'true');
        so.addParam('wmode', 'transparent');
        so.addParam('flashvars', '&file=' + detail.path + streamer + '&h1=' + detail.h1 + '&width=' + detail.width + '&height=' + detail.height + '&plugins=/_layouts/swf/Multimedia/embed-1.swf&autostart=' + detail.autostart + '&image=' + detail.img + embedcode);

        if (!so.write(detail.container)) {
            container.height(detail.imgHeight)
            .css('backgroundImage', "url('/FileReturn.aspx?src=" + detail.img + "&width=" + detail.imgWidth + "&height=" + detail.imgHeight + "&returntype=thumb')")
            .css('backgroundRepeat', 'no-repeat')
            .css('backgroundPosition', 'center center')
            .css('cursor', 'pointer')
            .click(function() { window.open('http://get.adobe.com/flashplayer/'); })
            .append('<div class="videonoflash ie6fix"></div>');
            result = false;
        }

        if (detail.autostart) {
            window.scrollTo(0, 0);
        }

        return result;
    }
}

function ParseKeyValue(token) {
    var result = {};

    $.each(token.replace(/\+/g, ' ').split('&'), function(i, keyvalue) {
        var pair = keyvalue.split('=');

        if (pair.length == 2) {
            result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
    });

    return result;
}

function scaleThis(obj) { }

if (window.scaleMe) { scaleThis = scaleMe; }

function DisplayName(elementid, className, text) {

    $(elementid + ' ' + className).html(text);
}

function ShowRequiredField(elementid, className) {

    $(elementid + ' ' + className).css("color", "red");

}

function HighlightThisLabel(text) {

    $("span.ms-formfieldlabel:contains('" + text + "')").each(function() {

    if ($(this).text() == text) {
            $(this).css('color', 'red');
        }
    })
}

function ClearTitles(elementid, tag) {
    var elements = document.getElementById(elementid).getElementsByTagName(tag);

    for (i = 0; i < elements.length; i++) {
        elements[i].setAttribute('title', '');
    }
}
