define(function (require) {

var Rocket = require('rocket-p');

var css3demosPageView = Rocket.PageView.extend({
    init: function (options) {
        this.$el.html('<h1>Hello, I\'m css3demos page</h1>');          
    }
});

Rocket.Router.registerViewClass(
    'css3demos'
    , css3demosPageView 
);

return css3demosPageView;

    
});

