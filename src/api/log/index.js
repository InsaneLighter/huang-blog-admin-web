import {service} from '@/utils/request'

export function page(data) {
    return service({
        url: 'api/admin/log',
        method: 'post',
        data
    })
}

export function del(ids) {
    if (typeof ids === "string") {
        ids = Array.of(ids);
    }
    return service({
        url: 'api/admin/log',
        method: 'delete',
        data: ids
    })
}

export default {
    page,
    del
}
