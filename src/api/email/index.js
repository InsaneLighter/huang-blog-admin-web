import { service } from '@/utils/request'

export function sendEmail(data) {
    return service({
        url: 'api/mail/send',
        method: 'post',
        data
    })
}

export function uploadAction(file) {
    const formData = new FormData();
    formData.append('file', file)
    return service({
        url: 'api/mail/upload',
        data: formData,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data',  // 文件上传
        },
    })
}
