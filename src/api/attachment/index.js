import {service, transformGetData} from '@/utils/request'

export function page(data) {
    let params = transformGetData(data);
    return service({
        url: 'api/admin/attachment' + params,
        method: 'get'
    })
}

export function add(data) {
    return service({
        url: 'api/admin/attachment',
        method: 'post',
        data
    })
}

export function del(ids) {
    if (typeof ids === "string") {
        ids = Array.of(ids);
    }
    return service({
        url: 'api/admin/attachment',
        method: 'delete',
        data: ids
    })
}

export function edit(data) {
    return service({
        url: 'api/admin/attachment',
        method: 'put',
        data
    })
}

export function listMediaTypes() {
    return service({
        url: 'api/admin/attachment/listMediaTypes',
        method: 'get',
    })
}

export function listTypes() {
    return service({
        url: 'api/admin/attachment/listTypes',
        method: 'get',
    })
}

export function uploadAction(file) {
    const formData = new FormData();
    formData.append('file', file)
    return service({
        url: 'api/admin/attachment/upload',
        data: formData,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data',  // 文件上传
        },
    })
}

export default {page, add, edit, del, listMediaTypes, listTypes, uploadAction}
