(function(root, factory){


if(typeof define === 'function' && define.amd){
    define(['zepto', 'underscore', 'exports'], function($, _, exports){
        factory(root, exports, $, _); 
    });
}
else{
    root.Rocket = factory(root, {}, root.Zepto || root.jQuery, _);
}


})(this, function(root, Rocket, $, _) {
