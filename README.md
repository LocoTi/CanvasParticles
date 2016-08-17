# CanvasParticles
html5 canvas 实现网页背景粒子效果

##1.引入js文件
```
<script type="text/javascript" src="canvas-particle.js"></script>
```
##2.配置
配置，调用CanvasParticle函数，传入配置参数即可，如果不配置则用默认配置<br>
在你的js文件中加上如下配置<br>
<pre>
window.onload = function(){
	//配置
	var config = {
		vx: 4,//点x轴速度,正为右，负为左
		vy:  4,//点y轴速度
		height: 2,//点高宽，其实为正方形，所以不宜太大
		width: 2,
		count: 100,//点个数
		color: "121, 162, 185",//点颜色
		stroke: "130,255,255",//线条颜色
		dist: 6000,//点吸附距离
		e_dist: 20000,//鼠标吸附加速距离
		max_conn: 10//点到点最大连接数
	}
	//调用
	CanvasParticle(config);
}
</pre>