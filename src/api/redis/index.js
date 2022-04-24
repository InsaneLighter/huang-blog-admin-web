import {service} from '@/utils/request'

export function getRedisInfo() {
    return service({
        url: 'api/redis/info',
        method: 'get'
    })
}

export function getKeysSize() {
    return service({
        url: 'api/redis/keysSize',
        method: 'get'
    })
}

export function getKeysSizeReport() {
    return service({
        url: 'api/redis/keysSizeForReport',
        method: 'get'
    })
}

export function memoryForReport() {
    return service({
        url: 'api/redis/memoryForReport',
        method: 'get'
    })
}

export function infoForReport() {
    return service({
        url: 'api/redis/infoForReport',
        method: 'get'
    })
}

export function memoryInfo() {
    return service({
        url: 'api/redis/memoryInfo',
        method: 'get'
    })
}

export function queryDiskInfo() {
    return service({
        url: 'api/redis/queryDiskInfo',
        method: 'get'
    })
}

export default {getRedisInfo, getKeysSize, getKeysSizeReport, memoryForReport, infoForReport, memoryInfo, queryDiskInfo}
