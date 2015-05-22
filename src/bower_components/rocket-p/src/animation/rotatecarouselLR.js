(function(){

function rotatecarouselLR(currentEle, nextEle, dir, callback) {
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

    var outClass = 'pt-page-rotateCarouselLeftOut pt-page-ontop', 
        inClass = 'pt-page-rotateCarouselLeftIn'
        ;

    if(2 == dir){
        outClass = 'pt-page-rotateCarouselRightOut pt-page-ontop'; 
        inClass = 'pt-page-rotateCarouselRightIn';
    }

    Animation.pageTransition(nextEle, currentEle, inClass, outClass, callback);

};

Animation.register('rotatecarouselLR', rotatecarouselLR);

})();



