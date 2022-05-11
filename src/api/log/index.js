import {service, transformGetData} from '@/utils/request'

export function page(data) {
    let params = transformGetData(data);
    return service({
        url: 'api/admin/log' + params,
        method: 'get'
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
