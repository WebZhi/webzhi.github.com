// JavaScript Document
	// DOM加载
	function DomReady(fn){
		if(document.addEventListener){
			document.addEventListener('DOMContentLoaded',function(){
				fn && fn();
			},false);
		}else{
			document.attachEvent('onreadystatechange',function(){
				if(document.readyState == 'complete'){
					fn && fn();
				}
			})
		}
	}
	// 随机获取从几到几的数字
	function rad(n,m){
				return parseInt(Math.random()*(m-n)+n);
			}
	// 判断数组内的数字是否重复
	function findInArr(n,arr){
		for(var i=0;i<arr.length;i++){
			if (arr[i] == n) {
				return true;
			}
		}
		return false;
	}
	//判断数字是否小于10，如果小于10，在数字前面加上0；
	function toDouble(n){
			if(n < 10){
				return '0'+n;
			}else{
				return ''+n;
			}
		}
	// 获取非行间样式
	function getStyle(obj,name){
		if(obj.currentStyle){
			return obj.currentStyle[name];
		}else{
			return getComputedStyle(obj,false)[name];
		}
	}
	// json转string
	function json2Url(json){
		var arr = [];
		for(var name in json){
			arr.push(name+'='+json[name]);
		}
		return arr.join('&');
	}
	// string转json
	function url2json(str){
	 	var json = {};
	 	var arr = str.split('&');
	 	for(var i = 0; i < arr.length; i++){
	 		var arr2 = arr[i].split('=');
	 		json[arr2[0]] = arr2[1];
	 	}
	 	return json;
	 }
	 // 事件冲突绑定代码封装
    function addEvent(obj,sEv,fn){
        if(obj.addEventListener){
            obj.addEventListener(sEv,fn,false);
        }else{
            obj.attachEvent('on' + sEv,fn);
        }
    }
    // 事件冲突解绑定封装
    function removeEvent(obj,sEv,fn){
        if(obj.removeEventListener){
            obj.removeEventListener(sEv,fn,false);
        }else{
            obj.detachEvent('on' + sEv,fn);
        }
    }
	
	//鼠标滚轮事件封装
	function addEvnet(obj,sEv,fn){
		if(obj.addEventListener){
			obj.addEventListener(sEv,fn,false);
		}else{
			obj.attachEvent('on'+sEv,fn);
		}
	}
	function addWheel(obj,fn){
		function wheel(ev){
			var oEvent = ev || event;
			var bDown = true;
			bDown = oEvent.wheelDelta?oEvent.wheelDelta < 0:bDown = oEvent.detail > 0;
			fn && fn(bDown);
			oEvent.preventDefault && oEvent.preventDefault();
			return false;
		}
		if(window.navigator.userAgent.indexOf('Firefox') != -1){
			obj.addEventListener('DOMMouseScroll',wheel,false);
		}else{
			addEvnet(obj,'mousewheel',wheel);
		}
	}
	// move(元素，属性json,总时间duration,运动形式easing,回调函数complete)options
	function move(obj,json,options){
	    // 定义一个options,如果没有给值，就定义一个空json
	    options = options || {};
	    // 给duration和easing一个默认值，如果没有赋值，就执行默认值
	    options.duration = options.duration || 1000;
	    options.easing = options.easing || 'ease-out';
	    // 总次数   每 30 走一次  需要 1000 走完   总时间除以多少秒走一次得出 需要多少次走完
	    var count = Math.floor(options.duration/30);
	    //getStyle 获取的行间样式 是带px的，offsetLeft 等是不带px，所以要用parseInt()转下数字。
	    var start = {};
	    var dis = {}
	    for(var name in json){
	        // 获取初始值 start的name = json的name = dis 的name
	        start[name] = parseFloat(getStyle(obj,name));
	        // 获取你要设置的总距离
	        dis[name] = json[name] - start[name];
	    }
	    // 一次走多远   总距离 / 总次数   意思是把 300 分成33次走完 每次需要走的距离
	    // var tiep = dis / count;
	    // 定义一个n 为0 等于走的次数，每执行一次，n+1
	    var n = 0;
	    clearInterval(obj.timer);
	    obj.timer = setInterval(function(){
	        n++ ;
	        for(var name in json){
	            // 判断运动形式
	            switch(options.easing){
	                // 匀速运动
	                case 'linear':
	                    var a = n/count;
	                    var cur = start[name] + dis[name]*a;
	                    break;
	                // 加速运动
	                case 'ease-in':
	                    var a = n/count;
	                    var cur = start[name] + dis[name]*a*a*a;
	                    break;
	                // 缓冲运动
	                case 'ease-out':
	                    var a = 1-n/count;
	                    var cur = start[name] + dis[name]*(1-a*a*a);
	                    break;
	            }
	            
	            // strat是初始位置，不加的话就从0开始
	            if(name == 'opacity'){
	                obj.style[name] = cur;
	                obj.style.filter = 'alpha(opacity:'+cur*100+')';
	            }else{
	                obj.style[name] = cur + 'px';
	            }
	        }
	        // 如果走的次数(n)大于等于 总次数，那就停止
	        if(n >= count){
	            clearInterval(obj.timer);
	            options.complete && options.complete();
	        }
	    },30);
	}