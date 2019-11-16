// 提供一个配置好的axios请求的函数（调用接口）
import axios from 'axios'
import JSONBIG from 'json-bigint'
import store from '@/store'
import router from '@/router'
// 创建一个新的axios实例
const instance = axios.create({
  // 添加基准值的配置
  baseURL: 'http://ttapi.research.itcast.cn/',
  transformResponse: [(data) => {
    //   data是原始数据格式
    try {
      // 进行格式转化
      return JSONBIG.parse(data)
    } catch (e) {
      return data
    }
  }]
})
// 请求拦截器  追加token到请求头
instance.interceptors.request.use(config => {
  // 拦截成功
  // 获取token(vuex中state中user中token)
  if (store.state.user.token) {
    //   追加token
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, err => Promise.reject(err))
// 响应拦截器  获取有效数据    token的延长有效期
instance.interceptors.response.use(res => {
  // 剥离无效数据   有效数据 res.data.data
//   注意：有时候并不叫data  有些时候连响应主体都没有
  try {
    return res.data.data
  } catch (e) {
    return res.data
  }
}, async err => {
  // TODO token失效处理
  if (err.response && err.response.status === 401) {
    // 跳转登录的地址  使用router获取当前访问的路由地址  （vue组件 this.$route.path）
    const loginConfig = { path: '/login', query: { redirectUrl: router.currentRoute.path } }
    // 用户信息
    const user = store.state.user
    // 没登录 (严谨代码)
    if (!user || !user.token || !user.refresh_token) {
      return router.push(loginConfig)
    }
    try {
      // 发刷新token的请求
      // 注意：不是使用instance，已经拥有了一些配置，刷新请求不能使用这些配置
      const { data: { data } } = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${user.refresh_token}` // 合并refresh_token
        }
      })
      // res是响应对象  res.data.data.token 返回的token
      // 更新vuex和本地token  使用 mutations中的setUser即可
      store.commit('setUser', {
        token: data.token,
        refresh_token: user.refresh_token
      })
      // err函数中 返回一个promise(axios请求) 执行当前的promise
      // 继续发送之前失败的请求，instance({之前失败的请求配置})
      // 请求失败的请求配置参数 err.config
      return instance(err.config)
    } catch (e) {
      // 刷新token失败
      store.commit('delUser')
      return router.push(loginConfig)
    }
  }
  return Promise.reject(err)
})

// 导出一个调用接口的函数（接口地址，请求方式，传参）
// 调用接口函数，返回值是一个promise
export default (url, method, reqPrams) => {
  // params选项是get传参
  // data选项是其他请求方式的传参
  const config = {
    url,
    method,
    // []内可以写js表达式，js表达式运行结果必须是字符串（params|data）
    // 严谨处理 get GET Get 都认为是get
    [method.toLowerCase() === 'get' ? 'params' : 'data']: reqPrams
  }
  return instance(config)
}
