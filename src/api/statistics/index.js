import {service} from '@/utils/request'

export function statistics() {
    return service({
        url: 'api/statistics',
        method: 'get'
    })
}

export function statisticsByUser(token) {
    return service({
        url: 'api/statistics/' + token,
        method: 'get'
    })
}

export function visitStatistics() {
    return service({
        url: 'api/statistics/visit',
        method: 'get'
    })
}


export default {statistics, statisticsByUser, visitStatistics}
