function asyncFn(outStr) {
    setTimeout(function () {
        console.log(outStr);
    }, 100);
}


asyncFn(1);
asyncFn(2);
console.log(3);