import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDTG1CCIKxRNX4LJXWgLaDbPvGpFzfwtnv/lKI6LLqbhySzZ/31NuIL5bwUgc9pfcKFHYrABN3MndHBDkNp/g3bcocxyipWh+OEtWu9XUCGdaFUPZftZnVig/68/lhTIdWXEG0C7YZcbjZo9d3HwPZ5HK7qhsi58Ii1mxq55iFNJwIDAQAB'

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

