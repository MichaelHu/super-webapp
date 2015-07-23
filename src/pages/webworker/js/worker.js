var n = 1;
var running = true;
var currentMax = 10000;

function search (max) {

    currentMax = max;

    search: while ( running && n < max ) {
        n ++;
        for (var i=2; i<Math.sqrt(n); i++) {
            if(n % i == 0){
                continue search;
            }
        }
        postMessage(n);
    }

    setTimeout(function(){search(max + 10000);}, 100);
}

search(currentMax);

onmessage = function (event) {
    console.log('n: ' + n);
    if ('pause' == event.data) {
        running = false;
    }
    else if ('start' == event.data) {
        running = true;
        search(currentMax);
    }
};

