import {service} from '@/utils/request'

export function page(data) {
    return service({
        url: 'api/admin/journal/list',
        method: 'post',
        data
    })
}

export function add(data) {
    return service({
        url: 'api/admin/journal',
        method: 'post',
        data
    })
}

export function del(ids) {
    if (typeof ids === "string") {
        ids = Array.of(ids);
    }
    return service({
        url: 'api/admin/journal',
        method: 'delete',
        data: ids
    })
}

export function edit(data) {
    return service({
        url: 'api/admin/journal',
        method: 'put',
        data
    })
}

export function uploadAction(file) {
    const formData = new FormData();
    formData.append('file', file)
    return service({
        url: 'api/admin/journal/upload',
        data: formData,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data',  // 文件上传
        },
    })
}

export default {
    page,
    add,
    edit,
    del,
    uploadAction
}
