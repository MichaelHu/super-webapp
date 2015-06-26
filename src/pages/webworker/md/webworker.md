[Web Application Working Group]: http://www.w3.org/TR/tr-groups-all#tr_Web_Applications_Working_Group
[Web Workers]: http://www.w3.org/TR/workers/
[多页面共享Worker服务]: https://whatwg.org/demos/workers/multiviewer/page.html


## 1 webworker


[Web Application Working Group]的[Web Workers]


### 1.1 专用Worker API 


调用者：

    var worker = new Worker('worker.js');
    worker.onmessage = function (event) {...};
    worker.addEventListener('message', function (event) {...}, false);
    worker.postMessage(
        {
            operation: 'find-edges'
            , input: buffer // an ArrayBuffer object
            , threshold: 0.6
        }
        , [buffer]
    );
    worker.terminate();


Worker内部：

    onmessage = function (event) {...};
    addEventListener('message', function (event) {...}, false);
    postMessage(...);

    importScripts(DOMString... urls);

    navigator
    location




### 1.2 共享Worker API 


同一个域名下面的多个不同页面，可以使用同一个共享Worker提供的服务。
例子：[多页面共享Worker服务]


调用者：
    
    var worker = new SharedWorker('service.js');
    worker.port.onmessage = function (event) {...};
    worker.port.addEventListener('message', function (event) {...}, false);
    worker.port.postMessage({ foo: 'structured', bar: ['data', 'also', 'possible']});



Worker内部：

    onconnect = function (event) {
        var newPort = event.ports[0];
        // set up a listener
        newPort.onmessage = function (event) { ... };
        // send a message back to the port
        newPort.postMessage('ready!'); // can also send structured data, of course
    };



## 2 源代码 



### 2.1 worker.js

CPU密集型计算，用于计算当前最大的素数。同时过程可控，计算过程可以启动和暂停。

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

        // Have a break when 10000 numbers have been scaned.
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

