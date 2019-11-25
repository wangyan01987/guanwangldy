$(function(){
    // 图片懒加载
    var imgs = document.querySelectorAll('img');
	var lazyload = function(){
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		var winTop = window.innerHeight;
		for(var i=0;i < imgs.length;i++){
			if(imgs[i].offsetTop < scrollTop + winTop ){
                if(imgs[i].src.indexOf('png')==-1&&imgs[i].src.indexOf('jpg')==-1){
                    imgs[i].src = imgs[i].getAttribute('data-src');
                }
			}
		}
    }
	function throttle(method,delay){
		var timer = null;
		return function(){
			var context = this, args=arguments;
			clearTimeout(timer);
			timer=setTimeout(function(){
				method.apply(context,args);
			},delay);
		}
	}
    window.onscroll = throttle(lazyload,200);
	lazyload()

	// tab
	$('.apply_content ul li').click(function(){
		$('.apply_content ul li').removeClass('active');
		$(this).addClass('active');
		var index = $(this).index()
		$('.tab_item').hide();
		$('.tab_item').eq(index).show();
	})
	//nav
	$('.nav>li>a').click(function(){
		$('.nav>li>a').removeClass('active_nav')
		$(this).addClass('active_nav');

	})
	//滚动监听
	$(document).scroll(function() {
        var scroH = $(document).scrollTop();  //滚动高度
		var bannerH = $('#banner').height();  //可见高度
		if(scroH>=bannerH){
			$('.topbar').css('background','#fff')
			$('#1ogo_img').attr('src','./src/images/logo2.png')
			$('.logo').find('b').css('background','#333').siblings('span').css('color','#333')
		}else{
			$('.topbar').css('background','none')
			$('#1ogo_img').attr('src','./src/images/logo.png')
			$('.logo').find('b').css('background','#c1c4cb').siblings('span').css('color','#c1c4cb')
		}
		if(scroH>500){
			$('#goTop').show();
		}else{
			$('#goTop').hide();
		}
	});

	// 弹窗
	 // 省市
	 var province = getAddress().provinces;
	 var city = getAddress().citys;
	 $('#province').html('');
	 $.each(province,function(i,item){
		 $('#province').append('<option value="'+item+'">'+item+'</option>');
	 })
	 $('#province').change(function(){
		 var provinceText = $(this).val();
		 $('#city').html('');
		 $.each(city[province.indexOf(provinceText)],function(i,item){
			 $('#city').append('<option value="'+item+'">'+item+'</option>');
		 })
		 $('#province,#city').removeClass('has-er')
	 })
	 $('#submitBtn').click(function(){
		 // 验证
		 var isR = true;
		 var companyName = $('#companyName').val();
		 if(!isVal(companyName)){
			 $('#companyName').addClass('has-er');
			 isR = false;
		 }
		 var province = $('#province').val();
		 if(province=='请选择省'){
			 $('#province').addClass('has-er');
			 isR = false;
		 }
		 var city = $('#city').val();
		 if(city==''||city=='请选择市'){
			 $('#city').addClass('has-er');
			 isR = false;
		 }
		 var contact = $('#contact').val();
		 if(!isMix(contact)){
			 $('#contact').addClass('has-er');
			 isR = false;
		 }
		 var mobile = $('#mobile').val();
		 if(!isOnlyMobile(mobile)){
			 $('#mobile').addClass('has-er');
			 isR = false;
		 }
		 var email = $('#email').val();
		 if(email!=''&&!isEmail(email)){
			 $('#email').addClass('has-er');
			 isR = false;
		 }
		 if(!isR){
			 $('#ts-text').text('所填表单有错，请检查后再次提交')
			 $('#smallModal').modal('show');
			 setTimeout(function(){
				 $('#smallModal').modal('hide');
			 },1000)
			 return;
		 }
		 $.ajax({
			 type:'post',
			 url:'http://szst.zhujianyun.com:8010/api/ExtensionInfoApi/SaveExtensionInfo',
			 data:{
				 "EnterpriseName": companyName,
				 "Address": province+city,
				 "ContactsName": contact,
				 "Mobile": mobile,
				 "Email": email,
				 "Type_Flag":1
			 },
			 success:function(data){
				 if(data.code=='000000'){
					 $('#myModal').modal('hide');
					 initForm();
					 $('#ts-text').text('申请成功')
					 $('#smallModal').modal('show');
					 setTimeout(function(){
						 $('#smallModal').modal('hide');
					 },1000)
				 }
			 }

		 })
	 })
	 // 失去焦点验证
	 $('#companyName').blur(function(){
		 if($(this).val()!=''){
			 $(this).removeClass('has-er');
		 }
	 })
	 $('#contact').blur(function(){
		 if(isMix($(this).val())){
			 $(this).removeClass('has-er');
		 }
	 })
	 $('#mobile').blur(function(){
		 if(isOnlyMobile($(this).val())){
			 $(this).removeClass('has-er');
		 }
	 })
	 $('#email').blur(function(){
		 if($(this).val()!=''){
			 if(isEmail($(this).val())){
				 $(this).removeClass('has-er');
			 }
		 }else{
			 $(this).removeClass('has-er');
		 }
	 })


	 $('#myModal').on('shown.bs.modal', function (e) {
		 return;
		 // 关键代码，如没将modal设置为 block，则$modala_dialog.height() 为零
		 $(this).css('display', 'block');
		 var modalHeight=$(window).height() / 2 - $('#myModal .modal-dialog').height() / 2;
		 $(this).find('.modal-dialog').css({
			 'margin-top': modalHeight
		 });
	 });
	 function initForm(){
		 $('.modal-body').find('input').val('').removeClass('has-er');
		 $('.modal-body').find('select').removeClass('has-er');
		 $('#province').val('请选择省');
		 $('#city').html('<option value="请选择市">请选择市</option>')
	 }


	 $('#myModal').on('hide.bs.modal', function () {
		 // 执行一些动作...
		 initForm();
	 })

	//  返回顶部
	$('#goTop').click(function(){
        $('body,html').animate({scrollTop:0},1000);
        return false;
    })
    var clientW = $(window).width();
    if(clientW>1000){
        // 百度分享
        window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"1","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"16"},"slide":{"type":"slide","bdImg":"1","bdPos":"right","bdTop":"83.33331298828125"}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];
    }else{
    	$('#banner').attr('src','./src/images/banner_mobile.jpg')
	}

})


