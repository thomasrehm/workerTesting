var USE_TRANSFERRABLE = true,
    SIZE = 1024 * 1024, // 32MB
    arrayBuffer = null,
    uInt8View = null,
    originalLength = null;

function setupArray() {
    arrayBuffer = new ArrayBuffer(SIZE * size);
    uInt8View = new Uint8Array(arrayBuffer);
    originalLength = uInt8View.length;

    for (var i = 0; i < originalLength; ++i) {
        uInt8View[i] = i;
    }

    log(source() + 'filled ' + toMB(originalLength) + ' MB buffer');
}

function time() {
    var now = new Date(),
        time = /(\d+:\d+:\d+)/.exec(now)[0] + ':';
    for (var ms = String(now.getMilliseconds()), i = ms.length - 3; i < 0; ++i) {
        time += '0';
    }
    return time + ms;
}

function source(s) {
    if (self.importScripts) {
        return '<span style="color:red;">worker:</span> ';
    } else {
        return '<span style="color:green;">thread:</span> ';
    }
}

function toMB(bytes) {
    if (size >= 1) {
        return (bytes / 1024 / 1024).toFixed();
    } else {
        return (bytes / 1024 / 1024).toFixed(1);
    }
}
