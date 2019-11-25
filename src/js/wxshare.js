var msg = null;
var url = window.location.href;
$.ajax({
    url:'https://share.zhujianyun.com/WeChat/WxConfig.ashx?action=GetWxConfig&url='+ encodeURIComponent(url),
    type:'post',
    async: false,
    success:function(data){
        msg = data;
    }
})

callBack(JSON.parse(msg))

function callBack(data){
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature,// 必填，签名
        jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline'] // 必填，需要使用的JS接口列表
    });
    wx.ready(function () {
        // 在这里调用 API
        // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
        var obj = {
            "title": '中住数据智慧工地云平台 ', // 分享标题
            "link": url,
            "desc":'平台帮助企业由被动“监督”变为主动“监控”，帮工地由粗放式管理变为智能化管理',
            "imgUrl": 'https://share.zhujianyun.com/shareimg/share-zhzj.jpg', // 分享图标
        }
        wx.onMenuShareTimeline(obj);
        // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
        wx.onMenuShareAppMessage(obj);
    });
}
