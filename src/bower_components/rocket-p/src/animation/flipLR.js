(function(){

function flipLR(currentEle, nextEle, dir, callback) {
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

    var outClass = 'pt-page-flipOutLeft', 
        inClass = 'pt-page-flipInRight pt-page-delay500'
        ;

    if(2 == dir){
        outClass = 'pt-page-flipOutRight'; 
        inClass = 'pt-page-flipInLeft pt-page-delay500';
    }

    Animation.pageTransition(nextEle, currentEle, inClass, outClass, callback);

};

Animation.register('flipLR', flipLR);

})();
