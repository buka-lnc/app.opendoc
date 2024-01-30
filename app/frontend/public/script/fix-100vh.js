/**
 * 修复IOS 100vh问题
 */
if (document) {
  // window.navigator.standalone 判断是否是ios的PWA
  if ((window.navigator.standalone)) {
    // PWA下需要设定100vh才能获取到正确的高度
    const styles = `html, body { height: 100vh; }`
    const styleSheet = document.createElement('style')
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
  } else {
    // 非PWA下需要设定100%才能获取到正确的高度
    // 设定100vh在ios下会导致页面出现滚动条
    const styles = `html, body { height: 100%; }`
    const styleSheet = document.createElement('style')
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
  }
}
