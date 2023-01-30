import {service} from '@/utils/request'

export function page(data) {
    return service({
        url: 'api/admin/comment/list',
        method: 'post',
        data
    })
}

export function del(ids) {
    if (typeof ids === "string") {
        ids = Array.of(ids);
    }
    return service({
        url: 'api/admin/comment',
        method: 'delete',
        data: ids
    })
}
export function edit(data) {
    return service({
        url: 'api/admin/comment',
        method: 'put',
        data
    })
}
export function pass(ids) {
    if (typeof ids === "string") {
        ids = Array.of(ids);
    }
    return service({
        url: 'api/admin/comment/pass',
        method: 'put',
        data: ids
    })
}
export default {
    page,
    del,
    edit,
    pass
}
