var Animation = (function(){

var animations = {};
var isAnimating = false;
var lastAnimationCleanUP = null;

function register(name, func){
    if(!Utils.isString(name) || name.length == 0){
        throw Error('registerAnimation: name must be non-empty string');
    }

    if(!Utils.isFunction(func)){
        throw Error('registerAnimation: func must be function');
    }

    animations[name] = func;
}

function get(name){
    return animations[name];
}

function pageTransition(inPage, outPage, inClass, outClass, callback){

    var outPageEnd,
        inPageEnd,
        animationComplete,
        $inPage = $(inPage),
        $outPage = $(outPage)
        ;

    // If a new animation start, the current active (if exists) animation
    // should be stopped
    while(isAnimating){
        lastAnimationCleanUp
            && lastAnimationCleanUp();
    }
    isAnimating = true;
    lastAnimationCleanUp = afterAnimation;

    outPageEnd = inPageEnd = false;
    animationComplete = false;

    $outPage
        .data('original-classes', $outPage.attr('class'))
        .addClass(outClass)
        .on('webkitAnimationEnd', function(e){
            outPageEnd = true;
            if(inPageEnd){
                afterAnimation();
            }   
        }); 

    $inPage
        .data('original-classes', $inPage.attr('class'))
        .addClass(inClass)
        .on('webkitAnimationEnd', function(e){
            inPageEnd = true;
            if(outPageEnd){
                afterAnimation();
            }   
        })
        // Do not use jQuery method `show` which leads to low performance
        [0].style.display = 'block'
        ;



    // afterAnimation may not be called in case of fast swipe
    setTimeout(function(){
        if(!animationComplete){
            afterAnimation();
        }
    }, 2000);


    function beforeAnimation(){
    }


    function afterAnimation(){
        animationComplete = true;

        $outPage.hide()
            .attr('class', $outPage.data('original-classes') || null)
            .off('webkitAnimationEnd');

        $inPage
            .attr('class', $inPage.data('original-classes') || null)
            .off('webkitAnimationEnd');

        isAnimating = false;

        callback && callback();
    }

}

return {
    register: register
    , get: get
    , pageTransition: pageTransition
};


})();
