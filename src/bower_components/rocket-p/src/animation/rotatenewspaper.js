(function(){

function rotatenewspaper(currentEle, nextEle, dir, callback) {
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

    var outClass = 'pt-page-rotateOutNewspaper', 
        inClass = 'pt-page-rotateInNewspaper pt-page-delay500'
        ;

    Animation.pageTransition(nextEle, currentEle, inClass, outClass, callback);

};

Animation.register('rotatenewspaper', rotatenewspaper);

})();

