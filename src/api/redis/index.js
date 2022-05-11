import {service} from '@/utils/request'

export function getRedisInfo() {
    return service({
        url: 'api/admin/redis/info',
        method: 'get'
    })
}

export function getKeysSize() {
    return service({
        url: 'api/admin/redis/keysSize',
        method: 'get'
    })
}

export function getKeysSizeReport() {
    return service({
        url: 'api/admin/redis/keysSizeForReport',
        method: 'get'
    })
}

export function memoryForReport() {
    return service({
        url: 'api/admin/redis/memoryForReport',
        method: 'get'
    })
}

export function infoForReport() {
    return service({
        url: 'api/admin/redis/infoForReport',
        method: 'get'
    })
}

export function memoryInfo() {
    return service({
        url: 'api/admin/redis/memoryInfo',
        method: 'get'
    })
}

export function queryDiskInfo() {
    return service({
        url: 'api/admin/redis/queryDiskInfo',
        method: 'get'
    })
}

export default {getRedisInfo, getKeysSize, getKeysSizeReport, memoryForReport, infoForReport, memoryInfo, queryDiskInfo}
