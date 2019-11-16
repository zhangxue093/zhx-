// 权限认证 token令牌
// 提供获取token  设置token  删除token
const USER_KEY = 'zhx-84'
// 获取token
// 将来实现刷新token，需要存储的信息。关闭浏览器后再次打开，需要保持登录状态
export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(USER_KEY) || '{}')
}
// 设置 token user 是对象
export const setUser = (user) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// 清除token
export const delUser = () => {
  window.localStorage.removeItem(USER_KEY)
}
