/*globals console*/
/*jshint node: true*/

/**
 * Test script for inserting documents in mongodb with the same id.
 * Two modes available, 1) if WHEN is defined 2) if not
 * 1) Waits and make a single document insert after WHEN has passed [ms after 1970].
 *    This mode is meant to have multiple node mongoidinsert.js running at the same time.
 * 2) Sends of NUM_INSERTS with the same data using Q.all
 *
 *
 * npm install mongodb
 * npm install q
 *
 * @author pmeijer / https://github.com/pmeijer
 */

'use strict';

var mongodb = require('mongodb'),
    Q = require('q'),
    MONGO_URI = 'mongodb://127.0.0.1:27017/insertion_parallel_test',
    OPTIONS = {
        w: 1,
        autoReconnect: true,
        keepAlive: 1
    },
    COLL_NAME = 'test',
    CONTENT_SIZE = 1000000,
    DATA = {
        _id: 'myOwnId',
        content: (new Array(CONTENT_SIZE)).join('x')
    },
    NUM_INSERTS = 10000,
    WHEN,
    db,
    coll;

function afterConnEstablished() {
    var cnt = NUM_INSERTS,
        promises = [];

    if (WHEN) {
        console.log('Will make one insert at given time', WHEN);
        console.log(Date.now(), WHEN);
        while (Date.now() < WHEN) {
            // Block execution till we've passed WHEN
        }
        promises.push(Q.ninvoke(coll, 'insertOne', DATA));
    } else {
        console.log('Will make', NUM_INSERTS, 'in "parallel"');
        while(cnt --) {
            promises.push(Q.ninvoke(coll, 'insertOne', DATA));
        }
    }


    Q.allSettled(promises)
        .then(function (res) {
            var successCnt = 0,
                errCnt = 0;

            res.forEach(function (r) {
                if (r.state === 'fulfilled') {
                    successCnt += 1;
                } else {
                    errCnt += 1;
                    if (r.reason.code !== 11000) {
                        console.error(r.reason);
                    }
                }
            });

            console.log('successes:', successCnt);
            console.log('failures:', errCnt);
            process.exit();
        });
}

mongodb.MongoClient.connect(MONGO_URI, OPTIONS, function (err, db_) {
    if (err) {
        console.error('connect', err);
    } else {
        db = db_;
        db.dropCollection(COLL_NAME, function (err) {
            if (err && err.ok !== 0) {
                console.error('dropCollection', err);
            } else {
                db.collection(COLL_NAME, function (err, coll_) {
                    if (err) {
                        console.error('collection', err);
                    } else {
                        coll = coll_;
                        afterConnEstablished();
                    }
                });
            }
        });
    }
});

