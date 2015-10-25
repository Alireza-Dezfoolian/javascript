/* 25 2015 - small rotate plugin Author: Alireza Dezfoolian for Deloitte Digital test */

(function($) { // this is not necessary as i use only jQuery
        $.fn.rotate = function($limitRotation1, $limitRotation2) {
            //vars
            var $degree = 0,
                $timer;
            // set default opacity to 0.5, need filter opacity for older IE
            this.css("opacity", "0.5");

            //calling this as jQuery dosn't support CSS Tranform, need to be called Intervally
            function cssRotate($self, $degree) {
                $self.css({
                    // rotating, supporting all browsers
                    "webkitTransform": "rotate(" + $degree + "deg)",
                    "MozTransform": "rotate(" + $degree + "deg)",
                    "msTransform": "rotate(" + $degree + "deg)",
                    "OTransform": "rotate(" + $degree + "deg)",
                    "transform": "rotate(" + $degree + "deg)"
                });
            }

            //clear the timer and make degree equal to 0
            function clearTimer() {
                $degree = 0;
                clearInterval($timer);
            }

            // making rotation with setInterval
            function rotateIt($self, $opacity, $rotationDirection, $limit) {
                clearTimer();
                $self.animate({
                    "opacity": $opacity
                }, .5);
                $timer = setInterval((function() {
                    $degree -= $rotationDirection;
                    cssRotate($self, $degree);
                    if ($degree == $limit) {
                        clearTimer();
                    }
                }), 1);
            }

            // mouse hover
            this.on("mouseenter", (function() {
                rotateIt($(this), "1.0", -1, $limitRotation1);
            }));

            // mouse leave - add click * in case just click happens
            this.on("click mouseleave", (function() {
                rotateIt($(this), "0.5", 1, $limitRotation2);
            }));
        };
        return this;
    }
    (jQuery)) //pass jQuery;

$(function() {
    //rotating effect - using class .js-rotate
    $('.js-rotate').rotate(90, -90); // degree limit, first on hover / second on mouseleave

    /* this set the tabindex with jQuery for accessibility, 
    might be a little bit expensive for larger size websites, but for one page website is OK */
    $accessible = $('[data-type="accessible"]');

    $.each($accessible, function(index, obj) {
        $(this).attr("tabindex", String(index + 1));
    });

});