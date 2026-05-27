Page({
  data: {
    // 替换为你备案后的域名地址
    url: 'https://moneyapk.vercel.app'
  },

  onMessage(e) {
    // 接收网页发来的消息（可选）
    console.log('收到网页消息:', e.detail.data)
  }
})
