import {service} from '@/utils/request'

export function page(data) {
    return service({
        url: 'api/admin/content/list',
        method: 'post',
        data
    })
}


export function add(data) {
    return service({
        url: 'api/admin/content',
        method: 'post',
        data
    })
}

export function del(ids) {
    return service({
        url: 'api/admin/content',
        method: 'delete',
        data: ids
    })
}

export function update(data) {
    return service({
        url: 'api/admin/content',
        method: 'put',
        data
    })
}

export function uploadAction(file) {
    const formData = new FormData();
    formData.append('file', file)
    return service({
        url: 'api/admin/content/upload',
        data: formData,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data',  // 文件上传
        },
    })
}

export default {page, add, update, del, uploadAction}
