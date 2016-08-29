import 'isomorphic-fetch';
import assign from 'lodash/assign';
// 定义 fetch 默认选项， 看 https://github.com/github/fetch
const defaultOptions = {
    method: 'post',
    credentials: 'include', //设置该属性可以把 cookie 信息传到后台
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'x-requested-with': 'XMLHttpRequest'
    }
};

function checkStatus(response) {
    const status = response.status;
    if (status >= 200 && status < 300) {
        return response;
    }
    let error = new Error(response.statusText);
    error.response = response;
    error.errorCode = status;
    throw error;
}

/**
 * 封装 fetch
 * 根据业务需求，还可以在出错的地方处理相应的功能
 * @param url
 * @param body //往后台传递的 json 参数
 * @param options // 可选参数项
 * @param loginVerify // 是否在该方法中校验登录
 * @returns {Promise.<TResult>}
 */
function callApi({url, body = {}, options, loginVerify = true}) {
    if (!url) {
        let error = new Error('请传入 url');
        error.errorCode = 0;
        return Promise.reject(error);
    }


    /*    const protocol = location.protocol;
     let fullUrl;
     if (url.indexOf('http') === 0) {
     fullUrl = url;
     } else {
     fullUrl = (url.indexOf(URL_ROOT) === -1) ? protocol + URL_ROOT + url : protocol + url;
     }*/

    let _options = assign({}, defaultOptions, options);
    if(_options.method !== 'GET'){
        let _body = assign({}, body);

        Object.keys(_body).forEach((item) => {
            if (_body[item] === null || _body[item] === undefined ||
                _body[item] === 'null' || _body[item] === 'undefined') {
                delete _body[item];
            }
        });
        _options.body = JSON.stringify(_body);
    }

    return fetch(url, _options)
        .then(checkStatus)
        .then(response =>
            response.json().then(json => ({json, response}))
        ).then(({json, response}) => {
            if (json.code != 0) {
                console.log(json.data);
                return Promise.reject(new Error(json.msg));
            }
            return {json, response};
        }).catch((error) => {
            return Promise.reject(error);
        });
}

export default callApi;
