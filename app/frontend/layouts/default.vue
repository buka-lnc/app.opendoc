<script setup lang="ts">
useHead({
  script: [
    {
      src: '/script/fix-100vh.js',
    },
    {
      innerHTML: 'window.Prism={manual:true};',
    },
  ],
})
</script>
<template>
  <div class="w-full !h-full">
    <Head>
      <Title>OpenDoc</Title>
      <!-- <Script src="/script/fix-100vh.js" /> -->

      <!-- <Link rel="preload" href="/fonts/unifontexmono.woff2" as="font" crossorigin="anonymous" /> -->

      <Link rel="icon" href="/favicon.ico" />
      <Link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <!-- <Link ref="mask-icon" color="#" -->

      <!-- 设置主题色 -->
      <Meta name="theme-color" content="#fff" />

      <Meta charset="utf-8" />
      <Meta name="author" content="Val.istar.Guo, val.istar.guo@gmail.com" />
      <Meta name="robots" content="index,follow" />
      <Meta name="format-detection" content="telephone=no, email=no" />
      <Meta name="rating" content="general" />
      <Meta name="copyright" content="val.istar.guo@gmail.com" />

      <Meta name="viewport" content="width=device-width, initial-scale=1,viewport-fit=cover" />

      <Link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="/api/rss/feed" />

      <!-- 当网站添加到主屏幕，可以隐藏地址栏 -->
      <Meta name="apple-mobile-web-app-capable" content="yes" />
      <Meta name="mobile-web-app-capable" content="yes" />
      <!-- 启动Web App全屏模式，删除工具栏和菜单栏 -->
      <Meta name="apple-touch-fullscreen" content="yes" />
      <Meta name="full-screen" content="yes" />
      <Meta name="x5-fullscreen" content="true" />
      <Meta name="browsermode" content="application" />
      <Meta name="x5-page-mode" content="app" />
      <!-- 设置苹果工具栏颜色 -->
      <!-- <Meta name="apple-mobile-web-app-status-bar-style" content="default" /> -->
      <Meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <!-- 添加主屏幕后的标题 -->
      <Meta name="apple-mobile-web-app-title" content="VBlog" />
      <!-- 添加只能App广告条 -->
      <!-- <Meta name="apple-itunes-app" content="app-id=123456" /> -->
      <!-- 禁止百度转码 -->
      <Meta name="Cache-Control" content="no-siteapp" />
      <!-- 针对手持设备优化 -->
      <Meta name="HandheldFriendly" content="true" />
      <!-- 强制竖屏 -->
      <Meta name="screen-orientation" content="portrait" />
      <Meta name="x5-orientation" content="portrait" />
    </Head>

    <slot />
  </div>
</template>
