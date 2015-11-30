'use strict';
var $title = $('#title'),
    $content = $('#content');

var TITLE_HEIGHT = $title.height();
var FOOTER_HEIGHT = $('#footer').height();

var $contentMouseMove = Rx.Observable.fromEvent($content, 'mousemove');

var bottomArea = $contentMouseMove.filter( function(e) {
    return e.clientY <= 30;
});

var topArea = $contentMouseMove.filter( function(e) {
    return e.clientY >= $('#wrapper').height() - 30;
});

var showOverlayStream = Rx.Observable.merge( topArea, bottomArea );
showOverlayStream.distinct().subscribe( showOverlay );

var $contentMouseEnter = Rx.Observable.fromEvent($content, 'mouseenter')
    .map( function(e) {
        return true;
    });

var $overlayMouseEnter = Rx.Observable.fromEvent( $('.overlay'), 'mouseenter' )
    .map( function(e) {
        return false;
    });

var hideOverlayStream = Rx.Observable.merge( $contentMouseEnter, $overlayMouseEnter )
    .debounce(600);

hideOverlayStream.subscribe( function(hide) {
    if (hide) hideOverlay();
});

var windowResizeStream = Rx.Observable.fromEvent( $(window), 'resize' );
windowResizeStream.subscribe( resizeWrapper );

function getContentHeight() {
    return window.innerHeight - TITLE_HEIGHT - FOOTER_HEIGHT;
}

function showOverlay() {
    $title.stop(true, false).animate({
        marginTop: 0,
    }, 300);

    $content.stop(true, false).animate({
        height: getContentHeight(),
    }, 300);
}

function hideOverlay() {
    $title.stop(true, false).animate({
        marginTop: -TITLE_HEIGHT,
    }, 300);

    $content.stop(true, false).animate({
        height: window.innerHeight,
    }, 300);
}

function resizeWrapper() {
    $('#wrapper').css('height', window.innerHeight);
    $content.css('height', getContentHeight()+'px');
    showOverlay();
}

$(resizeWrapper);

