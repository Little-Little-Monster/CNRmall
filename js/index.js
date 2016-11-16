$(function(){


	/*--------------------------本页面为首页index.html的文件---------------------------*/

	$.cookie.json = true;

/*复写final.js里的退出登陆（链接的路径和其他页面不同）*/
	$(".login-out").on("click",function(){
		$.cookie("Name","a",{"expires":-1,"path":"/"});
		$.cookie("Pwd","a",{"expires":-1,"path":"/"});
		$.cookie("islogin",false,{"expires":7,"path":"/"});
		window.location.href = "index.html";
	})


/*banner轮播效果*/
	var $img = $("#show img");
	var nowindex = 0,
		time1 = null;
	time1 = setInterval(move,5000);
	function move(){
		$img.css({"width":"1400px","height":"482px"});
		$img.hide();
		$img.eq(nowindex).show().animate({"width":"100%","height":"382px","margin-top":0},3000,function(){
			nowindex++;
			if(nowindex>=5){
				nowindex = 0;
			}
		});
		//实现小圆点切换
		$(".pages").children().removeClass("curr").addClass("norm").eq(nowindex).removeClass("norm").addClass("curr");		
	};

	//实现点击切换
	$(".pages").on("click","span",function(){
		clearInterval(time1);
		$img.eq(nowindex).finish();
		if(nowindex==$(this).index){
			return;
		}else{
			nowindex = $(this).index();
		}
		move();
		time1 = setInterval(move,5000)
	});


/*热卖切换轮播*/
	$(".show-prev").on("click",function(){
		$(".moveon").animate({"margin-left":-382},500);
	});
	$(".show-next").on("click",function(){
		$(".moveon").animate({"margin-left":0},500);
	});


/*热卖tab切换*/
	$(".main-live-sale p a").hover(function(){
		$(this).css({"background":"url(img/hove-a.gif) no-repeat center","color":"#FFF"})
				.siblings("a").css({"background":"#FFF","color":"#333"});
		var index = $(this).index(".main-live-sale p a");
		$(".main-live-show").eq(index).show().siblings(".main-live-show").hide();
	});


/*会员中心tab切换*/
	$(".table").on("click","span",function(){
		var index = $(this).index();
		$(".goodpro").eq(index).show().siblings(".goodpro").hide();
		$(this).find("a").css({"border":"2px solid red"}).end()
				.siblings().find("a").css({"border":0,});
	});


/*会员生日滚动轮播*/
 	var timeBir = null;
 	var birthIndex = 0;
 	timeBir = setInterval(birthMove,2000)
 	function birthMove(){
		$(".birth-in").animate({"top":-birthIndex*20},500,function(){
			birthIndex++;
			if(birthIndex==14){
				clearInterval(timeBir);
				$(".birth-in").css({"top":0});
				birthIndex=1;
				birthMove();
				timeBir = setInterval(birthMove,3000);
			}
		});
 	}


/*新品上市鼠标滑过效果*/
	$(".main-list li").on("mouseenter",function(){
		$(this).addClass("li-curr").find("p").show().end().siblings().removeClass("li-curr").find("p").hide();
		$(this).find(".float-right").css({"width":200});
		$(this).siblings().find(".float-right").css({"width":100});
	});


/*优惠活动轮播*/
	//显示按钮
	$(".play-ul").hover(function(){
		$(".main-live-ri i").show();
	},function(){
		$(".main-live-ri i").hide();
	});
	//自动轮播
	var time2 =null;
	var play_now = 0;
	var play_next =1;
		time2 =setInterval(move2,3000);
		function move2(){
			$(".play-ul li").eq(play_now).fadeOut(1000);
			$(".play-ul li").eq(play_next).fadeIn(1000);
			play_now=play_next;
			play_next++;
			if(play_next==5){
				play_next=0;
			}
			//圆点跟随
			$(".li-page span").css({"background":"#DDD"}).eq(play_now).css({"background":"orange"});
		}
	//点击跳转页面
	$(".li-page span").on("click",function(){
		clearInterval(time2);
		var index =$(this).index();
		play_next=index;
		// $(".play-ul li").eq(index).
		move2();
		time2 = setInterval(move2,3000);
	})  
	//点击上一页
	$(".play-prev").on("click",function(){
		clearInterval(time2);
		play_next-=2;
		move2();
		time2 = setInterval(move2,3000);
		if(play_next==-1){
			play_next=4;
		}
	});
	//点击下一页
	$(".play-next").on("click",function(){
		clearInterval(time2);
		move2();
		time2 = setInterval(move2,3000);
	});


/*品牌旗舰导航大图切换*/
	$(".qi-nav p").hover(function(){
		var index = $(this).index();
		$(this).css({"background":"#FFF url(img/bg-111.jpg) no-repeat left center","width":380})
				.addClass("on-curr").siblings().removeAttr("style").removeClass("on-curr");
		$(".qi-show img").eq(index).show().siblings().hide();
	});


/*品牌旗舰图片滑过遮罩切换*/
	$(".qi-option").hover(function(){
		$(this).find("b").css({"display":"none"}).end()
				.siblings().find("b").css({"display":"block"});
	},function(){
		$(".qi-option").children("b").css({"display":"none"});
	});


/*楼层导航*/
	//滚动显示/隐藏导航
	var winHeight = $(window).height(),
		topHeight = $(".main-live").offset().top,
		isMove = false;

	$(window).on("scroll",function(){
		if(!isMove){
			var scTop = $(this).scrollTop();
			if(scTop>=topHeight){
				$(".floor-nav").show(500);
			}else{
				$(".floor-nav").hide(500);
			}
			$(".floor").each(function(index,element){
				var _top = $(this).offset().top;
				if(scTop>=_top){
					$(".floor-nav li").removeClass("li-on").eq(index).addClass("li-on");
				}
			})
		}	
	});
	//点击楼层导航栏跳转
	$(".floor-nav li").on("click",function(){
		isMove = true;
		var index1 = $(this).index();
		$(".floor-nav li").each(function(index,element){
			$(element).removeAttr("class");
		});
		$(this).addClass("li-on");
		var topp = $(".floor").eq(index1).offset().top;
		$("html,body").animate({"scrollTop":topp},function(){
			isMove = false;
		});
	});


/*修改导航栏中购物车的图片路径*/
	$(window).on("load",function(){
		var products = $.cookie("products");
		$.each(products,function(index,element){
			var img = element.img;
				img = img.substring(3); 
			$(".nav-car-list dl:not(.list-demo)").eq(index).find("img").attr("src",img);
		});
		console.log("上一行的报错已通过复写图片中的src解决。(首页和点击加入购物车页面不在同一文件夹下，导致此页无法按照cookie存储的路径获取图片)");
		
		/*复写finl.js中点击导航栏结算按钮跳转连接地址*/
		$(".nav-car-info button").on("click",function(){
			window.location.href = "html/shopcar.html";
		});
	});
	
})