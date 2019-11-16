<template>
  <div class='container'>
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="文章详情"></van-nav-bar>
  </div>
</template>

<script>
// 原生html元素组件acticle不能与html重名
export default {
  name: 'article-index'
}
</script>

<style scoped lang='less'></style>
