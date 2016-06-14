(function($) {

    $.fn.fadeIt = function(options) {

        // This is the easiest way to have default options.
        var settings = $.extend({
                speed: 1,
                mode: "random"
            }, options),
            speed = settings.speed * 1000

        switch (settings.mode) {
            case "random":
                body = this.children().hide();
                $.each(body, function(obj, index) {
                    $(this).fadeIn(Math.random() * speed);
                });
                break;
            case "transit":
                body = this.children().children();
                $.each(body, function(obj, index) {
                    $(this).css({
                            "width": "0%",
                            "transformOrigin": "50% 50%",

                        }

                    ).animate({
                        "width": "100%"

                    }, Math.random() * speed);;
                });
                break;
            case "rotate":
                body = this.children().children();
                $.each(body, function(obj, index) {
                    $(this).css({"transform": "rotate(0deg)"

                    }).css({
                        "transformOrigin": "50% 50%",
                        "transform": "rotate(360deg)",
                        "transition": "transform " + String(Math.random()* settings.speed) +"s"
                    }, Math.random() * speed);
                });
                break;
        }
        return this;
    };

}(jQuery));

$(document).ready(function() {

    $("#chooseTransition").change(function() {
        $("body").fadeIt({
            speed: 2,
            mode: String($(this).val())
        });
    });
});