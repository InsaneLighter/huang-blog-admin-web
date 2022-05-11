import {service, transformGetData} from '@/utils/request'

export function page(data) {
    let params = transformGetData(data);
    return service({
        url: 'api/admin/user' + params,
        method: 'get'
    })
}

export function add(data) {
    return service({
        url: 'api/admin/user',
        method: 'post',
        data
    })
}

export function del(ids) {
    if (typeof ids === "string") {
        ids = Array.of(ids);
    }
    return service({
        url: 'api/admin/user',
        method: 'delete',
        data: ids
    })
}

export function edit(data) {
    return service({
        url: 'api/admin/user',
        method: 'put',
        data
    })
}

export function uploadAction(file) {
    const formData = new FormData();
    formData.append('file', file)
    return service({
        url: 'api/admin/user/upload',
        data: formData,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data',  // 文件上传
        },
    })
}

export function getCurrentUser() {
    return service({
        url: 'api/admin/user/getCurrentUser',
        method: 'get'
    })
}

export function updatePwd(data) {
    return service({
        url: 'api/admin/user/updatePwd',
        method: 'put',
        data
    })
}

export function queryAllOnlineUser(data) {
    let params = transformGetData(data);
    return service({
        url: 'api/admin/user/queryAllOnlineUser' + params,
        method: 'get'
    })
}

export function kickOut(ids) {
    if (typeof ids === "string") {
        ids = Array.of(ids);
    }
    return service({
        url: 'api/admin/user/kickOut',
        method: 'delete',
        data: ids
    })
}

export function kickOutForUsername(data) {
    return service({
        url: 'api/admin/user/kickOutByUserName',
        method: 'delete',
        data
    })
}

export function resetPwd(data) {
    return service({
        url: 'api/admin/user/resetPwd',
        method: 'put',
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
    kickOutForUsername,
    resetPwd
}
