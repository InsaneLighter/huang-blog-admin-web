import {service} from '@/utils/request'

export function queryAll() {
    return service({
        url: 'api/admin/category/queryAll',
        method: 'get'
    })
}

export function queryAllTree() {
    return service({
        url: 'api/admin/category/queryAllTree',
        method: 'get'
    })
}

export function queryByIds(ids) {
    return service({
        url: 'api/admin/category/queryByIds',
        method: 'post',
        data: {
            ids:ids
        }
    })
}

export function queryByName(name) {
    return service({
        url: 'api/admin/category/queryByName/' + name,
        method: 'get'
    })
}

export function page(data) {
    return service({
        url: 'api/admin/category',
        method: 'post',
        data
    })
}


export function add(data) {
    return service({
        url: 'api/admin/category',
        method: 'post',
        data
    })
}

export function del(ids) {
    if (typeof ids === "string") {
        ids = Array.of(ids);
    }
    return service({
        url: 'api/admin/category',
        method: 'delete',
        data: ids
    })
}

export function edit(data) {
    return service({
        url: 'api/admin/category',
        method: 'put',
        data
    })
}

export default {queryAll, queryAllTree, queryByIds, queryByName, page, add, edit, del}
