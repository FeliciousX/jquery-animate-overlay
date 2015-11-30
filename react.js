'use strict';
var $wrapper = $('#wrapper'),
    $title = $('#title'),
    $content = $('#content'),
    $footer = $('#footer'),
    $overlay = $('.overlay');

var TITLE_HEIGHT = $title.height();
var FOOTER_HEIGHT = $footer.height();
var hide_overlay_delay = null;

var $contentMouseMove = Rx.Observable.fromEvent($content, 'mousemove');

var bottomArea = $contentMouseMove.filter( function(e) {
    return e.clientY <= 30;
});

var topArea = $contentMouseMove.filter( function(e) {
    return e.clientY >= $wrapper.height() - 30;
});

var showOverlayStream = Rx.Observable.merge( topArea, bottomArea );

showOverlayStream.subscribe( showOverlay );

var $contentMouseEnter = Rx.Observable.fromEvent($content, 'mouseenter');
$contentMouseEnter.subscribe( hideOverlay );

function getContentHeight() {
    return window.innerHeight - TITLE_HEIGHT - FOOTER_HEIGHT;
}

function showOverlay() {
    console.log('show overlay');
    $title.stop(true, false).animate({
        marginTop: 0,
    }, 300);

    $content.stop(true, false).animate({
        height: getContentHeight(),
    }, 300);
}

function hideOverlay() {
    console.log('hide overlay');
    $title.stop(true, false).animate({
        marginTop: -TITLE_HEIGHT,
    }, 300);

    $content.stop(true, false).animate({
        height: window.innerHeight,
    }, 300);
}

$(function() {
    $wrapper.css('height', window.innerHeight);
    $content.css('height', getContentHeight()+'px');
});
