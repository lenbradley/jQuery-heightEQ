/*!
 * jQuery Height Equalizer
 * Author: Len Bradley @ http://www.ninesphere.com
 * Version: 1.3.1
 * Licensed under the MIT license
 *
 * Usage:
 *
 * Add to parent element to target first level child elements
 * For example: $('div#parent').heightEQ();
 *
 * Options:
 *
 * minWindowWidth : This will stop the script from functioning if the current viewport is below specified width ( default : 0 )
 * selector : This is the selector relative to the parent element which heightEQ is defined ( default : '> *' )
 * renderDelay : The amount of time that is delayed until rendering restarts (in milliseconds)
 * allMaxHeight : This option will force all elements to have the maximum height found
 *
 */

( function($) {
    "use strict";

    $.fn.heightEQ = function( settings ) {

        if ( typeof settings === 'undefined' ) {
            var settings = {};
        }

        var defaults = {
            minWindowWidth  : 0,
            selector        : '> *',
            renderDelay     : 200,
            allMaxHeight    : false
        };

        settings = $.extend( {}, defaults, settings );

        return this.each( function() {

            this.enqueuedRender = null;

            this.setupHeightEQ = function() {

                if ( $(this).data('height-eq-setup') ) {
                    this.renderHeightEQ();
                    return false;
                }

                var parent = this;

                $(this).data( 'height-eq-settings', settings );
                $(this).data( 'height-eq-setup', true );

                $(document).ready( function() {
                    parent.enqueueRenderHeightEQ();
                });

                $(window).on( 'load resize', $(this), function() {
                    parent.enqueueRenderHeightEQ();
                });
            }

            this.getSettings = function() {
                return $(this).data('height-eq-settings');
            }

            this.enqueueRenderHeightEQ = function() {

                var parent      = this;
                var settings    = this.getSettings();

                if ( typeof this.enqueuedRender !== null ) {
                    clearTimeout( this.enqueuedRender );
                }

                this.enqueuedRender = setTimeout( function() {
                    parent.renderHeightEQ();
                }, settings.renderDelay );
            }

            this.renderHeightEQ = function() {

                var parent      = this;
                var settings    = this.getSettings();

                this.clearSetHeights();

                if ( ! $(parent).length || $(window).width() < settings.minWindowWidth ) {
                    return false;
                }

                this.clearSetHeights();

                if ( settings.allMaxHeight == true ) {

                    var maxHeight = this.getMaxHeight();

                    $(parent).find( settings.selector ).each( function() {
                        $(this).css( 'height', maxHeight );
                    });

                } else {

                    var rows = this.getRowData();

                    if ( rows.length ) {

                        $.each( rows, function( k, v ) {

                            var maxHeight       = 0;
                            var elementHeight   = 0;

                            // Find the max height to set children elements to
                            $.each( v, function( key, element ) {

                                // Get current elements height
                                if ( $.fn.heightEQ.elementHasBorderBox( element ) ) {
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
                    }
                }
            }

            this.hasBorderBox = function() {

                var settings = this.getSettings();

                if ( $(this).find( settings.selector ).css('box-sizing') == 'border-box' ) {
                    return true;
                } else {
                    return false;
                }
            }

            this.getMaxHeight = function() {

                this.clearSetHeights();

                var parent      = this;
                var settings    = this.getSettings();
                var maxHeight   = 0;

                $(parent).find( settings.selector ).each( function() {

                    var elementHeight = 0;

                    if ( parent.hasBorderBox() ) {
                        elementHeight = Math.ceil( $(this).outerHeight() );
                    } else {
                        elementHeight = Math.ceil( $(this).height() );
                    }

                    if ( elementHeight > maxHeight ) {
                        maxHeight = elementHeight;
                    }
                });

                return maxHeight;
            }

            this.getRowData = function() {

                var parent      = this;
                var settings    = this.getSettings();
                var parentWidth = parent.getBoundingClientRect().width;
                var childWidth  = 0;
                var calcWidth   = 0;
                var currentRow  = 0;
                var elements    = 0;
                var rows        = [];

                // Get elements and store in array to iterate over later
                $(parent).find( settings.selector ).each( function () {

                    // Define variables to use for calculating widths
                    childWidth  = $(this)[0].getBoundingClientRect().width;
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

                return rows;
            }

            this.clearSetHeights = function() {

                var parent      = this;
                var settings    = this.getSettings();

                $(parent).find( settings.selector ).each( function() {
                    $(this).css( 'height', '' );
                });
            }

            this.setupHeightEQ();
        });
    }

    $.fn.heightEQ.elementHasBorderBox = function( element ) {

        if ( typeof element === 'undefined' ) {
            return false;
        }

        if ( ! element instanceof jQuery ) {
            element = $(element);
        }

        if ( element.css('box-sizing') == 'border-box' ) {
            return true;
        } else {
            return false;
        }
    }

}( jQuery ));