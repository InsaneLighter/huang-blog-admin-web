import { service } from '@/utils/request'

export function login(user) {
  return service({
    url: 'api/admin/login',
    method: 'post',
    data: user
  })
}

export function getCodeImg() {
  return service({
    url: 'api/admin/code',
    method: 'get'
  })
}

export function logout() {
  return service({
    url: 'api/admin/logout',
    method: 'delete'
  })
}
