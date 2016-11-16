$(function(){


/*--------------------------本页面为确认订单付款pay.html的文件---------------------------*/


	$.cookie.json = true;

/*获取需要结算商品*/
	var needPay = $.cookie("needPay");
	var products = $.cookie("products");
	//将商品显示到页面
	$.each(needPay,function(index,element){
		$(".paytit").clone().appendTo(".pay-list").removeClass("paytit").addClass("payfor")
					.data("payone",element).css({"height":83,"background":"#FFF"})
					.find(".car-img").html("<a href='"+element.url+"'><img src='"+element.img+"'/></a>").end()
					.find(".car-name").html("<a href='"+element.url+"'>"+element.name+"</a><b>颜色："+element.color+"</b><b>规格："+element.size+"</b>").end()
					.find(".car-price").html("<i>￥</i><b>"+element.price+"</b>").end()
					.find(".car-score").html("<i>￥</i><b>0.00</b>").end()
					.find(".car-amount").html("<b style='color:red;'>"+element.amount+"</b>").end()
					.find(".car-delet").html("<b style='color:red;'>"+element.state+"</b>");	
	});
	payAll();


/*计算付款总金额*/
	function payAll(){
		var prices = 0;
		$.each(needPay,function(index,element){
			var amount = parseInt(element.amount);
			var price = parseFloat(element.price);
			prices += price*amount;
		});
		$(".pay-all b").text(prices.toFixed(2));
		$(".sunmit b").text(prices.toFixed(2));
	}


/*单击图片改变单选框状态*/
	$(".pay-ways p img").on("click",function(){
		var state = $(this).prev("input").prop("checked");
		$(this).prev("input").prop("checked",!state);
		$(this).parent().css({"border":"2px solid red"}).find("img").css({"border":0});
		$(this).parent().parent().siblings().children().css({"border":0}).find("img").css({"border":"1px solid #CCC"});
	});
	$(".pay-ways p input").on("click",function(){
		var state = $(this).prev("input").prop("checked");
		$(this).prev("input").prop("checked",!state);
		$(this).parent().css({"border":"2px solid red"}).find("img").css({"border":0});
		$(this).parent().parent().siblings().children().css({"border":0}).find("img").css({"border":"1px solid #CCC"});
	});
	$(".pay-ways>input").on("click",function(){
		$(".pay-ways p").css({"border":0}).find("img").css({"border":"1px solid #CCC"});
	});


/*点击关闭或则打开修改地址*/
	var ishide = true;
	$(".paylist2 .pay-tit span").on("click",function(){
		if(ishide){
			$(".pay-add").hide();
			$(".paylist2").css({"height":49});
			$(this).text("修改");
			ishide = false;
		}else{
			$(".pay-add").show();
			$(".paylist2").css({"height":332});
			$(this).text("关闭");
			ishide = true;
		}
	});


/*点击关闭或则打开订单备注*/
	var ishide2 = true;
	$(".paylist5 .pay-tit span").on("click",function(){
		if(ishide2){
			$(".pay-info").hide();
			$(".paylist5").css({"height":49});
			$(this).text("修改");
			ishide2 = false;
		}else{
			$(".pay-info").show();
			$(".paylist5").css({"height":212});
			$(this).text("关闭");
			ishide2 = true;
		}
	});


/*点击提交删除结算商品，同时删除购物车相应商品,并跳转到购物车*/
	$(".sunmit button").on("click",function(){
		$(needPay).each(function(index,element){
			var index = $.inArray(element,products);
				products.splice(index,1);
		});
		if(products.length==0){
			$.cookie("products",products,{"expires":-1,"path":"/"});
		}else{
			$.cookie("products",products,{"expires":7,"path":"/"});
		}
		needPay = [];
		$.cookie("needPay",needPay,{"expires":-1,"path":"/"});	
		//跳转
		window.location.href = "shopcar.html";
	});


/*城市级联菜单*/
	var province = [];
	$.get(
		// "http://127.0.0.1:8080/api/address",//fis3环境下模拟后台端口取数据
		"../mock/address.json",
		function(data){
			$.each(data.regions,function(index,element){
				var provinceName = element["name"];
				province[provinceName]=[];
				$.each(element.regions,function(index,element){
					var cityName = element.name;
					province[provinceName][cityName]=element.regions;
				});
			});
			//初始化省份
			initProvince();
		},
		"json"
	);

	//初始化省份
	function initProvince(){
		var html = "";
		for(provinname in province){
			html +="<option>"+provinname+"</option>";
		}
		$(".province").append($(html));
	}
	//初始化城市
	function initCity(){
		var html = "";
		var provin = province[$(".province").val()];
		$(".city").empty().append("<option value='-1'>选择城市</option>");
		for(cityname in provin){
			html += "<option>"+cityname+"</option>";
			$(".city").append($(html));
		}
		initDiscont();
	}
	//初始化区县
	function initDiscont(){
		var html = "";
		var city = province[$(".province").val()][$(".city").val()];
		$(".discont").empty().append("<option value='-1'>选择区县</option>");
		$.each(city,function(index,element){
			html += "<option>"+element.name+"</option>";
			$(".discont").append($(html));	
		})	
		
	}
	$(".province").on("change",initCity);
	$(".city").on("change",initDiscont);
});