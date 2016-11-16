$(function(){


/*--------------------------本页面为登陆login.html的文件---------------------------*/
	$.cookie.json = true;

	var isrem = false,
		islogin = false;


/*判断是否记住用户名和自动登录*/
if($.cookie("isrember")){
	$(".userpwd").val($.cookie("remPwd"));
	$(".username").val($.cookie("remName")).addClass("sure");
	$(".rember-user").prop("checked",true);
	if($.cookie("islogin")){
		$(".login-auto").prop("checked",true);
		window.location.href = "../index.html";
	}
}


/*帮助中心菜单显示*/
	$(".help-ul").hover(function(){
		$(".help-ul li").show();
		$(".help").css({"border": "solid 1px #e8e8e8"});
	},function(){
		$(".help-ul li:not(.help)").hide();
		$(".help").css({"border": 0});
	})


/*切换登陆方式*/
	$(".user-lo").on("click",function(){
		$(".login-in").show();
		$(".login-in-phone").hide();
		$(this).css({"height": 47,"background":"#FFF","border":"1px solid #CCC","border-bottom":0,"border-right":0});
		$(".phone-lo").css({"height": 45,"border":"1px solid #CCC","background": "#f5f5f5"})
	});
	$(".phone-lo").on("click",function(){
		$(".login-in").hide();
		$(".login-in-phone").show();
		$(this).css({"height": 47,"background":"#FFF","border":"1px solid #CCC","border-bottom":0,"border-left":0});
		$(".user-lo").css({"height": 45,"border":"1px solid #CCC","background": "#f5f5f5"})
	});


/*用户名登陆*/
	$(".username").on("blur",checkPhone);
	$(".btn-dl").on("click",function(){
		var userVal = $(".username").val();
		var pwdVal = $(".userpwd").val();
		if($(".username").hasClass("sure")){
			$.ajax({
				type:"post",
				url:"../check.php",
				data:{"type":"login","username":userVal,"pwd":pwdVal},
				success:function(data){
					console.log(data);
					var data = JSON.parse(data);
					if(!data){
						alert("用户名不存在或者密码错误");
						return;
					}else{
						//记住密码
						if($(".rember-user").prop("checked")){
							isrem = true;
							//用于保存登陆状态
							$.cookie("Name",userVal,{"path":"/"});
							$.cookie("Pwd",pwdVal,{"path":"/"});
							//用于记住密码
							$.cookie("remName",userVal,{"expires":7,"path":"/"});
							$.cookie("remPwd",pwdVal,{"expires":7,"path":"/"});
						}else{
							//用于保存登陆状态
							$.cookie("Name",userVal,{"path":"/"});
							$.cookie("Pwd",pwdVal,{"path":"/"});
							//用于忘记密码
							$.cookie("remName",userVal,{"expires":-1,"path":"/"});
							$.cookie("remPwd",pwdVal,{"expires":-1,"path":"/"});
						};
						//保存是否记住密码状态
						$.cookie("isrember",isrem,{"expires":7,"path":"/"});
						//自动登录
						if($(".login-auto").prop("checked")){
							islogin = true;
						}
						$.cookie("islogin",islogin,{"expires":7,"path":"/"});
						window.location.href = "../index.html";
					}
				}
			});
		}else{
			alert("请输入正确的电话号码");
		}	
	});


/*点击获取手机登陆动态验证码*/
    var mesCheck = "";
	$(".get-dongtai").on("click",function(){
		var time = null,
			num = 120;	
		time = setInterval(delay,1000);
		function delay(){
			num--;
			$(".get-dongtai").val(num+"秒后从新获取验证码");
			if(num<=0){
				clearInterval(time);
				$(".get-dongtai").val("获取动态验证码");
				$(".get-dongtai").removeAttr("disabled");
			}
		}
		$(this).prop("disabled",true);
		$(this).next("span").remove();
		$.ajax({
			type:"post",
			url:"../check.php",
			async:true,
			data:{"type":"getmessage"},
			success:function(data){
				var data = JSON.parse(data);
					mesCheck = data.info;
				$(".get-dongtai").after("<span style='color:green;margin-left:50px;'>(模拟短信)"+mesCheck+"</span>")
			},
			DataType:"json"
		});	
	});


/*手机快速登陆*/
	$(".username-phone").on("blur",checkPhone);
	$(".btn-dl-phone").on("click",function(){
		if($(".username-phone").hasClass("sure")){
			var pwd = JSON.parse($(".userpwd-phone").val());
			$.ajax({
				type:"post",
				url:"../check.php",
				data:{"type":"login-phone","pwd":pwd,"return":mesCheck},
				success:function(data){	
					var data = JSON.parse(data);
					console.log(data);
					if(data){
						$.cookie("Name",$(".username-phone").val(),{"path":"/"});
						console.log("ok");
						window.location.href = "../index.html";
					}
				},
				DataType:"json"
			})
		}	
	});


/*点击自动登陆，将记住密码改为选中*/
	$(".login-auto").on("click",function(){
		$(".rember-user").prop("checked",true);
		console.log("22");
	});


/*验证电话号码格式是否正确*/
	function checkPhone(){
		var userVal = $(this).val();
		var regPhone = /^1[34578]\d{9}$/;
		$(this).next("span").remove();
		if(regPhone.test(userVal)){
			$(this).addClass("sure");
		}else{
			$(this).after("<span style='color:red;margin-left:150px;'>请输入正确的电话号码</span>")
					.css({"margin-bottom":10});
			$(this).removeClass("sure");
		}
	};
});