module.exports = {
  plugins: {
    autoprefixer: {},
    // rem适配插件  px转换成rem
    'postcss-pxtorem': {
      // 换算rem的基准值 标准设备iPhone6 宽度375
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
