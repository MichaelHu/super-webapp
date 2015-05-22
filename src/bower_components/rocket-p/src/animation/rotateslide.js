(function(){

function rotateslide(currentEle, nextEle, dir, callback) {
    var $currentEle = currentEle && $(currentEle),
        $nextEle = nextEle && $(nextEle);

    if(0 == dir){
        if(currentEle != nextEle){
            currentEle && $currentEle.hide();
            setTimeout(function(){
                nextEle && $nextEle.show();
            }, 0);
        }

        callback && callback();
        return;
    }

    var outClass = 'pt-page-rotateSlideOut',
        inClass = 'pt-page-rotateSlideIn'
        ;

    Animation.pageTransition(nextEle, currentEle, inClass, outClass, callback);

};

Animation.register('rotateslide', rotateslide);

})();

