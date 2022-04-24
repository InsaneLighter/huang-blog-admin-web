import { service } from '@/utils/request'

export function getAction(url) {
    return service({
        url: '/api/'+url,
        method: 'get'
    })
}
