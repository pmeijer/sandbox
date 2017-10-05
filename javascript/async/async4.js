function asyncFn(outStr, callback) {
    setTimeout(function () {
        console.log(outStr);
        callback();
    }, 100 * Math.random());
}


var numberOfTasks = 10,
    cnt = 0;

function counterCallback() {
    cnt += 1;
    if (cnt === numberOfTasks) {
        // we’re done check error
        console.log('finished');
    }
}

for (var i = 0; i < numberOfTasks; i += 1) {
    asyncFn(i, counterCallback);
}