function getAddress() {
    var obj = {};

    //省份信息
    var provinces = ['请选择省', '北京市', '上海市', '天津市', '重庆市', '河北省', '山西省', '内蒙古省', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西省', '海南省', '四川省', '贵州省', '云南省', '西藏省', '陕西省', '甘肃省', '宁夏省', '青海省', '新疆省', '香港', '澳门', '台湾'];
    //城市信息
    var citys = [
        ['请选择市'],
        ["东城区", "西城区", "崇文区", "宣武区", "朝阳区", "海淀区", "丰台区", "石景山区", "房山区", "通州区", "顺义区", "昌平区", "大兴区", "怀柔区", "平谷区", "门头沟区", "密云区", "延庆区"],
        ["黄浦区", "卢湾区", "徐汇区", "长宁区", "静安区", "普陀区", "虹口区", "杨浦区", "闵行区", "宝山区", "嘉定区", "浦东新区", "金山区", "松江区", "青浦区", "南汇区", "奉贤区", "崇明县"],
        ["和平区", "河东区", "河西区", "南开区", "河北区", "红桥区", "塘沽区", "汉沽区", "大港区", "东丽区", "西青区", "津南区", "北辰区", "武清区", "宝坻区", "宁河县", "静海县", "蓟县"],
        ["万州区", "涪陵区", "渝中区", "大渡口区", "江北区", "沙坪坝区", "九龙坡区", "南岸区", "北碚区", "万盛区", "双桥区", "渝北区", "巴南区", "黔江区", "长寿区", "綦江县", "潼南县", "铜梁县", "大足县", "荣昌县", "璧山县", "梁平县", "城口县", "丰都县", "垫江县", "武隆县", "忠县", "开县", "云阳县", "奉节县", "巫山县", "巫溪县", "石柱土家族自治县", "秀山土家族苗族自治县", "酉阳土家族苗族自治县", "彭水苗族土家族自治县", "江津市", "合川市", "永川市", "南川市"],
        ["石家庄市", "张家口市", "承德市", "秦皇岛市", "唐山市", "廊坊市", "保定市", "衡水市", "沧州市", "邢台市", "邯郸市"],
        ["太原市", "朔州市", "大同市", "阳泉市", "长治市", "晋城市", "忻州市", "晋中市", "临汾市", "吕梁市", "运城市"],
        ["呼和浩特市", "包头市", "乌海市", "赤峰市", "通辽市", "呼伦贝尔市", "鄂尔多斯市", "乌兰察布市", "巴彦淖尔市", "兴安盟", "锡林郭勒盟", "阿拉善盟"],
        ["沈阳市", "朝阳市", "阜新市", "铁岭市", "抚顺市", "本溪市", "辽阳市", "鞍山市", "丹东市", "大连市", "营口市", "盘锦市", "锦州市", "葫芦岛市"],
        ["长春市", "白城市", "松原市", "吉林市", "四平市", "辽源市", "通化市", "白山市", "延边州"],
        ["哈尔滨市", "齐齐哈尔市", "七台河市", "黑河市", "大庆市", "鹤岗市", "伊春市", "佳木斯市", "双鸭山市", "鸡西市", "牡丹江市", "绥化市", "大兴安岭地区"],
        ["南京市", "徐州市", "连云港市", "宿迁市", "淮安市", "盐城市", "扬州市", "泰州市", "南通市", "镇江市", "常州市", "无锡市", "苏州市"],
        ["杭州市", "湖州市", "嘉兴市", "舟山市", "宁波市", "绍兴市", "衢州市", "金华市", "台州市", "温州市", "丽水市"],
        ["合肥市", "宿州市", "淮北市", "亳州市", "阜阳市", "蚌埠市", "淮南市", "滁州市", "马鞍山市", "芜湖市", "铜陵市", "安庆市", "黄山市", "六安市", "巢湖市", "池州市", "宣城市"],
        ["福州市", "南平市", "莆田市", "三明市", "泉州市", "厦门市", "漳州市", "龙岩市", "宁德市"],
        ["南昌市", "九江市", "景德镇市", "鹰潭市", "新余市", "萍乡市", "赣州市", "上饶市", "抚州市", "宜春市", "吉安市"],
        ["济南市", "青岛市", "聊城市", "德州市", "东营市", "淄博市", "潍坊市", "烟台市", "威海市", "日照市", "临沂市", "枣庄市", "济宁市", "泰安市", "莱芜市", "滨州市", "菏泽市"],
        ["郑州市", "开封市", "三门峡市", "洛阳市", "焦作市", "新乡市", "鹤壁市", "安阳市", "濮阳市", "商丘市", "许昌市", "漯河市", "平顶山市", "南阳市", "信阳市", "周口市", "驻马店市", "济源市"],
        ["武汉市", "十堰市", "襄樊市", "荆门市", "孝感市", "黄冈市", "鄂州市", "黄石市", "咸宁市", "荆州市", "宜昌市", "随州市", "省直辖县级行政单位", "恩施州"],
        ["长沙市", "张家界市", "常德市", "益阳市", "岳阳市", "株洲市", "湘潭市", "衡阳市", "郴州市", "永州市", "邵阳市", "怀化市", "娄底市", "湘西州"],
        ["广州市", "深圳市", "清远市", "韶关市", "河源市", "梅州市", "潮州市", "汕头市", "揭阳市", "汕尾市", "惠州市", "东莞市", "珠海市", "中山市", "江门市", "佛山市", "肇庆市", "云浮市", "阳江市", "茂名市", "湛江市"],
        ["南宁市", "桂林市", "柳州市", "梧州市", "贵港市", "玉林市", "钦州市", "北海市", "防城港市", "崇左市", "百色市", "河池市", "来宾市", "贺州市"],
        ["海口市", "三亚市", "省直辖县级行政单位"],
        ["成都市", "广元市", "绵阳市", "德阳市", "南充市", "广安市", "遂宁市", "内江市", "乐山市", "自贡市", "泸州市", "宜宾市", "攀枝花市", "巴中市", "达州市", "资阳市", "眉山市", "雅安市", "阿坝州", "甘孜州", "凉山州"],
        ["贵阳市", "六盘水市", "遵义市", "安顺市", "毕节地区", "铜仁地区", "黔东南州", "黔南州", "黔西南州"],
        ["昆明市", "曲靖市", "玉溪市", "保山市", "昭通市", "丽江市", "思茅市", "临沧市", "德宏州", "怒江州", "迪庆州", "大理州", "楚雄州", "红河州", "文山州", "西双版纳州"],
        ["拉萨市", "那曲地区", "昌都地区", "林芝地区", "山南地区", "日喀则地区", "阿里地区"],
        ["西安市", "延安市", "铜川市", "渭南市", "咸阳市", "宝鸡市", "汉中市", "榆林市", "安康市", "商洛市"],
        ["兰州市", "嘉峪关市", "白银市", "天水市", "武威市", "酒泉市", "张掖市", "庆阳市", "平凉市", "定西市", "陇南市", "临夏州", "甘南州"],
        ["西宁市", "海东地区", "海北州", "海南州", "黄南州", "果洛州", "玉树州", "海西州"],
        ["银川市", "石嘴山市", "吴忠市", "固原市", "中卫市"],
        ["乌鲁木齐市", "克拉玛依市", "自治区直辖县级行政单位", "喀什地区", "阿克苏地区", "和田地区", "吐鲁番地区", "哈密地区", "克孜勒苏柯州", "博尔塔拉州", "昌吉州", "巴音郭楞州", "伊犁州", "塔城地区", "阿勒泰地区"],
        ["香港"],
        ["澳门"],
        ["台北市", "高雄市", "台中市", "花莲市", "基隆市", "嘉义市", "金门市", "连江市", "苗栗市", "南投市", "澎湖市", "屏东市", "台东市", "台南市", "桃园市", "新竹市", "宜兰市", "云林市", "彰化市"]];

    obj.provinces = provinces;
    obj.citys = citys;
    return obj;
}

//1-50 中文字母数字组合
function isMix(val) {
    var str = val.trim();
    var reg = /^[\u4e00-\u9fa5]|[a-zA-Z0-9]{1,50}$/;
    if (str.length != 0) {
        if (!reg.test(str)) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};
//纯移动手机验证
function isOnlyMobile(val) {
    var str = val.trim();
    if (str.length != 0) {
        var reg = /^[1][3,4,5,7,8,6][0-9]{9}$/;
        if (reg.test(str)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};
//邮箱验证
function isEmail(val) {
    var str = val.trim();
    if (str.length != 0) {
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if (!reg.test(str)) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};

//空字符验证
function isVal(val) {
    if (val == null || val == undefined || val == "" || val == NaN) {
        return "";
    } else {
        if ((typeof val) == 'string') {
            val = val.replace(/(^\s+)|(\s+$)/g, "");
        }
        return val;
    }
};
