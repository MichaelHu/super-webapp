(function(){

function rotatecarouselTB(currentEle, nextEle, dir, callback) {
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

    var outClass = 'pt-page-rotateCarouselTopOut pt-page-ontop', 
        inClass = 'pt-page-rotateCarouselTopIn'
        ;

    if(2 == dir){
        outClass = 'pt-page-rotateCarouselBottomOut pt-page-ontop'; 
        inClass = 'pt-page-rotateCarouselBottomIn';
    }

    Animation.pageTransition(nextEle, currentEle, inClass, outClass, callback);

};

Animation.register('rotatecarouselTB', rotatecarouselTB);

})();


