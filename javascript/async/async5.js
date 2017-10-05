function asyncFn(outStr, callback) {
    setTimeout(function () {
        console.log(outStr);
        callback();
    }, 100 * Math.random());
}


var numberOfTasks = 10,
    cnt = 0;

function throttleCallback() {
    cnt += 1;
    if (cnt === numberOfTasks) {
        // we’re done check error
        console.log('finished');
    } else {
        asyncFn(cnt, throttleCallback);
    }
}

asyncFn(cnt, throttleCallback);