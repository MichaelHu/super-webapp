(function(){

function slideeasingTB(currentEle, nextEle, dir, callback) {
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

    var outClass = 'pt-page-moveToTopEasing pt-page-ontop', 
        inClass = 'pt-page-moveFromBottom'
        ;

    if(2 == dir){
        outClass = 'pt-page-moveToBottomEasing pt-page-ontop'; 
        inClass = 'pt-page-moveFromTop';
    }

    Animation.pageTransition(nextEle, currentEle, inClass, outClass, callback);

};

Animation.register('slideeasingTB', slideeasingTB);

})();

