define(function () {

    function loadImages(images, oncomplete, onprogress){
        if(!images || !images.length) {
            oncomplete && oncomplete();
            return;
        } 
        var len = images.length, 
            i = 0,
            finished = 0,
            img;
        
        onprogress = onprogress || function(){};
        onprogress(30);

        while(i < len){
            img = new Image();
            img.src = images[i++];
            img.onload = img.onabort 
                = img.onerror 
                = function(){
                    finished++; 
                    onprogress(Math.ceil(70 * finished / len + 30));
                    if(finished >= len){
                        setTimeout(function(){
                            oncomplete && oncomplete();
                        }, 100);
                    }
                };
        } 
    }

    return loadImages;

});
