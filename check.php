<?php
	$type = $_POST["type"];
	if(isset($type)){//存在未true
			
		if($type == "checkusername"){
			$flag = false;
			$username = $_POST["username"];
			$json = file_get_contents("mock/user1.json"); //获取user1.json里的数据 json格式
			$arr_json = json_decode($json,true);//将json格式的数据转化为数组类型的数据
				
			for($i=0;$i<count($arr_json);$i++){ //获取数组长度
				if($arr_json[$i]["name"] == $username){
					$flag = true;
				}
			}
			echo json_encode($flag); //echo 返回前台的值  json_encode 将数组类型转换为json类型的数据
		}
		
		//请求验证码
		if($type=="getyanzheng"){
			$return = "";
			$json = file_get_contents("mock/yan.json");
			$arr_json = json_decode($json,true);
			$num =rand(0,4);
			$return = $arr_json[$num];
			echo json_encode($return);
		}
		//获取短信验证码或者短信动态密码
		if($type=="getmessage"){
			$return = "";
			$json = file_get_contents("mock/message.json");
			$arr_json = json_decode($json,true);
			$num =rand(0,9);
			$return = $arr_json[$num];
			echo json_encode($return);
		}
		//注册
		if($type == "insert"){
			$flag = true;
			$username = $_POST["username"];
			$password = $_POST["password"];
			
			$array = array("name" => $username,"pwd" => $password);
			
			$json = file_get_contents("mock/user1.json");
			$arr_json = json_decode($json,true);
			
			array_push($arr_json,$array);
			
			$json = json_encode($arr_json);
			file_put_contents("mock/user1.json",$json);
			
			echo json_encode($flag);
			
		}
		//用户名登陆
		if($type == "login"){
			$flag = false;
			$name = $_POST["username"];
			$pwd = $_POST["pwd"];
			
			$json = file_get_contents("mock/user1.json");
			$arr_json = json_decode($json,true);
			
			for($i=0;$i<count($arr_json);$i++){
				if($arr_json[$i]["name"] == $name && $arr_json[$i]["pwd"] == $pwd){
					$flag = true;
				}
			}
			echo json_encode($flag);
		}
		//手机号动态登陆
		if($type == "login-phone"){
			$flag = false;
			$pwd = $_POST["pwd"];	
			$return	= $_POST["return"] ;
			if($pwd==$return){
				$flag = true;
			}
			echo json_encode($flag);
		}
	}
	
?>