'use strict';
var $wrapper = $('#wrapper');
var $title = $('#title');
var $content = $('#content');
var $footer = $('#footer');

$wrapper.css('height', window.innerHeight);

var TITLE_HEIGHT = $title.height();
var FOOTER_HEIGHT = $footer.height();
var height =  getContentHeight();
var hide_overlay_delay = null;

function getContentHeight() {
    return window.innerHeight - TITLE_HEIGHT - FOOTER_HEIGHT;
}

$content.css('height', height+'px');

function toggleOverlay(show) {
    if (show) {
        var height = getContentHeight();
        $content.stop(true, false).animate({
            height: height,
        }, 500, keepOverlayInView);
        $title.stop(true, false).slideDown(500);

        $wrapper.off('mousemove');
        $content.mouseenter(function(e) {
            // u have 3 seconds to clear this
            hide_overlay_delay = window.setTimeout(toggleOverlay.bind(null, false), 3000);
        });
    }
    else {
        $content.stop(true, false).animate({
            height: window.innerHeight,
        }, 500);
        $title.stop(true, false).slideUp(500);

        $content.off('mouseenter');
        $('.overlay').off('mousemove');
        $wrapper.mousemove(function(e) {
            // check upper 30px and lower 30px
            if (e.clientY <= 30 || e.clientY >= $wrapper.height() - 30) {
                toggleOverlay(true);
            }
        });
    }
}

function keepOverlayInView() {
    $('.overlay').mousemove(function(e) {
        console.log('here');
        window.clearTimeout(hide_overlay_delay);
    });
}

$(function() {

    window.setTimeout(toggleOverlay.bind(null, false), 1500);
});
