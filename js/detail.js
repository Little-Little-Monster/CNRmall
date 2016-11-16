$(function(){


/*--------------本页面为商品详情detail.html,detail2.html,detail3.html,detail4.htm共用的文件------------------*/


	$.cookie.json = true;
	var checName = $.cookie("Name");//用于判断是否在登录状态
/*放大镜功能*/
	//鼠标滑过放大镜出现
	$(".glass-out").hover(function(){
		$(".glass").show();
		$(".info-detail").hide();
		$(".big-glass").show();
	},function(){
		$(".glass").hide();
		$(".info-detail").show();
		$(".big-glass").hide();
	}).on("mousemove",function(event){
		var gl_x = event.pageX,
			gl_y = event.pageY,
			// gl_top = $(".glass").offset().top,
			// gl_left = $(".glass").offset().left,
			glHeight = $(".glass").outerHeight(),
			glWidth = $(".glass").outerWidth();
		$(".glass").offset({
			"left":gl_x-(glWidth/2),
			"top":gl_y-(glHeight/2)
		})
		//判断出框条件
		var gl_top = $(".glass").position().top,
			gl_left = $(".glass").position().left;
		if(gl_top<0){
			gl_top=0;
		}
		if(gl_left<0){
			gl_left=0;
		}
		if(gl_left>$(".glass-out").width()-glWidth){
			gl_left=$(".glass-out").width()-glWidth;
		}
		if(gl_top>$(".glass-out").height()-glHeight){
			gl_top=$(".glass-out").height()-glHeight;
		}
		$(".glass").css({
			"top":gl_top,
			"left":gl_left
		})
		// 展示放大的图片
		var size = $(".glass-out").width()/$(".glass").width();
		$(".big-glass img").css({
			"width":$(".glass-out").width()*size,
			"height":$(".glass-out").height()*size,
			"top":-gl_top*size,
			"left":-gl_left*size
		});
	});


/*点击切换放大镜图片及选中颜色*/
var $gOutImg = $(".glass-out img"),
	$iPicIng = $(".info-picli img"),
	$iProA = $(".info-pro-color>a");
	$iPicIng.on("click",function(){
		var index = $(this).index();
		$(this).css({"border":"1px solid orange"}).addClass("ok").siblings().css({"border":"1px solid #CCC"}).removeClass("ok");
		$gOutImg.eq(index).show().siblings().hide();
		$(".big-glass img").eq(index).show().siblings().hide();
	});


/*点击选中颜色尺寸*/
	$iProA.on("click",function(){
		$(this).css({"background":"url(../img/sc_bg.jpg) no-repeat right bottom"}).addClass("ok")
		.siblings().css({"background":"none"}).removeAttr("class");
		var index = $(this).index();
		$iPicIng.eq(index).click();
	});
	$(".info-pro-size>a").on("click",function(){
		$(this).css({"background":"url(../img/sc_bg.jpg) no-repeat right bottom"}).addClass("ok")
		.siblings().css({"background":"none"}).removeAttr("class");
	});
	//数量加减
	$(".jian").on("click",function(){
		var amount = $(".amount").val();
		if(amount==1){
			amount=1;
		}else{
			amount--
		}
		$(".amount").val(amount);
	});
	$(".add").on("click",function(){
		var amount = $(".amount").val();
			amount++	
		$(".amount").val(amount);
	});
	//修改数量
	$(".amount").on("blur",function(){
		var amount = $(this).val();
		var reg = /^[1-9]\d*$/;
		if(reg.test(amount)){
			$(".amount").val(amount);
		}else{
			alert("请输入正确的商品数量");
			$(".amount").val("1");
		}
	});
	//选择地区
	var address = [];
	$.getJSON(
		"../mock/address.json",
		function(data){
			var provinces = data.regions;
			$.each(provinces,function(index,province){
				var cities = province.regions;
				address[province.name] = [];
				$.each($(cities),function(index,city){
					var condition = city.regions;
					address[province.name][city.name] = condition;
				});
				//初始化省份
				initProvince();
			})
		}
	);
	function initProvince(){
		var html = "";
		$("#province").empty().append("<option value='-1'>选择省份</option>");
		for (var province in address){
			html += "<option>"+province+"</option>";	
		}
		$("#province").append($(html));
	};
	//加载区县
	function initCity(){
		var html = "";
		var val = $("#province").val();
		var citiesName = address[val];
		$("#city").empty().append("<option value='-1'>选择城市</option>");
		for(var city in citiesName){
			html += "<option>"+city+"</option>";
		}
		$("#city").append(html);
		$(".info-pro-address span").remove();
	}		
	$("#province").on("change",initCity);
	$("#city").on("change",function(){
		$(".info-pro-address span").remove();
		//随机产生数据模拟有无库存
		var num = Math.floor(Math.random()*10);
		if(num<=5){
			var state = "<span style='color:green'>现货</span>"
		}else{
			var state = "<span style='color:red'>无货</span>"
		}
		$(state).appendTo($(".info-pro-address"));
	});


/*点击加入购物车，保存商品*/
	$(".join").on("click",function(){
		if(checName){
			//判断是否登录
			var name = $(".pro-name").text(),
			id = $(".pro-id").text(),
			size = $(".info-pro-size").find(".ok").text(),
			color = $(".info-pro-color").find(".ok").text(),
			price = $(".pro-price").text(),
			amount = parseInt($(".amount").val()),
			state = $(".info-pro-address span").text(),
			img = $(".info-picli").find(".ok").attr("src");

			if(state){//判断是否选择配货地址
				if(state=="现货"){//如果商品有货
					var products = [];
					var product = {
						"id":id,
						"name": name,
						"size":size,
						"color":color,
						"price":price,
						"img":img,
						"amount":amount,
						"state":state,
						"url":window.location.href
					}
					var products = $.cookie("products");
					if(!products){
						products = [];
					}
					var index = getIndex(products);
					if(index==-1){//当前商品不在购物车中
						products.push(product);
					}else{
						var count = parseInt(products[index].amount);
							count = count + amount;
						products[index].amount = count;
					}
					//得到当前商品id是否已在cookie中，并返回其索引值
					function getIndex(products){
						var inde = -1;
						$.each(products,function(index,element){
							if(this.id==id){
								if(this.color==color&&this.size==size){
									inde = index;
									return;
								}		
							}
						});
						return inde;
					}
					$.cookie("products",products,{"expires":7,"path":"/"});

					loadcar();//重新加载导航栏中的购物车信息

					if(products&&checName){
						if(products.lenght==0){
							$(".car i").hide();
						}else{
							$(".car i").show().text(products.length);	
						}
						alert("成功加入购物车！");
					}	
					// console.log($.cookie("products"));
				}else{
				//商品无库存
					alert("加入失败，商品已无库存");
				}	
			}else{
				alert("加入失败，请选配货地址");
			}
		}else{
			alert("请先登录");
			window.location.href = "login.html";
		}		
	});	

/*加载导航栏中的购物车信息的函数*/
function loadcar(){
	var products = $.cookie("products");//用于判断购物车是否有商品
	var checName = $.cookie("Name");//用于判断是否在登录状态
	console.log(products);
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
		}
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
	//删除导航栏购物车
	$(".car-p a").on("click",function(){
		var product = $(this).parents("dl").data("product");
		var index = $.inArray(product,products);
			products.splice(index,1);
			console.log($(".nav-car-list dl").length);
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
};

	
/*详情选项卡切换*/
	$(".just-click a").eq(0).on("click",function(){
		$(this).addClass("disc-curr").siblings().removeAttr("class");
		// $(".pro-show").children(":not(.saled-server)").show();
		
		$(".pro-show").children().show();
		$(".saled-server").hide();


		$(".pro-assess").removeClass("pro-show-acc");
		$(".pro-assess-dl").eq(2).addClass("one-last");
	});

	$(".just-click a").eq(1).on("click",function(){
		$(".pro-show").children(":not(.saled-server)").show();
		$(".disc-detail").hide();
		$(".tobuy").hide();
		$(".no-click").hide();
		$(".pro-assess").addClass("pro-show-acc");
		$(".one-last").removeClass("one-last");
		$(this).addClass("disc-curr").siblings().removeAttr("class");
	});
	$(".just-click a").eq(2).on("click",function(){
		$(this).addClass("disc-curr").siblings().removeAttr("class");
		$(".pro-show").children(":not(.saled-server)").show();
		$(".pro-show").children(":not(.rank-list,.tv-hot,.recnet-pro,.tobuy,.show-ad,.just-click)").hide();
	});
	$(".just-click a").eq(3).on("click",function(){
		$(this).addClass("disc-curr").siblings().removeAttr("class");
		$(".pro-show").children().show()
		$(".pro-show").children(":not(.rank-list,.tv-hot,.recnet-pro,.saled-server,.show-ad,.just-click)").hide();
	});


/*返回顶部*/
	$("#go-top").on("click",function(){
		$(window).scrollTop(0);
	});
	$(window).on("scroll",function(){
		if($(this).scrollTop()>500){
			$("#go-top").show();
		}else{
			$("#go-top").hide();
		}
	});
	
	
})
