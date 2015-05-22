(function(){

function rotateroomLR(currentEle, nextEle, dir, callback) {
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

    var outClass = 'pt-page-rotateRoomLeftOut pt-page-ontop', 
        inClass = 'pt-page-rotateRoomLeftIn'
        ;

    if(2 == dir){
        outClass = 'pt-page-rotateRoomRightOut pt-page-ontop'; 
        inClass = 'pt-page-rotateRoomRightIn';
    }

    Animation.pageTransition(nextEle, currentEle, inClass, outClass, callback);

};

Animation.register('rotateroomLR', rotateroomLR);

})();


