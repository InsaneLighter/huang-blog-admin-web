import {service, transformGetData} from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'

export function page(data) {
    let params = transformGetData(data);
    return service({
        url: 'api/user/list' + params,
        method: 'get'
    })
}

export function add(data) {
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
    debugger
    data.oldPassword = encrypt(data.oldPassword)
    data.newPassword = encrypt(data.newPassword)
    data.confirmPassword = encrypt(data.confirmPassword)
    return service({
        url: 'api/user/updatePwd',
        method: 'put',
        data
    })
}

export default {page, add, edit, del, uploadAction, getCurrentUser,updatePwd}
