(function(){

function movefaderotateunfoldTB(currentEle, nextEle, dir, callback) {
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

    var outClass = 'pt-page-moveToTopFade', 
        inClass = 'pt-page-rotateUnfoldBottom'
        ;

    if(2 == dir){
        outClass = 'pt-page-moveToBottomFade'; 
        inClass = 'pt-page-rotateUnfoldTop';
    }

    Animation.pageTransition(nextEle, currentEle, inClass, outClass, callback);

};

Animation.register('movefaderotateunfoldTB', movefaderotateunfoldTB);

})();


