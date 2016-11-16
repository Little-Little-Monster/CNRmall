$(function(){


/*--------------------------本页面为所有页面共用的文件---------------------------*/


	$.cookie.json = true;
	var checName = $.cookie("Name");

/*打印相关信息*/
	console.log("当前登录用户名："+$.cookie("Name"));
	console.log("是否记住用户名和密码："+$.cookie("isrember"));
	console.log("是否自动登录："+$.cookie("islogin"));
	console.log("记住的用户名:"+$.cookie("remName"));
	console.log("记住的密码:"+$.cookie("remPwd"));
	console.log("购物车中的商品如下:");
	console.log($.cookie("products"));
	console.log("需要结算的商品如下:");
	console.log($.cookie("needPay"));


/*获取登陆信息*/
	if($.cookie("Name")){
		$(".hea-left").css({"width":450});
		$(".hea-right").css({"width":540});
		$(".hea-right>span").html('您好 <a href="#">'+$.cookie("Name")+'</a>，欢迎来到央广购物！ <b><a href="javascript:void(0)" class="login-out">退出</a>&nbsp;</b>');
	}


/*退出登陆*/
	$(".login-out").on("click",function(){
		$.cookie("Name","a",{"expires":-1,"path":"/"});
		$.cookie("Pwd","a",{"expires":-1,"path":"/"});
		$.cookie("islogin",false,{"expires":7,"path":"/"});
		window.location.href = "../index.html";
	})

/*----------------index---------------------*/
/*导航专题*/
	$(".nav-de li").hover(function(){
		$(this).find(".dh").show().end().find("a").css({
			"background": "#333",
			"opacity": 0.9,
			"filter": "alpha(opacity : 90)"
		});
	},function(){
		$(this).find(".dh").hide().end().children().eq(0).css({
			"background": "#f2dec3",
			"opacity": 1,
			"filter": "alpha(opacity : 100)"
		});
	});


/*动态加载导航栏购物车数量*/
	loadcar();
	function loadcar(){
		var products = $.cookie("products");//用于判断购物车是否有商品
		var checName = $.cookie("Name");//用于判断是否在登录状态
		if(products&&checName){
			if(!products){
				$(".car i").hide();
				$(".nav-car-list").hide();
				$(".car-empty").show();
				$(".nav-car-info").hide();
			}else{
				$(".nav-car-list dl").not(".list-demo").remove();
				$.each(products,function(index,element){
					$(".list-demo").clone().appendTo($(".nav-car-list")).removeAttr("class").removeAttr("style").data("product",element)
					.find("dt a").attr("href",element.url).find("img").attr("src",element.img).parents("dl")
					.find("dd>a").attr("href",element.url).text(element.name).next("p")
					.find("span").text(element.price).end().find("b").text(element.amount);
				});
				calTotal();
				$(".nav-car-list").show();
				$(".car-empty").hide();
				$(".nav-car-info").show();
			}
		}
		// 计算总金额函数
		function calTotal(){
			var prices = 0;
			var products = $.cookie("products");
			if(products){
				$.each(products,function(index,element){
					prices += element.price*element.amount;
				})
				$(".car-listall b").eq(0).text(products.length).end().eq(1).text("￥"+prices.toFixed(2));
				$(".car i").text(products.length);
			}else{
				$(".car-listall b").eq(0).text(0).end().eq(1).text("￥"+0);
				$(".car i").text(0);
			}
		};
		//鼠标滑过导航栏购物车，显示具体信息
		$(".car").hover(function(){
			$(".nav-car").show();
		},function(){
			$(".nav-car").hide();
		});	
		$(".nav-car").hover(function(){
			$(".nav-car").show();
		},function(){
			$(".nav-car").hide();
		});	
		//点击删除导航栏购物车信息
		$(".car-p a").on("click",function(){
			var product = $(this).parents("dl").data("product");
			var index = $.inArray(product,products);
				products.splice(index,1);
			if($(".nav-car-list dl").length==2){
				console.log("11");
				$(".nav-car-list").hide();
				$(".car-empty").show();
				$(".nav-car-info").hide();
				$.cookie("products",products,{"expires":-1,"path":"/"});
			}else{
				$.cookie("products",products,{"expires":7,"path":"/"});
			}
			$(this).parents("dl").remove();
			calTotal();
		});
		//点击导航栏结算按钮跳转
		$(".nav-car-info button").on("click",function(){
			window.location.href = "shopcar.html";
		});
		//判断高度超过一定值后隐藏	
	};

})

