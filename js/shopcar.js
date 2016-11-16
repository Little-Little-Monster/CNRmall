$(function(){

	/*--------------------------本页面为购物车shopcar.html的文件---------------------------*/

	$.cookie.json = true;
	var products = $.cookie("products");//用于判断购物车是否有商品
	var checName = $.cookie("Name");//用于判断是否在登录状态

	if(products&&checName){
		$(".empty").hide();
		$(".car-ad").hide();
		$(".car-more").show();
		$(".car-tit").find($(".car-score")).html("优惠");

		//循环显示cookie 中的商品
		$.each(products,function(index,element){
			$(".car-tit").clone().appendTo($(".car-list")).removeClass("car-tit")
			.addClass("cars").data("product",element).css({"height":83,"background":"#FFF"})
			.find(".car-img").html("<a href='"+element.url+"'><img src='"+element.img+"'/></a>").end()
			.find(".car-name").html("<a href='"+element.url+"'>"+element.name+"</a><b>颜色："+element.color+"</b><b>规格："+element.size+"</b>").end()
			.find(".car-amount").html("<button class='moves'>-</button><input type='text' value='"+element.amount+"'/><button class='adds'>+</button>").end()
			.find(".car-price").html("<i>￥</i><b>"+element.price+"</b>").end()
			.find(".car-score").html("<i>￥</i><b>0.00</b>").end()
			.find(".car-delet").html("<a class='delet-one' href='javascript:void(0)'>删除</a>").end()
			.find(".car-check").removeClass("check-all").html("<input type='checkbox' />");
		});
		$(".check-all").removeClass("car-check");
		calAll();

		//操作购物车
		//修改数量
		$(".car-amount input").on("blur",function(){
			var product = $(this).parents(".cars").data("product");	
			var amount = $(this).val();
			var reg = /^[1-9]\d*$/;

			if(reg.test(amount)){
				//更新页面和cookie信息
				update($(this),amount);
			}else{
				alert("请输入正确的商品数量");
				$(this).val(product.amount);
			}
			calAll();
		});
		//数量减一
		$(".moves").on("click",function(){
			var amount = parseInt($(this).next().val());
				amount--;
				// console.log(amount);
			update($(this),amount);
			calAll();
		});
		//数量加一
		$(".adds").on("click",function(){
			var amount = parseInt($(this).prev().val());
				amount++;
				// console.log(amount);
			update($(this),amount);
			calAll();
		});
		//删除单行
		$(".delet-one").on("click",function(){
			//删除cookie
			var product = $(this).parents(".cars").data("product");
			var index = $.inArray(product,products);
				products.splice(index,1);
			$.cookie("products",products,{"expires":7,"path":"/"});
			$(this).parents(".cars").remove();
			calAll()
		});
		//删除选中
		$(".delet-check").on("click",function(){
			var isDelall =checkDel();
			function checkDel(){
				var isall = true;
				$(".car-check input").each(function(index,element){
					if($(this).prop("checked")){
						var product = $(this).parents(".cars").data("product");
						var index = $.inArray(product,products);
							products.splice(index,1);
						$.cookie("products",products,{"expires":7,"path":"/"});
						$(this).parents(".cars").remove();
					}else{
						isall = false;
					}
				});
				return isall;
			}
			if(isDelall){
				$(".cal-all a").click();
			}
			calAll();
		});
		//全选
		$(".check-all input").on("click",function(){
			var che = $(this).prop("checked");
			// console.log(che);
			$(".car-check input").each(function(){
				$(this).prop("checked",che);
			});
			calAll();
		});
		//全部删除
		$(".cal-all a").on("click",function(){
			products = [];
			$(".cars").each(function(){
				$(this).remove();
			});
			// jiesuan();
			$.cookie("products",products,{"expires":-1,"path":"/"});
			window.location.href = "shopcar.html";
		});
		//点击选中计算总计
		$(".car-check input").on("click",function(){
			calAll();
		});
		//封装的实现页面，cookie数量更新的函数
		function update($element,amount){
			var product = $element.parents(".cars").data("product");
			if(amount<=1){
				amount = 1;
			}
			//页面更新
			$element.parents(".cars").find(".car-amount input").val(amount);
			//更新cookie
			product.amount = amount;
			$.cookie("products",products,{"expires":7,"path":"/"});
		}
		//封装函数计算总结算金额
		function calAll(){
			var prices = 0;
			$calcal = $(".car-check input");
			$.each($calcal,function(index,element){
				if($(this).prop("checked")){
					var product = $(this).parents(".cars").data("product");
					var amount = parseInt(product.amount);
					var price = parseFloat(product.price);
					prices += price*amount;
				}
			});
			$(".cal-all b").text(prices.toFixed(2));
		}
		//点击结算存储需要结算的商品
		$(".pay-more>a").on("click",jiesuan);
		function jiesuan(){
			var needPay = [];
			$pay = $(".car-check input");
			$.each($pay,function(index,element){
				if($(this).prop("checked")){
					var product = $(this).parents(".cars").data("product");
					needPay.push(product);
				}
			});
			if(needPay.length!=0){
				$.cookie("needPay",needPay,{"expires":7,"path":"/"});
				window.location.href="pay.html";
			}else{
				alert("请勾选您需要结算的商品");
			}
		}	
	}else if(!checName){
		alert("请先登录");
		window.location.href = "login.html";
	}
});