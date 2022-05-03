import { service } from '@/utils/request'

export function getAction(url) {
    return service({
        url: '/api/'+url,
        method: 'get'
    })
}

/**
 * 文件上传 用于富文本上传图片
 * @param url
 * @param parameter
 * @returns {*}
 */
export function uploadAction(url,parameter){
    return service({
        url: url,
        data: parameter,
        method:'post' ,
        headers: {
            'Content-Type': 'multipart/form-data',  // 文件上传
        },
    })
}

export function sendEmail(data) {
    return service({
        url: 'api/mail/send',
        method: 'post',
        data
    })
}

