'use strict';
var $wrapper = $('#wrapper'),
$title = $('#title'),
$content = $('#content'),
$footer = $('#footer'),
$overlay = $('.overlay');

$(window).resize(function() {
    console.log('resized ', window.innerHeight);
    $wrapper.css('height', window.innerHeight);

    OVERLAY_SHOWING = true;
    toggleOverlay(true);

    $content.css('height', getContentHeight()+'px');
});


var TITLE_HEIGHT = $title.height();
var FOOTER_HEIGHT = $footer.height();

var OVERLAY_SHOWING = true;

var hide_overlay_delay = null;

function getContentHeight() {
    return window.innerHeight - TITLE_HEIGHT - FOOTER_HEIGHT;
}

function toggleOverlay(show) {

    if (show) {
        var height = getContentHeight();
        $title.stop(true, false).animate({
            marginTop: 0,
        }, 300);
        $content.stop(true, false).animate({
            height: height,
        }, 300, keepOverlayInView);

        OVERLAY_SHOWING = true;

        $wrapper.off('mousemove');

        $content.mouseenter(function(e) {
            hide_overlay_delay = window.setTimeout(toggleOverlay.bind(null, false), 600);
        });
    }
    else {
        $title.stop(true, false).animate({
            marginTop: -TITLE_HEIGHT,
        }, 300);
        $content.stop(true, false).animate({
            height: window.innerHeight,
        }, 300);

        OVERLAY_SHOWING = false;

        $content.off('mouseenter');
        $overlay.off('mousemove');

        $wrapper.mousemove(function(e) {
            if (e.clientY <= 30 || e.clientY >= $wrapper.height() - 30) {
                toggleOverlay(true);
            }
        });
    }
}

function keepOverlayInView() {
    $overlay.mousemove(function(e) {
        window.clearTimeout(hide_overlay_delay);
    });
}

$(function() {
    $(window).trigger('resize');
    window.setTimeout(toggleOverlay.bind(null, false), 1500);
});
