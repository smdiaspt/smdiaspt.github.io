jQuery.noConflict();
(function($){
    $(document).ready(function() {
        $('#highlights .mod_teaser ').each(function(index) {
            var ixo = index * 263;
            $(this).css('left',  ixo);
        });

        $('#highlights .mod_teaserfade').each(function(index) {
            var ixo = index * 263;
            $(this).css('left',  ixo);
        });
 

        $('#highlights .mod_teaser').mouseenter(function() {
            var white = $(this);
 
            $('#'+ $(this).attr('rel')).fadeIn();
            $('#'+ $(this).attr('rel')).mouseleave(function() {
                white.fadeIn();
                $('#'+ white.attr('rel')).fadeOut();
            });
        });

        if( $('.image_container')!= null){
            $('.image_container').fadeIn('slow', function() {
                // Animation complete
                });

            $('.hyperlink_img').mouseenter(function() {
                $(this).animate({
                    opacity: 1
                }, 50, function() {
                    // Animation complete.
                    });

            }).mouseleave(function() {
                $(this).animate({
                    opacity: 0.8
                }, 50, function() {
                    // Animation complete.
                    });
            });
        }

        $('#facebooklink').mouseenter(function() {
            $(this).animate({
                opacity:0.8
            }, 250, function() {
                // Animation complete.
                }).mouseleave(function() {
                $(this).animate({
                    opacity: 0.5
                }, 250, function() {
                    // Animation complete.
                    });
            });
        });

        $('#facebooklink_context').mouseenter(function() {
            $(this).animate({
                opacity:0.8
            }, 250, function() {
                // Animation complete.
                }).mouseleave(function() {
                $(this).animate({
                    opacity: 0.5
                }, 250, function() {
                    // Animation complete.
                    });
            });
        });

        $('#NewsletterInput').click(function() {
            if($(this).val() == 'yourmail@sample.com'){
                $(this).val("");
            }
        }).blur(function(){
            if($(this).val() == ''){
                $(this).val("yourmail@sample.com");
            }
        })
    
        $('#newsxletter').click(function() {
            if($(this).val() == 'yourmail@sample.com'){
                $(this).val("");
            }
        }).blur(function(){
            if($(this).val() == ''){
                $(this).val("yourmail@sample.com");
            }
        })


    });
})(jQuery);