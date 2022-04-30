import {service, transformGetData} from '@/utils/request'

export function page(data) {
    let params = transformGetData(data);
    return service({
        url: 'api/user/list' + params,
        method: 'get'
    })
}

export function add(data) {
    debugger
    return service({
        url: 'api/user/save',
        method: 'post',
        data
    })
}

export function del(ids) {
    if (typeof ids === "string") {
        ids = Array.of(ids);
    }
    return service({
        url: 'api/user/delete',
        method: 'delete',
        data: ids
    })
}

export function edit(data) {
    debugger
    return service({
        url: 'api/user/update',
        method: 'put',
        data
    })
}

export function uploadAction(file) {
    const formData = new FormData();
    formData.append('file', file)
    return service({
        url: 'api/user/upload',
        data: formData,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data',  // 文件上传
        },
    })
}

export function getCurrentUser() {
    return service({
        url: 'api/user/getCurrentUser',
        method: 'get'
    })
}

export function updatePwd(data) {
    return service({
        url: 'api/user/updatePwd',
        method: 'put',
        data
    })
}

export function queryAllOnlineUser(data) {
    let params = transformGetData(data);
    return service({
        url: 'api/user/queryAllOnlineUser' + params,
        method: 'get'
    })
}

export function kickOut(ids) {
    if (typeof ids === "string") {
        ids = Array.of(ids);
    }
    return service({
        url: 'api/user/kickOut',
        method: 'delete',
        data: ids
    })
}

export function kickOutForUsername(data) {
    return service({
        url: 'api/user/kickOutByUserName',
        method: 'delete',
        data
    })
}

export default {
    page,
    add,
    edit,
    del,
    uploadAction,
    getCurrentUser,
    updatePwd,
    queryAllOnlineUser,
    kickOut,
    kickOutForUsername
}
