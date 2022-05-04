import {service, transformGetData} from '@/utils/request'

export function page(data) {
    let params = transformGetData(data);
    return service({
        url: 'api/content/list' + params,
        method: 'get'
    })
}


export function add(data) {
    return service({
        url: 'api/content/save',
        method: 'post',
        data
    })
}

export function del(ids) {
    return service({
        url: 'api/content',
        method: 'delete',
        data: ids
    })
}

export function update(data) {
    return service({
        url: 'api/content/update',
        method: 'put',
        data
    })
}

export function uploadAction(file) {
    const formData = new FormData();
    formData.append('files', file)
    return service({
        url: 'api/content/upload',
        data: formData,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data',  // 文件上传
        },
    })
}

export default {page, add, update, del, uploadAction}
