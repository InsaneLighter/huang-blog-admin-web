import {service, transformGetData} from '@/utils/request'

export function queryAll(data) {
    let params = transformGetData(data);
    return service({
        url: 'api/admin/todo/queryAll' + params,
        method: 'get'
    })
}

export function get(todoId) {
    return service({
        url: 'api/admin/todo/get/' + todoId,
        method: 'get'
    })
}

export function add(data) {
    return service({
        url: 'api/admin/todo',
        method: 'post',
        data
    })
}

export function del(ids) {
    if(typeof ids === "string"){
        ids = Array.of(ids);
    }
    return service({
        url: 'api/admin/todo',
        method: 'delete',
        data: ids
    })
}

export function edit(data) {
    return service({
        url: 'api/admin/todo',
        method: 'put',
        data
    })
}

export default {queryAll, get, add, edit, del}
