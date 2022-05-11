import {service, transformGetData} from '@/utils/request'

export function queryAll() {
    return service({
        url: 'api/admin/tag/queryAll',
        method: 'get'
    })
}

export function queryByIds(ids) {
    return service({
        url: 'api/admin/tag/queryByIds?ids=' + ids,
        method: 'get'
    })
}

export function queryByName(name) {
    return service({
        url: 'api/admin/tag/queryByName/' + name,
        method: 'get'
    })
}

export function page(data) {
    let params = transformGetData(data);
    return service({
        url: 'api/admin/tag' + params,
        method: 'get'
    })
}


export function add(data) {
    return service({
        url: 'api/admin/tag',
        method: 'post',
        data
    })
}

export function del(ids) {
    if (typeof ids === "string") {
        ids = Array.of(ids);
    }
    return service({
        url: 'api/admin/tag',
        method: 'delete',
        data: ids
    })
}

export function edit(data) {
    return service({
        url: 'api/admin/tag',
        method: 'put',
        data
    })
}

export default {queryAll, queryByIds, queryByName, page, add, edit, del}
