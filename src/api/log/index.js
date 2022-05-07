import {service, transformGetData} from '@/utils/request'

export function page(data) {
    let params = transformGetData(data);
    return service({
        url: 'api/log/list' + params,
        method: 'get'
    })
}

export function del(ids) {
    if (typeof ids === "string") {
        ids = Array.of(ids);
    }
    return service({
        url: 'api/log/delete',
        method: 'delete',
        data: ids
    })
}

export default {
    page,
    del
}
