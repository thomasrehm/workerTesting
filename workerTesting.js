var worker = null,
    startTime = 0,
    supported = false,
    enable_transferable = document.getElementById('enable-transferable'),
    size;

function log(str) {
    var elem = document.getElementById('result');
    var log = function (s) {
        // var data = ''.concat(time(), ' ', s, '\n');
        elem.innerHTML = ''.concat(time(), ' ', s, '\n') + elem.innerHTML;
    };
    log(str);
}

function init() {
    size = document.getElementById('size').value;
    worker = new Worker('transferable.js');
    worker.onmessage = function (e) {
        console.timeEnd('actual postMessage round trip was');
        // capture elapsed time since the original postMessage();
        if (!e.data.type) {
            var elapsed = seconds(startTime);
        }
        var data = e.data;
        if (data.type && data.type == 'debug') {
            log(data.msg);
        } else {
            var rate = Math.round(toMB(data.byteLength) / elapsed);
            log(source() + 'postMessage roundtrip took: ' + (elapsed * 1000) + ' ms');
            log(source() + 'postMessage roundtrip rate: ' + rate + ' MB/s');
        }
    };
    // To feature detect: send a small ArrayBuffer. If transferable objects are
    // supported, the ArrayBuffer will be neutered (cleared out) after sent.

    var ab = new ArrayBuffer(1);

    if (USE_TRANSFERABLE && enable_transferable.checked) {
        try {
            worker.postMessage(ab, [ab]);
            if (ab.byteLength) {
                alert('Transferables are not supported in your browser!');
                log(source() + 'USING STRUCTURED CLONE (copy) :(');
            } else {
                log(source() + 'USING TRANSFERABLE OBJECTS :)');
                supported = true;
            }
        } catch (e) {
            alert('Transferables are not supported in your browser!');
        }
    } else {
        worker.postMessage(ab); // send anyway to init worker.
        log(source() + 'USING STRUCTURED CLONE (copy) :(');
        supported = false;
    }
    log(source() + 'READY!');
}

function test() {
    setupArray(); // Need to do this on every run for the repeated runs with transferable arrays. They're cleared out after they're transferred.
    startTime = new Date();
    console.time('actual postMessage round trip was');
    if (USE_TRANSFERABLE && supported) {
        // Note: clears the uInt8View and it's underlying ArrayBuffer, transfering it
        // out of this view, to the worker.
        // Passing multiple transferables:
        //   worker.postMessage({view1: int8View, buffer2: anotherBuffer}, [int8View.buffer, anotherBuffer]);
        //   window.postMessage(arrayBuffer, targetOrigin, [arrayBuffer]);
        worker.postMessage(uInt8View.buffer, [uInt8View.buffer]);
    } else {
        worker.postMessage(uInt8View.buffer);
    }
}

function seconds(since) {
    return (new Date() - since) / 1000.0;
}

window.addEventListener('load', function (e) {
    init();
}, false);
