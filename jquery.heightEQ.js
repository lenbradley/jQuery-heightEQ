/*!
 * jQuery Height Equalizer
 * Author: Len Bradley @ http://www.ninesphere.com
 * Licensed under the MIT license
 *
 * Usage:
 * Add to parent element to target first level child elements
 * For example: $('div#parent').heightEQ();
 *
 * Options:
 * minWindowWidth : This will stop the script from functioning if the current viewport is below specified width ( default : 0 )
 * selector : This is the selector relative to the parent element which heightEQ is defined ( default : '> *' )
 * 
 */

( function($) {
    "use strict";

    $.fn.heightEQ = function( options ) {

        var defaults = { 
            minWindowWidth  : 0,
            selector        : '> *'
        };

        return this.each( function() {

            // Store parent container in variable
            var parent = $(this);

            if ( typeof parent.data( 'heighteq-options' ) === 'undefined' ) {
                var options = $.extend( {}, defaults, options );
            } else {
                var options = parent.data( 'heighteq-options' );
            }
            
            // Stop script execution if needed
            if ( ! parent.length || $(window).width() < options.minWindowWidth ) {
                $(parent).find( options.selector ).css( 'height', '' );
                return false;
            }
            // Check to see if event listener is attached, if not than attach
            if ( typeof parent.data( 'heighteq-attached' ) === 'undefined' ) {

                parent.data( 'heighteq-attached', true );
                parent.data( 'heighteq-options', options );

                // Attach load and resize event handler to element
                $(window).on( 'load resize', parent, function() {
                    parent.heightEQ();
                });
            }
            // Define variables to use
            var parentWidth = parent.innerWidth();
            var childWidth  = 0;
            var calcWidth   = 0;
            var currentRow  = 0;
            var elements    = 0;
            var rows        = [];
            var border_box  = false;

            if ( parent.find( options.selector ).first().css('box-sizing') == 'border-box' ) {
                border_box = true;
            }
            
            // Get elements and store in array to iterate over later
            parent.find( options.selector ).each( function () {

                // Define variables to use for calculating widths
                childWidth  = $(this).outerWidth();
                calcWidth   = calcWidth + childWidth;

                // Check if row width breaks - if so create new row
                if ( calcWidth > parentWidth ) {
                    calcWidth = childWidth;
                    currentRow++;
                }

                // if row array doesn't exist, create it
                if ( typeof rows[currentRow] === 'undefined' ) {
                    rows[currentRow] = [];
                }
                rows[currentRow][elements] = $(this);
                elements++;
            });

            // Loop through child elements
            $.each( rows, function( k, v ) {
                var maxHeight       = 0;
                var elementHeight   = 0;

                // Find the max height to set children elements to
                $.each( v, function( key, element ) {

                    // Reset height before checking elements
                    $(element).css( 'height', '' );
                    
                    // Get current elements height
                    if ( border_box ) {
                        elementHeight = Math.ceil( $(element).outerHeight() );
                    } else {
                        elementHeight = Math.ceil( $(element).height() );
                    }
                    
                    
                    // Check if current elements height is greater that previous element heights
                    if ( elementHeight > maxHeight ) {
                        maxHeight = elementHeight;
                    }
                });

                // Set children to max height
                $.each( v, function( key, element ) {
                    $(element).css( 'height', maxHeight );
                });        
            });
        });
    }
}( jQuery ));