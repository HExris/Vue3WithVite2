import fetch from "util/fetch";
// import axios from 'axios'

// 获取自定义字段对应的字典列表
export default {
    createUser({
        userName,
        password
    }) {
        return fetch(`/user/createUser`, 'POST', {
            userName,
            password
        }, false);
    }
}