import {service} from '@/utils/request'

export function statistics() {
    return service({
        url: 'api/admin/statistics',
        method: 'get'
    })
}

export function statisticsByUser(token) {
    return service({
        url: 'api/admin/statistics/' + token,
        method: 'get'
    })
}

export function visitStatistics() {
    return service({
        url: 'api/admin/statistics/visit',
        method: 'get'
    })
}


export default {statistics, statisticsByUser, visitStatistics}
