/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-07 07:44:55
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

/*
  让异步回调扁平化，解决嵌套过深可读性不高问题
  
  then
  catch
  resolve
  reject

  static:
    resolve
    reject
    all
    race

  特性：
    1. 每个promise实例当前只存在一种状态，默认时是pending，成功是resolved,失败是reject
    2. 当状态改变后，当继续执行resolve或reject无效
    3. 当执行实例resolve或reject，使用then或catch注册的状态函数是异步执行
    4. 链式调用
    5. 自动检测调用状态函数，如果出现异常，则改变状态为reject
    6. 如果状态函数中返回非promise对象，则直接调用下一个promise对象的成功状态函数，如果是promise对象，则需调用状态函数返回的promise对象的resolve方法，才能调用下一个promise对象的方法

    then其实就是创建新的promise对象用于链式调用，内部还是对当前promise对象的状态函数进行重写，然后引用新创建的promise对象，然后再调用
*/

define(function () {
    function Promise (cb) {
        // 保存状态函数
        this.faifulledCb = null;
        this.rejectedCb = null;
        // 当前状态
        this.status = 'pending';

        cb(this.resolve.bind(this), this.reject.bind(this));
    }    

    // 快速创建一个内部调用resolve的promise对象
    Promise.resolve = function (value) {
        return new Promise(function (resolve) {
            resolve(value);
        });
    };

    // 快速创建一个内部调用reject的promise对象
    Promise.reject = function (reason) {
        return new Promise(function (_, reject) {
            reject(reason);
        });
    };

    // 创建一个新promise对象，并且执行完所有的promise数组，并且所有的状态都是fullfailed，才以数组形式返回到，只要有一个是rejected状态就调用reject状态函数
    Promise.all = function (promises) {
        !(promises instanceof Array) && (promises = [ promises ]);

        var idx = 0;
        var len = promises.length;
        var res = [];

        return new Promise(function (resolve, reject) {
            promises.forEach(function (promise, index) {
                promise.then(function (value) {
                    res[ index ] = value;

                    if (idx++ === len - 1) {
                        resolve(res);
                    }
                }, function (reason) {
                    reject(reason);
                });
            });
        });
    };

    // 创建一个新promise对象，只要有一个promise状态改变，就立即将当前promise的值当做返回值返回
    Promise.race = function (promises) {
        !(promises instanceof Array) && (promises = [ promises ]);

        var completed = false;

        return new Promise(function (resolve, reject) {
            promises.forEach(function (promise) {
                promise.then(function (value) {
                    if (!completed) {
                        completed = true;
                        resolve(value);
                    }
                }, function (reason) {
                    if (!completed) {
                        completed = true;
                        reject(reason);
                    }
                })
            });
        });
    };

    // 定义当状态为成功或失败的回调函数
    // 内部定义状态函数，对参数进行闭包引用
    // 对函数参数进行返回值判断，如果返回的是非promise对象，则直接将值传入到下个promise对象的回调函数中，如果是promise，那么下一个promise对象需要返回的promise调用状态函数
    Promise.prototype.then = function (failfulledCb, rejectedCb) {
        failfulledCb == null && (failfulledCb = function (value) { return value; });
        rejectedCb == null && (rejectedCb = function (reason) { return reason; });

        var resPromise = new Promise((function (resolve, reject) {
            this.failfulledCb = function (value) {
                var res;

                try {
                    res = failfulledCb(value);

                    if (res instanceof Promise) {
                        res.then(function (val) {
                            resolve(val);
                        }, reject);
                    } else {
                        resolve(res);
                    }    
                } catch (err) {
                    reject(err.message);
                }
            };

            this.rejectedCb = function (reason) {
                var res;

                try {
                    res = rejectedCb(reason);

                    if (res instanceof Promise) {
                        res.then(function (rea) {
                            reject(rea);
                        }, reject);
                    } else {
                        resolve(res);
                    }    
                } catch (err) {
                    reject(err.message);
                }    
            }
        }).bind(this));

        return resPromise;
    };

    // 定义失败状态的回调函数
    Promise.prototype.catch = function (cb) {
        return this.then(null, cb);
    };

    // 将状态改为成功
    // 如果状态已经被改变，就不执行
    // 执行的时候异步
    Promise.prototype.resolve = function (value) {
        setTimeout((function () {
            if (this.failfulledCb == null || this.status !== 'pending')
                return;

            this.status = 'failfulled';
            this.failfulledCb(value);
        }).bind(this));
    };

    // 将状态改为失败
    Promise.prototype.reject = function (reason) {
        setTimeout((function () {
            if (this.rejectedCb == null || this.status !== 'pending')
                return;

            this.status = 'rejected';
            this.rejectedCb(reason);
        }).bind(this));
    };

    return Promise;
});