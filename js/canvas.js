/****************
	canvas
****************/
jf.fn.extend({
	//canvas的2d环境初始化
	getContext2D:function(){
		this[0]['cobj']=this[0].getContext('2d');
		return this;
	},
	//canvas的2d环境
	cobj:function(){
		return this[0].cobj;
	},
	//开始绘制路径
	beginPath:function(){
		this[0].cobj.beginPath();
		return this;
	},
	//闭合绘制路径
	closePath:function(){
		this[0].cobj.closePath();
		return this;
	},
	//保存当前画布状态
	save:function(){
		this[0].cobj.save();
		return this;
	},
	//释放之前画布状态
	restore:function(){
		this[0].cobj.restore();
		return this;
	},
	//剪切
	clip:function(){
		this[0].cobj.clip();
		return this;
	},
	//清除画布
	clearRect:function(x,y,width,height){
		x=x||0;
		y=y||0;
		width=width||this[0].width;
		height=height||this[0].height;
		this[0].cobj.clearRect(x,y,width,height);
		return this;
	},
	//转化矩阵
	cTransform:function(a,b,c,d,e,f){	
		this[0].cobj.transform(a,b,c,d,e,f);//a:水平缩放，b:水平倾斜，c:垂直倾斜，d：垂直缩放，e:水平移动，f:垂直移动
		return this;
	},
	//重置转化矩阵
	setTransform:function(a,b,c,d,e,f){
		this[0].cobj.setTransform(a,b,c,d,e,f);//a:水平缩放，b:水平倾斜，c:垂直倾斜，d：垂直缩放，e:水平移动，f:垂直移动
		return this;
	},
	//位移
	translate:function(x,y){
		if(arguments.length==1) y=x;
		this[0].cobj.translate(x,y);
		return this;
	},
	//放大或缩小
	scale:function(scalewidth,scaleheight){
		if(arguments.length==1) scaleheight=scalewidth;
		this[0].cobj.scale(scalewidth,scaleheight);
		return this;
	},
	//旋转
	rotate:function(num){
		this[0].cobj.rotate(num*Math.PI/180);	
		return this;
	},
	//透明
	opacity:function(num){
		this[0].cobj.globalAlpha=num;	
		return this;
	},
	//图像合成
	//source-over 默认。在目标图像上显示源图像。
	//source-atop 在目标图像顶部显示源图像。源图像位于目标图像之外的部分是不可见的。
	//source-in 在目标图像中显示源图像。只有目标图像内的源图像部分会显示，目标图像是透明的。
	//source-out 在目标图像之外显示源图像。只会显示目标图像之外源图像部分，目标图像是透明的。
	//destination-over 在源图像上方显示目标图像。
	//destination-atop 在源图像顶部显示目标图像。源图像之外的目标图像部分不会被显示。
	//destination-in 在源图像中显示目标图像。只有源图像内的目标图像部分会被显示，源图像是透明的。
	//destination-out 在源图像外显示目标图像。只有源图像外的目标图像部分会被显示，源图像是透明的。
	//lighter 显示源图像 + 目标图像。
	//copy 显示源图像。忽略目标图像。
	//source-over 使用异或操作对源图像与目标图像进行组合。
	mixImage:function(value){
		this[0].cobj.globalCompositeOperation=value;	
		return this;
	},
	//canvas操作图像
	draw:function(img,sx,sy,swidth,sheight,x,y,width,height){
		var imgData=jf(img)[0];
		arguments[0]=imgData;
		this[0].cobj.drawImage.apply(this[0].cobj,arguments);
		return this;
	},
	//canvas创建图像数据
	createImage:function(width,height){
		return this[0].cobj.createImageData.apply(this[0].cobj,arguments);
	},
	//canvas当前的数据
	getImage:function(x,y,width,height){
		x=x||0;
		y=y||0;
		width=width||this[0].width;
		height=height||this[0].height;
		this[0].imgData=this[0].cobj.getImageData(x,y,width,height);
		return this[0].imgData;
	},
	//canvas插入数据
	putImage:function(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight){
		this[0].cobj.putImageData.apply(this[0].cobj,arguments);
		return this;
	},
	//canvas阴影
	shadow:function(shadow){
		if(!shadow) return this;
		this[0].cobj.shadowOffsetX=shadow[0];
		this[0].cobj.shadowOffsetY=shadow[1];
		this[0].cobj.shadowBlur=shadow[2];
		this[0].cobj.shadowColor=shadow[3];
		return this;
	},
	//canvas颜色
	color:function(colorArr){
		if(!colorArr) return this;
		var color;
		if(colorArr.color){
			color=colorArr.color;
		}else if(colorArr.linear){
			color=this[0].cobj.createLinearGradient.apply(this[0].cobj,colorArr.linear);
			for(var k in colorArr.addColor){
				color.addColorStop(k,colorArr.addColor[k]);		
			}
		}else if(colorArr.radial){
			color=this[0].cobj.createRadialGradient.apply(this[0].cobj,colorArr.radial);
			for(var k in colorArr.addColor){
				color.addColorStop(k,colorArr.addColor[k]);		
			}
		}else if(colorArr.pattern){
			colorArr.pattern[0]=jf(colorArr.pattern[0])[0];
			color=this[0].cobj.createPattern.apply(this[0].cobj,colorArr.pattern);
		}
		

		this[0].cobj.fillStyle=colorArr.fillStyle||color;
		this[0].cobj.strokeStyle=colorArr.strokeStyle||color;
		
		return this;
	},
	//canvas填充类型
	type:function(type){
		if(type!==undefined){
			var typeArr=type.split(",");
			for(var j=0;j<typeArr.length;j++){
				if(typeArr[j]=="fill" || typeArr[j]=="stroke") this[0].cobj[typeArr[j]]();	
			}	
		}else{
			this[0].cobj.fill();
		}
		return this;
	},
	//canvas本身属性
	prop:function(prop){
		if(!prop) return this;
		for(var k in prop){
			this[0].cobj[k]=prop[k];
		};
		return this;
	},
	//矩形
	rect:function(data,obj){
		if(!obj) obj={};
		this[0].cobj.save();
		this.color(obj.color);
		this.prop(obj.prop);
		this.shadow(obj.shadow);
		if(obj.beginPath!==false) this[0].cobj.beginPath();
		
		this[0].cobj.rect.apply(this[0].cobj,data);
		
		if(obj.closePath!==false) this[0].cobj.closePath();
		this.type(obj.type);
		this[0].cobj.restore();
		return this;
	},
	//圆
	arc:function(data,obj){
		if(!obj) obj={};
		this[0].cobj.save();
		this.color(obj.color);
		this.prop(obj.prop);
		this.shadow(obj.shadow);
		if(obj.beginPath!==false) this[0].cobj.beginPath();
		
		data[3]=data[3]*Math.PI/180;
		data[4]=data[4]*Math.PI/180;
		this[0].cobj.arc.apply(this[0].cobj,data);
		
		if(obj.closePath!==false) this[0].cobj.closePath();
		this.type(obj.type);
		this[0].cobj.restore();
		return this;
	},
	//线
	line:function(data,obj){
		if(!obj) obj={};
		this[0].cobj.save();
		this.color(obj.color);
		this.prop(obj.prop);
		this.shadow(obj.shadow);
		if(obj.beginPath!==false) this[0].cobj.beginPath();
		
		for(var j=0;j<data.length;j++){
			if(data[j].length==2){
				this[0].cobj.lineTo(data[j][0],data[j][1]);
			}else if(data[j].length==4){
				this[0].cobj.quadraticCurveTo(data[j][0],data[j][1],data[j][2],data[j][3]);
			}else if(data[j].length==5){
				this[0].cobj.arcTo(data[j][0],data[j][1],data[j][2],data[j][3],data[j][4]);
			}else if(data[j].length==6){
				this[0].cobj.bezierCurveTo(data[j][0],data[j][1],data[j][2],data[j][3],data[j][4],data[j][5]);
			}
		}
		
		if(obj.closePath!==false) this[0].cobj.closePath();
		if(!obj.type) obj.type="stroke";
		this.type(obj.type);
		this[0].cobj.restore();
		return this;
	},
	//canvas星形
	star:function(data,obj){
		if(!obj) obj={};
		this[0].cobj.save();
		this.color(obj.color);
		this.prop(obj.prop);
		this.shadow(obj.shadow);
		if(obj.beginPath!==false) this[0].cobj.beginPath();
		
		var starPoints=[];
		for(var j=0;j<data[4]*2;j++){
			var starPoint=[];
			var a=(360/(data[4]*2))*(Math.PI/180);
			if(j%2==0){
				starPoint.x=data[0]+data[2]*Math.sin(j*a);
				starPoint.y=data[1]-data[2]*Math.cos(j*a);
			}else{
				starPoint.x=data[0]+data[3]*Math.sin(j*a);
				starPoint.y=data[1]-data[3]*Math.cos(j*a);
			}
			starPoints.push(starPoint);
		}
		for(var k=0;k<starPoints.length;k++){
			this[0].cobj.lineTo(starPoints[k].x,starPoints[k].y);
		}
		
		if(obj.closePath!==false) this[0].cobj.closePath();
		this.type(obj.type);
		this[0].cobj.restore();
		return this;
	},
	//canvas多边形
	poly:function(data,obj){
		if(!obj) obj={};
		this[0].cobj.save();
		this.color(obj.color);
		this.prop(obj.prop);
		this.shadow(obj.shadow);
		if(obj.beginPath!==false) this[0].cobj.beginPath();
		
		var polyPoints=[];
		for(var j=0;j<data[3];j++){
			var polyPoint=[];
			var a=(360/(data[3]))*(Math.PI/180);
			polyPoint.x=data[0]+data[2]*Math.cos(j*a);
			polyPoint.y=data[1]-data[2]*Math.sin(j*a);
			polyPoints.push(polyPoint);
		}
		for(var k=0;k<polyPoints.length;k++){
			this[0].cobj.lineTo(polyPoints[k].x,polyPoints[k].y);
		}
		
		if(obj.closePath!==false) this[0].cobj.closePath();
		this.type(obj.type);
		this[0].cobj.restore();
		return this;
	},
	//canvas文字
	text:function(data,obj){
		if(!obj) obj={};
		this[0].cobj.save();
		this.color(obj.color);
		this.prop(obj.prop);
		this.shadow(obj.shadow);
		if(obj.beginPath!==false) this[0].cobj.beginPath();
		
		if(data.length==1){
			return this[0].cobj.measureText(data[0]);
		}
		if(!obj.type) obj.type="fill";
		var typeArr=obj.type.split(",");
		for(var j=0;j<typeArr.length;j++){
			this[0].cobj[typeArr[j]+"Text"].apply(this[0].cobj,data);
		}
		
		if(obj.closePath!==false) this[0].cobj.closePath();
		this[0].cobj.restore();
		return this;
	}
});
jf.extend({
	//canvas创建离线画板
	createC:function(w,h){
		var bgC=document.createElement("canvas");
		bgC.height=h;
		bgC.width=w;
		bgC.cobj=bgC.getContext("2d");
		return bgC;

	},
	//canvas图像反相
	opp:function(imgData){
		for(var i=0;i<imgData.width*imgData.height;i++){
			imgData.data[4*i+0]=255-imgData.data[4*i+0];
			imgData.data[4*i+1]=255-imgData.data[4*i+1];
			imgData.data[4*i+2]=255-imgData.data[4*i+2];
			imgData.data[4*i+3]=imgData.data[4*i+3];
			}
		return imgData;
	},
	//canvas图像窗帘
	blind:function(imgData,num){
		for(var i=0;i<imgData.width*imgData.height;i++){
			if(i%num==0){
				imgData.data[4*i+0]=0;
				imgData.data[4*i+1]=0;
				imgData.data[4*i+2]=0;
				imgData.data[4*i+3]=0;
			}
		}
		return imgData;
	},
	//canvas图像杂色
	rand:function(imgData,per){
		var arr=[];
		var newArr=[];
		for(var i=0;i<imgData.height*imgData.width;i++){
			arr.push(i);
		}
		for(var j=0,len=Math.round(imgData.height*imgData.width*per);j<len;j++){
			newArr.push(arr.splice([Math.round(Math.random()*(arr.length-1))],1));
		}
		for(var i=0;i<newArr.length;i++){
			imgData.data[newArr[i]*4+0]=Math.round(255*Math.random());
			imgData.data[newArr[i]*4+1]=Math.round(255*Math.random());
			imgData.data[newArr[i]*4+2]=Math.round(255*Math.random());
			imgData.data[newArr[i]*4+3]=255;
		}
		return imgData;
	},
	//canvas图像模糊
	fblur:function(imgData,num){
		for(var j=0;j<num;j++){
			for(var i=0;i<imgData.width*imgData.height;i++){
				imgData.data[4*i+0]=(imgData.data[4*(i-1)+0]+imgData.data[4*i+0]+imgData.data[4*(i+1)+0])/3;
				imgData.data[4*i+1]=(imgData.data[4*(i-1)+1]+imgData.data[4*i+1]+imgData.data[4*(i+1)+1])/3;
				imgData.data[4*i+2]=(imgData.data[4*(i-1)+2]+imgData.data[4*i+2]+imgData.data[4*(i+1)+2])/3;
				imgData.data[4*i+3]=(imgData.data[4*(i-1)+3]+imgData.data[4*i+3]+imgData.data[4*(i+1)+3])/3;
			}
		}
		return imgData;
	},
	//canvas图像倒影
	ref:function(imgData,num){
		var data=[];
		for(var i=0,len=imgData.data.length;i<len;i++){
			data[i]=imgData.data[i];
		}
		for(var i=0;i<imgData.height;i++){
			for(var j=0;j<imgData.width;j++){
				imgData.data[i*imgData.width*4+j*4+0]=data[(imgData.height-i-1)*imgData.width*4+j*4+0];
				imgData.data[i*imgData.width*4+j*4+1]=data[(imgData.height-i-1)*imgData.width*4+j*4+1];
				imgData.data[i*imgData.width*4+j*4+2]=data[(imgData.height-i-1)*imgData.width*4+j*4+2];
				imgData.data[i*imgData.width*4+j*4+3]=data[i*imgData.width*4+j*4+3]-i*num;
			}
		}
		return imgData;
	}
});