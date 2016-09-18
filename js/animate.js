/****************
	动画
****************/
//window动画属性
window.requestAnimationFrame=window.requestAnimationFrame||
	window.webkitRequestAnimationFrame||
	window.mozRequestAnimationFrame||
	window.msRequestAnimationFrame||
	function(callback){
		var self=this,start,finish;
		window.setTimeout(
		function(){
		 start=+new Date();
		 callback();
		 finish=+new Date();
		 seljf.timeout=1000/60-(finish-start);
		},seljf.timeout); 
	}

//动画间隔时间和帧
function StopWatch(options){
	//参数
	this.options={
		time:0,
		fps:0,
		startTime:0,
		endTime:0,
		elapsedTime:0,
		isRunning:false,
	}
	this.play();
	for (i in options) this.options[i] = options[i];
}
StopWatch.prototype.getElapsedTime=function(){
	this.options.endTime=+new Date();
	this.options.elapsedTime=this.options.endTime-this.options.startTime;
	this.options.startTime=this.options.endTime;
}
StopWatch.prototype.stop=function(){
	this.options.isRunning=false;
}
StopWatch.prototype.play=function(){
	var that=this;
	if(that.options.isRunning) return;
	that.options.isRunning=true;
	that.options.startTime=+new Date();
	function animate(){
		if(that.options.isRunning){
			that.getElapsedTime();
			that.options.ftp=1000/that.options.elapsedTime;
			that.options.fn.call(that,that.options.elapsedTime,that.options.ftp);//fn第一个参数表示间隔时间，第二个参数表示每秒的频率
			requestAnimationFrame(animate);
		}
	}
	requestAnimationFrame(animate);
}