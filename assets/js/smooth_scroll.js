/**
 * Created by kwabenaboadu on 8/10/15.
 */
jQuery(document).ready(function($) {
    $(document).on('click', '.services', function() {
        $("body").animate({
            scrollTop: $("#services-content").offset().top
        }, 2000);
    });
    $(document).on('click', '.contact', function() {
        $("body").animate({
            scrollTop: $("#contact-content").offset().top
        }, 2000);
    });
    $(document).on('click', '.about', function() {
        $("body").animate({
            scrollTop: $("#about-content").offset().top
        }, 2000);
    });
});