(function(){

function rotateslideLR(currentEle, nextEle, dir, callback) {
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

    var outClass = 'pt-page-rotateRightSideFirst', 
        inClass = 'pt-page-moveFromRight pt-page-delay200 pt-page-ontop'
        ;

    if(2 == dir){
        outClass = 'pt-page-rotateLeftSideFirst'; 
        inClass = 'pt-page-moveFromLeft pt-page-delay200 pt-page-ontop';
    }

    Animation.pageTransition(nextEle, currentEle, inClass, outClass, callback);

};

Animation.register('rotateslideLR', rotateslideLR);

})();

