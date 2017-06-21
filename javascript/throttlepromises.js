/*globals console*/
/*jshint node:true*/
/**
 * This should only be used for "shorter" task lists as the call stack can grow big.
 * @author pmeijer / https://github.com/pmeijer
 */

'use strict';

var Q = require('q'),
    tasks = ['task1', 'task2', 'task3'],
    ERROR_ID = '',
    cnt = tasks.length;

function async(id) {
    var def = Q.defer();
    setTimeout(function () {
        console.log('async done ' + id);
        if (ERROR_ID === id) {
            def.reject(new Error('Failed for ' + id));
        } else {
            def.resolve();
        }
    }, 500);

    return def.promise;
}

function throttleTasks() {
    console.log('cnt === ' + cnt);

    if (cnt === 0) {
        return;
    } else {
        cnt -= 1;

        return async(tasks[cnt])
            .then(function () {
                return throttleTasks();
            });
    }
}

// N.B. throttleTasks must be within then to work for empty arrays!
async('dummy')
    .then(function () {
        return throttleTasks();
    })
    .then(function () {
        console.log('Finished');
    })
    .catch(function (err) {
        console.error(err);
    });