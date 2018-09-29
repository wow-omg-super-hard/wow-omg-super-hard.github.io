/**
 * 
 * @authors zengwenbin (henshuaimeibian@163.com)
 * @date    2018-09-10 09:04:48
 * @link    https://github.com/wow-omg-super-hard
 * @version 1.0
 */

define(['jquery', 'underscore', 'promise'], function ($, _, Promise) {
    function request (url, method, header, data) {
        if (!url || !method) {
            throw new Error('请传入必要的请求地址或请求方法！！！');
        }

        header = _.extend(header, { 'Content-Type': 'application/x-www-form-urlencoded' });
        data || _.extend(data, { 'token': JSON.parse(localStorage.getItem('token')) });
        
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                type: method,
                dataType: 'json',
                beforeSend: function (xhr) {
                    $.each(function (key, value) {
                        xhr.setRequestHeader(key, value);
                    });
                },
                // 检查逻辑错误(错误码非0)
                success: function (resp) {
                    if (resp.errCode) {
                        reject(resp.errMes);
                        return;
                    }

                    resolve(resp);
                },
                // 检查HTTP错误
                error: function (_, errTextStatus) {
                    var errMes = '';

                    switch (errTextStatus.toLowerCase()) {
                        case 'timeout':
                            errMes = '响应超时，请重新请求！！！';
                            break;
                        // 404、500、503
                        case 'error':
                            errMes = '请求的地址不存在或服务器内部错误，请重新检查！！！';
                            break;
                        case 'bort':
                            errMes = '终止';
                            break;
                        case 'parsererror':
                            errMes = '请求参数格式错误，请重新检查！！！';
                            break;
                    }

                    reject(errMes);
                }
            });
        });
    }

    var fetch = {
        get: function (url, header, data) {
            return request(url, 'GET', header, data);
        },
        post: function (url, header, data) {
            return request(url, 'POST', header, data);
        }
    };

    return fetch;
});