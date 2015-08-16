
'use strict';
// get $DOM elements
var $dom = {
    wrapper: $('#wrapper'),
    title: $('#title'),
    content: $('#content'),
    footer: $('#footer'),
    overlay: $('.overlay'),
}

$(window).resize(function() {
    console.log('resized ', window.innerHeight);
    $dom.wrapper.css('height', window.innerHeight);

    OVERLAY_SHOWING = true;
    toggleOverlay(true);

    $dom.content.css('height', getContentHeight()+'px');
});


// initial title and footer height (fixed height from CSS)
var TITLE_HEIGHT = $dom.title.height();
var FOOTER_HEIGHT = $dom.footer.height();

// intial value of overlay, showing.
var OVERLAY_SHOWING = true;

// stores the timeout for hiding overlay. Use clearTimeout() to continue showing overlay
var hide_overlay_delay = null;

/**
 * Gets dynamic content height depending on the title height and footer height
 *
 * @return {int} height in pixels
 */
function getContentHeight() {
    return window.innerHeight - TITLE_HEIGHT - FOOTER_HEIGHT;
}

/**
 * Show / Hide overlay based on param.  * Input true to show, false to hide.
 * Here, there's a juggle between EventListeners. You can see it's being set on and off
 * depending on showing or hiding. This is to prevent freezes and premature event triggering.
 *
 * @param {boolean}
 */
function toggleOverlay(show) {

    if (show) {
        var height = getContentHeight();
        // set animation of title
        $dom.title.stop(true, false).animate({
            marginTop: 0,
        }, 300);
        // set animation of content
        $dom.content.stop(true, false).animate({
            height: height,
        }, 300, keepOverlayInView);

        OVERLAY_SHOWING = true;

        // turn off the mousemove event for showing overlay
        $dom.wrapper.off('mousemove');

        // turn on the mouse enter for hiding overlay
        $dom.content.mouseenter(function(e) {
            // user have a 0.8 seconds delay before hiding overlay unless they clear it!
            hide_overlay_delay = window.setTimeout(toggleOverlay.bind(null, false), 600);
        });
    }
    else {
        // set animation of title
        $dom.title.stop(true, false).animate({
            marginTop: -TITLE_HEIGHT,
        }, 300);
        // set animation of content
        $dom.content.stop(true, false).animate({
            height: window.innerHeight,
        }, 300);

        OVERLAY_SHOWING = false;

        // turn off the mouseenter event for hiding overlay
        $dom.content.off('mouseenter');
        // turn off the mousemove event for continue showing overlay
        $dom.overlay.off('mousemove');

        // turn on mosemove event for showing overlay
        $dom.wrapper.mousemove(function(e) {
            // check upper 30px and lower 30px
            if (e.clientY <= 30 || e.clientY >= $dom.wrapper.height() - 30) {
                toggleOverlay(true);
            }
        });
    }
}

/**
 * This is a callback after the show overlay animation has completed.
 * This listener keeps the overlay showing when mouse is on the overlay
 */
function keepOverlayInView() {
    $dom.overlay.mousemove(function(e) {
        window.clearTimeout(hide_overlay_delay);
    });
}


$(function() {
    $(window).trigger('resize');
    window.setTimeout(toggleOverlay.bind(null, false), 1500);
});
