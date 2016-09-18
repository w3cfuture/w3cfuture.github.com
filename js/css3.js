/****************
	css3
****************/
;(function(window){
	var rtrim=new RegExp("(^\\s*)|(\\s*$)", 'g'); //去掉前后空格
	
	//获得CSS3前缀
	var _elementStyle = document.createElement('div').style;
	var _vendor = function (style) {
		if(style in _elementStyle) return style;
		var vendors = ['webkit', 'Moz', 'ms', 'O'],
			i = 0,
			l = vendors.length;
	
		for ( ; i < l; i++ ) {
			var _style=vendors[i] + style.charAt(0).toUpperCase() + style.substr(1);
			if ( _style in _elementStyle ) return vendors[i];
		}
		return false;
	}
	jf.extend({
		//支持的css3样式
		css3Style:function(style) {
			var vendor=_vendor(style);
			if ( vendor === false ) return false;
			if ( vendor === style ) return style;
			return vendor + style.charAt(0).toUpperCase() + style.substr(1);
		}
	});
	
	//常用css3参数
	var _transform=jf.css3Style("transform");
	var _transition=jf.css3Style("transition");
	var _transformOrigin=jf.css3Style("transformOrigin");
	
	jf.fn.extend({
		//获取或设置元素css的值
		css:function(attr,value){
			if(!this.length){
				return this;
			}
			if(typeof attr==="object"){
				for(var i in attr){
					var value=jf.css3Style(i);
					this.each(function(){
						this.style[value]=attr[i];
					});
				}
				return this;
			}
			attr=jf.css3Style(attr);
			if(value===undefined){
				return window.getComputedStyle(this[0], null)[attr];
			}else{
				this.each(function(){
					this.style[attr]=value;
				});
				return this;
			}
		},
		//判断是否有class
		hasClass:function(selector){
			var re = new RegExp("(^|\\s)" + selector + "(\\s|$)", 'g');  //匹配相应的class
			return re.test(this[0].className);
		},
		//添加class
		addClass: function( selector ) {
			this.each(function(){
				if (jf(this).hasClass(selector)) {
					return;
				}
				var newclass = this.className.split(' ');
				newclass.push(selector);
				this.className = newclass.join(' ').replace(rtrim,"");
			});
			return this;
		},
		//移除class
		removeClass:function (selector) {
			this.each(function(){
				if (!jf(this).hasClass(selector)) {
					return;
				}
				var re = new RegExp("(^|\\s)" + selector + "(\\s|$)", 'g');  //匹配相应的class
				this.className = this.className.replace(re, ' ').replace(rtrim,"");
			});
			return this;
		},
		//如果存在（不存在）就删除（添加）一个class
		toggleClass:function (selector) {
			this.each(function(){
				if (jf(this).hasClass(selector)) {
					jf(this).removeClass(selector);
				}else{
					jf(this).addClass(selector);
				}
			});
			return this;
		},
		//获取匹配元素在当前视口的相对偏移
		offset:function(){
			if ( !this[0] ) return null;
			var box = this[0].getBoundingClientRect(), 
			top  = box.top  + window.pageYOffset,
			left = box.left + window.pageXOffset;
			return {left:left, top:top};
		},
		//获取css3矩形变换值
		transform:function(){
			var matrix = window.getComputedStyle(this[0], null)[_transform],
				x, y, sx, sy , deg ,skX ,skY;
			if(matrix=="none" || !matrix) return { x: 0, y: 0, sx:1, sy:1, deg:0, skX:0, skY:0};
			var str=matrix.match(/\(.+?\)/g)[0];
			matrix = str.substring(1,(str.length-1)).split(",");
			if(matrix.length==6){
				x = +(matrix[4]);
				y = +(matrix[5]);
				sx = +(matrix[0]);
				sy = +(matrix[3]);
				deg=Math.round(Math.acos(+(matrix[0]))/Math.PI*180);
				skX=Math.round(Math.atan(+(matrix[2]))/Math.PI*180);
				skY=Math.round(Math.atan(+(matrix[1]))/Math.PI*180);
			}else{
				x = +(matrix[12]);
				y = +(matrix[13]);
				sx = +(matrix[0]);
				sy = +(matrix[5]);
			}
			return { x: x, y: y, sx:sx, sy:sy, deg:deg, skX:skX, skY:skY};
		}
	});
})(window);