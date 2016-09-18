/****************
	事件目标-mobile
****************/
function TargetEvent(options){
	this.options={
		bindEle:document,
		type:"touchend"
	}
	for(i in options) this.options[i]=options[i];
	
	this.events();
}
TargetEvent.prototype.events=function(){
	var that=this;
	if(typeof this.options.bindEle=="object"){
		if(this.options.bindEle[0]){
			this.options.bindEleArr=this.options.bindEle;
		}else{
			this.options.bindEleArr=[this.options.bindEle];
		}
	}else{
		this.options.bindEleArr=this.options.bindEle===document?[document]:document.querySelectorAll(this.options.bindEle);
	}
	this.options.handleFn=function(e){
		var parent = e.target;
		while ( parent && parent.nodeType !== 9) {
			if ( parent.nodeType === 1 && new RegExp("(^|\\s)" + that.options.className + "(\\s|$)", 'g').test(parent.className)) {
				if(typeof that.options.fn=="function"){
					that.options.fn.call(parent);
				}
				break;
			}
		parent = parent.parentNode;
		}
	}
	for(var i=0,len=this.options.bindEleArr.length;i<len;i++){
		this.options.bindEleArr[i].addEventListener(this.options.type,this.options.handleFn);
	}
}
TargetEvent.prototype.clear=function(){
	for(var i=0,len=this.options.bindEleArr.length;i<len;i++){
		this.options.bindEleArr[i].removeEventListener(this.options.type,this.options.handleFn);
	}	
}