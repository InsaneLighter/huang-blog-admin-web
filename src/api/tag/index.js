import { service, transformGetData } from '@/utils/request'

export function queryAll() {
    return service({
        url: 'api/tag/queryAll',
        method: 'get'
    })
}

export function page(data) {
    let params = transformGetData(data);
    return service({
        url: 'api/tag/list' + params,
        method: 'get'
    })
}


export function add(data) {
    return service({
        url: 'api/tag/save',
        method: 'post',
        data
    })
}

export function del(ids) {
    return service({
        url: 'api/tag',
        method: 'delete',
        data: ids
    })
}

export function edit(data) {
    return service({
        url: 'api/tag',
        method: 'put',
        data
    })
}

export default {queryAll, page, add, edit, del}
