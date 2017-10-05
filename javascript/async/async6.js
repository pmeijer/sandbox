function asyncFn(callback) {
    setTimeout(function () {
        callback();
    }, 100);
}

for (var i = 0; i < 10; i += 1) {
    asyncFn(function () {
        console.log(i);
    });
}