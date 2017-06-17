jQuery Height Equalizer
Author: Len Bradley @ http://www.ninesphere.com
Version: 1.3.1
Licensed under the MIT license

Usage:

Add to parent element to target first level child elements
For example: $('div#parent').heightEQ();

Options:

minWindowWidth : This will stop the script from functioning if the current viewport is below specified width ( default : 0 )
selector : This is the selector relative to the parent element which heightEQ is defined ( default : '> *' )
renderDelay : The amount of time that is delayed until rendering restarts (in milliseconds)
allMaxHeight : This option will force all elements to have the maximum height found