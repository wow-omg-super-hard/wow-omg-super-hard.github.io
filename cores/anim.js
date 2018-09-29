/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-09 17:28:52
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

/*
 * 动画可以提升用户体验
 频繁的在一段时间内修改css属性达到连贯性的过程就是动画
 js实现动画有两种，通过定时器不断的修改css属性
 使用css属性的transition和animation属性

 动画的几个变量
 duration: 动画执行时间
 startTime: 动画开始执行时间
 timePassed: 动画开始执行后消耗时间
 progress: 动画进度（timePassed / duration）

 30fps在浏览器上显示还是不连贯，一般设置在50-80fps之间，太低了，不连贯，太高了，消耗cpu资源，帧是决定动画连不连贯的因素
 js动画核心就是通过缓动算法计算出当前位置再配合jsapi实现具有连贯性的动作
*/

define(['tween'], function (tween) {
    // Polyfill
    // 兼容requestAnimationFrame和cancelAnimationFrame
    // 使用此函数代替setTimeout/setInterval的好处就是浏览器会在调用频率上做了优化，并且在最小化的时候，暂停动画，节省cpu性能
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (cb) {
            // 浏览器并且适合60fps
            setTimeout(cb, 16);
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        }
    }

    function animation (from, to, duration, easing, cbing, cbEnd) {
        // startTime: 动画开始时间
        // timePassed: 动画消耗时间
        // progress: 动画进度
        var startTime, timePassed, progress;
        var timerId, value, tweenKeys, tweenMethod;
        var frameCount, frameIndex;

        // 没有位移和时间，不构成动画
        if (typeof from === 'string' || from == null || to == null) {
            return void 0;
        }

        if (duration == null) {
            // 动画持续时间(单位:ms)
            duration = 300;
        }

        if (easing == null) {
            // 缓动类型
            easing = 'Linear';
        }

        if (cbing == null) {
            cbing = function () {};
        }

        if (cbEnd == null) {
            cbEnd = function () {};
        }

        // 格式化easing成Xxx.oo或Xxx首字母大写形式
        easing = easing.charAt(0).toUpperCase() + easing.slice(1).toLowerCase();
        startTime = Date.now();
        timerId = null;
        tweenKeys = easing.split('.');
        frameIndex = 0;
        frameCount = Math.ceil(duration / 16);

        if (tweenKeys.length == 1) {
            tweenMethod = tween[ tweenKeys[0] ];
        } else {
            tweenMethod = tween[ tweenKeys[0] ] && tween[ tweenKeys[0] ][ tweenKeys[1] ];
        }

        return function step () {
            timePassed = Date.now() - startTime;

            if (timePassed > duration) {
                timePassed = duration;
            }

            value = tweenMethod(timePassed, from, to - from, duration);
            
            // 如果时间进度大于总时间，则表明动画执行结束
            if (timePassed === duration) {
                cancelAnimationFrame(timerId);
                cbEnd(value);
            } else {
                cbing(value);
                timerId = requestAnimationFrame(step);
            }
        };
    }

    return animation;
});