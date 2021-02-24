import axios from 'axios'
import qs from 'qs'
//项目的一些环境配置参数，读取host
import config from '@/config'
//vuex状态管理，这里主要进行对全局loading的控制
// import store from '@/store'
// import {
//     showLoading,
//     closeLoading
// } from '@/components/loading'

// 超时时间（超时时间）
let TIME_OUT_MAX = 30000
// 未授权状态码
let UnauthorizedCode = 401
// 未授权数据，表示登录已失效
let UnauthorizedData = 100000
// 页面刷新次数key
let RefreshCountKey = 'EHRRefreshCount'
// 页面最多刷新次数
let MaxRefreshCount = 3
// 页面刷新次数
let RefreshCount = Number(window.sessionStorage.getItem(RefreshCountKey)) || 0
// 请求接口host
const baseUrl = config.apiRoot
// 请求组（判断当前请求数）
let _requests = []

// 添加请求拦截器
axios.interceptors.request.use(request => {
    return request
}, err => {
    return Promise.reject(err)
})

/**
 * 添加请求，显示loading
 * @param {请求配置} config
 */
const pushRequest = config => {
    // console.log(`${config.url} -- Begin`)
    _requests.push(config)
}

/**
 * 移除请求，无请求时关闭loading
 * @param {请求配置} config
 */
const popRequest = config => {
    // console.log(`${config.url} -- End`)
    let _index = _requests.findIndex(r => {
        return r === config
    })
    if (_index > -1) {
        _requests.splice(_index, 1)
    }
    if (!_requests.length) {
        // store.dispatch('loading', false)
    }
}

/**
 * 刷新页面
 */
const refresh = () => {
    if (RefreshCount >= MaxRefreshCount) {
        // 重定向次数达到上限，防止无限重定向
        return false
    }
    RefreshCount++
    window.sessionStorage.setItem(RefreshCountKey, RefreshCount)
    window.location.reload() // 强制刷新，不读取浏览器缓存
    return true
}

// 添加响应拦截器
axios.interceptors.response.use(response => {
    // store.state.globalLoading = false;
    if (response.status === config.statusCode.OK) {
        let result = response.data;
        response.data = result;
        if (response.data && response.data.StatusCode === config.statusCode.OK && response.data.Data) {
            if (response.data.Data.indexOf("}") !== -1 || response.data.Data.indexOf("]") !== -1) {
                response.data.Data = JSON.parse(response.data.Data);
            }
        }
    } else {
        console.log(response.url + response.status + '服务器异常');
    }
    return response;
}, err => {
    return Promise.reject(err);
});


// 对Axios进行默认配置
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest' // 针对网关标识请求类型
axios.defaults.baseURL = baseUrl

// 自定义参数化序列函数，axios默认get请求参数不会序列化中括号[]
axios.defaults.paramsSerializer = function (p) {
    return qs.stringify(p, {
        arrayFormat: 'repeat'
    })
}

// 申明Axios实例
const AxiosInstance = axios.create({
    timeout: TIME_OUT_MAX
})

/**
 * @param { String } URL
 * @param { String } Method
 * @param { Any } Data
 * @param { Boolean } Loading
 * @param { Object } Headers
 */
export default (url, method = 'POST', data = {}, loading = false, isSilence = false, headers = {}) => {
    let options = {
        method,
        url,
        headers
    }

    let _data = data

    let _query = null

    switch (Object.prototype.toString.call(_data)) {
        case '[object Object]':
            _query = {}
            for (let _key in _data) {
                if (Object.prototype.hasOwnProperty.call(_data, _key)) {
                    if (typeof _data[_key] === 'string') {
                        if (_data[_key] === '') {
                            _query[_key] = null
                        } else {
                            _query[_key] = _data[_key].trim()
                        }
                    } else {
                        _query[_key] = _data[_key]
                    }
                }
            }
            break;
        case '[object Array]':
            _query = []
            for (let _key in _data) {
                if (Object.prototype.hasOwnProperty.call(_data, _key)) {
                    _query[_key] = _data[_key]
                }
            }
            break;
        default:
            _query = _data
            break
    }

    let _timer = null
    if (method.toLocaleUpperCase() === 'POST') {
        options.data = _query
    } else {
        options.params = _query
    }
    loading && showLoading()
    return new Promise((resolve, reject) => {
        const _instance = AxiosInstance
        let _random = {
            stamp: Date.now(),
            url: `${baseUrl + url}`
        }
        if (!isSilence) {
            pushRequest(_random)
        }
        _instance(options)
            .then(res => {
                if (RefreshCount > 0) {
                    // 请求正常响应后就重置刷新次数
                    RefreshCount = 0
                    window.sessionStorage.removeItem(RefreshCountKey)
                }
                if (loading) {
                    closeLoading()
                }
                clearTimeout(_timer)
                popRequest(_random)
                resolve(res.data)
            })
            .catch(res => {
                if (res.response && res.response.status === UnauthorizedCode && res.response.data === UnauthorizedData) {
                    // 网关登录态失效，先刷新下页面试试
                    if (refresh()) {
                        return
                    }
                }
                let _response = res.response
                let _message = null
                if (loading) {
                    closeLoading()
                }
                clearTimeout(_timer)
                popRequest(_random)
                if (_response && _response.status) {
                    switch (_response.status) {
                        case 404:
                            _message = '404,错误请求'
                            break
                        case 401:
                            _message = '未授权'
                            break
                        case 403:
                            _message = '禁止访问'
                            break
                        case 408:
                            _message = '请求超时'
                            break
                        case 500:
                            _message = '服务器内部错误'
                            break
                        case 501:
                            _message = '功能未实现'
                            break
                        case 503:
                            _message = '服务不可用'
                            break
                        case 504:
                            _message = '网关错误'
                            break
                        default:
                            _message = '未知错误'
                    }
                }
                if (!isSilence) {
                    if (_message != null) {
                        console.log(_message)
                    }
                }
                reject(res)
            })
    })
}