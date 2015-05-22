(function(){

function rotateroomTB(currentEle, nextEle, dir, callback) {
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

    var outClass = 'pt-page-rotateRoomTopOut pt-page-ontop', 
        inClass = 'pt-page-rotateRoomTopIn'
        ;

    if(2 == dir){
        outClass = 'pt-page-rotateRoomBottomOut pt-page-ontop'; 
        inClass = 'pt-page-rotateRoomBottomIn';
    }

    Animation.pageTransition(nextEle, currentEle, inClass, outClass, callback);

};

Animation.register('rotateroomTB', rotateroomTB);

})();


