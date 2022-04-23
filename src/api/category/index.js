import {service, transformGetData} from '@/utils/request'

export function queryAll() {
    return service({
        url: 'api/category/queryAll',
        method: 'get'
    })
}

export function queryByIds(ids) {
    return service({
        url: 'api/category/queryByIds?ids=' + ids,
        method: 'get'
    })
}

export function page(data) {
    let params = transformGetData(data);
    return service({
        url: 'api/category/list' + params,
        method: 'get'
    })
}


export function add(data) {
    return service({
        url: 'api/category/save',
        method: 'post',
        data
    })
}

export function del(ids) {
    if(typeof ids === "string"){
        ids = Array.of(ids);
    }
    return service({
        url: 'api/category/delete',
        method: 'delete',
        data: ids
    })
}

export function edit(data) {
    return service({
        url: 'api/category/update',
        method: 'put',
        data
    })
}

export default {queryAll, queryByIds, page, add, edit, del}
