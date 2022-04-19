import { service, transformGetData } from '@/utils/request'

export function page(data) {
    let params = transformGetData(data);
    return service({
        url: 'api/post/list' + params,
        method: 'get'
    })
}


export function add(data) {
    return service({
        url: 'api/menus',
        method: 'post',
        data
    })
}

export function del(ids) {
    return service({
        url: 'api/menus',
        method: 'delete',
        data: ids
    })
}

export function edit(data) {
    return service({
        url: 'api/menus',
        method: 'put',
        data
    })
}

export default {page, add, edit, del}
