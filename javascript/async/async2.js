function asyncFn(outStr, callback) {
    setTimeout(function () {
        console.log(outStr);
        callback();
    }, 100);
}


asyncFn(1, function () {
    asyncFn(2, function() {
        console.log(3);
    });
});