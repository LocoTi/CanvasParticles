(function(){
	var flag = false;
	function getElementByTag(name){
		var doc = document;
		return doc.getElementsByTagName(name);
	}
	function getELementById(id){
		var doc = document;
		return doc.getElementById(id);
	}
	function canvasInit(canvasConfig){
		var html = getElementByTag("html")[0];
		var body = getElementByTag("body")[0];
		var canvasDiv = getELementById("canvas-particle");
		var canvasObj = document.createElement("canvas");

		var canvas = {
			element: canvasObj,
			points : [],
			config: {
				vx: canvasConfig.vx || 3,
				vy:  canvasConfig.vy || 3,
				height: canvasConfig.height || 2,
				width: canvasConfig.width || 2,
				count: canvasConfig.count || 100,
				color: canvasConfig.color || "65,100,130",
				stroke: canvasConfig.stroke || "40,125,80",
				dist: canvasConfig.dist || 6000,
				e_dist: canvasConfig.e_dist || 20000
			}
		};

		// 获取context
		if(canvas.element.getContext("2d")){
			canvas.context = canvas.element.getContext("2d");
		}else{
			return null;
		}
		// html.style.width = "100%";
		// html.style.height = "100%";
		// body.style.width = "100%";
		// body.style.height = "100%";
		body.style.padding = "0";
		body.style.margin = "0";
		body.replaceChild(canvas.element, canvasDiv);

		canvas.element.style = "position: absolute; z-index: -1;";
		canvasSize(canvas.element);
		window.onresize = function(){
			canvasSize(canvas.element);
		}
		document.onmousemove = function(e){
			var event = window.event || e;
			canvas.mouse = {
				x: event.clientX,
				y: event.clientY
			}
		}
		document.onmouseleave = function(){
			canvas.mouse = undefined;
		}
		setInterval(function(){
			drawPoint(canvas);
		}, 20);
	}

	// 设置canvas大小
	function canvasSize(canvas){
		canvas.width = window.innerWeight || document.documentElement.clientWidth || document.body.clientWidth;
		canvas.height = window.innerWeight || document.documentElement.clientHeight || document.body.clientHeight;
	}

	// 画点
	function drawPoint(canvas){
		var context = canvas.context,
			points = new Array(),
			point,
			dist;
		context.clearRect(0, 0, canvas.element.width, canvas.element.height);
		context.beginPath();
		context.fillStyle = "rgb("+ canvas.config.color +")";
		for(var i = 0, len = canvas.config.count; i < len; i++){
			if(canvas.points.length != canvas.config.count){
				point = {
					x: Math.floor(Math.random() * canvas.element.width),
					y: Math.floor(Math.random() * canvas.element.height),
					vx: canvas.config.vx / 2 - Math.random() * canvas.config.vx,
					vy: canvas.config.vy / 2 - Math.random() * canvas.config.vy
				}
			}else{
				point =	borderPoint(canvas.points[i], canvas);
			}
			context.fillRect(point.x - 1, point.y - 1, canvas.config.width, canvas.config.height);

			canvas.points[i] = point;
		}
		drawLine(context, canvas, canvas.mouse);
		context.closePath();

		if(!flag){
			flag = true;
			console.log(canvas);
		}
	}

	// 边界处理
	function borderPoint(point, canvas){
		var p = point;
		if(point.x <= 0 || point.x >= canvas.element.width){
			p.vx = -p.vx;
			p.x += p.vx;
		}else if(point.y <= 0 || point.y >= canvas.element.height){
			p.vy = -p.vy;
			p.y += p.vy;
		}else{
			p = {
				x: p.x + p.vx,
				y: p.y + p.vy,
				vx: p.vx,
				vy: p.vy
			}
		}
		return p;
	}

	// 画线
	function drawLine(context, canvas, mouse){
		context = context || canvas.context;
		for(var i = 0, len = canvas.config.count; i < len; i++){
			for(var j = 0, len = canvas.config.count; j < len; j++){
				// point to point
				if(i != j){
					dist = Math.round(canvas.points[i].x - canvas.points[j].x) * Math.round(canvas.points[i].x - canvas.points[j].x) + 
							Math.round(canvas.points[i].y - canvas.points[j].y) * Math.round(canvas.points[i].y - canvas.points[j].y);
					if(dist <= canvas.config.dist){

						context.lineWidth = 0.5 - dist / canvas.config.dist;
						context.strokeStyle = "rgba("+ canvas.config.stroke + ","+ (1 - dist / canvas.config.dist) +")"
						context.beginPath();
						context.moveTo(canvas.points[i].x, canvas.points[i].y);
						context.lineTo(canvas.points[j].x, canvas.points[j].y);
						context.stroke();

					}
				}
			}
			// point to mouse
			if(mouse){
				dist = Math.round(canvas.points[i].x - mouse.x) * Math.round(canvas.points[i].x - mouse.x) + 
						Math.round(canvas.points[i].y - mouse.y) * Math.round(canvas.points[i].y - mouse.y);
				// 遇到鼠标吸附距离时加速，直接改变point的x，y值达到加速效果
				if(dist > canvas.config.dist && dist <= canvas.config.e_dist){
					canvas.points[i].x = canvas.points[i].x + (mouse.x - canvas.points[i].x) / 20;
					canvas.points[i].y = canvas.points[i].y + (mouse.y - canvas.points[i].y) / 20;
				}
				if(dist <= canvas.config.dist){
					context.lineWidth = 1;
					context.strokeStyle = "rgba("+ canvas.config.stroke + ","+ (1 - dist / canvas.config.dist) +")"
					context.beginPath();
					context.moveTo(canvas.points[i].x, canvas.points[i].y);
					context.lineTo(mouse.x, mouse.y);
					context.stroke();
				}
			}
		}
	}

	canvasInit({});
})();