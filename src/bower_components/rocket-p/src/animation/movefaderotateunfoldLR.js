(function(){

function movefaderotateunfoldLR(currentEle, nextEle, dir, callback) {
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

    var outClass = 'pt-page-moveToLeftFade', 
        inClass = 'pt-page-rotateUnfoldRight'
        ;

    if(2 == dir){
        outClass = 'pt-page-moveToRightFade'; 
        inClass = 'pt-page-rotateUnfoldLeft';
    }

    Animation.pageTransition(nextEle, currentEle, inClass, outClass, callback);

};

Animation.register('movefaderotateunfoldLR', movefaderotateunfoldLR);

})();


