function ajax(url, fnSucc, fnFaild)
{
	//1.创建Ajax对象
	//IE6以上
	//var oAjax=new XMLHttpRequest();
	
	//IE6
	//var oAjax=new ActiveXObject("Microsoft.XMLHTTP");
	var oAjax=null;
	
	if(window.XMLHttpRequest)
	{
		oAjax=new XMLHttpRequest();
	}
	else
	{
		oAjax=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	//2.连接服务器
	//open('方法', '文件名', 是不是异步)
	oAjax.open('GET', url, true);
	
	//3.发送请求
	oAjax.send();
	
	//4.接收返回
	oAjax.onreadystatechange=function ()	//当浏览器和服务器之间有通信的时候
	{
		//4——完成
		if(oAjax.readyState==4)	//oAjax.readyState只代表是否完成，而不代表是否成功
		{
			//200	成功	否则失败
			if(oAjax.status==200)
			{
				fnSucc(oAjax.responseText);
			}
			else
			{
				if(fnFaild)
				{
					fnFaild();
				}
			}
		}
	};
}