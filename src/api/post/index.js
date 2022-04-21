import {service, transformGetData} from '@/utils/request'

export function page(data) {
    let params = transformGetData(data);
    return service({
        url: 'api/post/list' + params,
        method: 'get'
    })
}

export function get(postId) {
    return service({
        url: 'api/post/get/' + postId,
        method: 'get'
    })
}

export function updateStatus(data) {
    return service({
        url: 'api/post/update',
        method: 'put',
        data
    })
}
export function updateStatusInBatch(data) {
    return service({
        url: 'api/post/updateStatusInBatch',
        method: 'put',
        data
    })
}
export function add(data) {
    return service({
        url: 'api/post',
        method: 'post',
        data
    })
}

export function del(ids) {
    if(typeof ids === "string"){
        ids = Array.of(ids);
    }
    return service({
        url: 'api/post/delete',
        method: 'delete',
        data: ids
    })
}

export function edit(data) {
    return service({
        url: 'api/post',
        method: 'put',
        data
    })
}

export default {page, get, updateStatus,updateStatusInBatch, add, edit, del}
