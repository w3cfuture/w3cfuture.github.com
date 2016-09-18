/****************
	事件目标-mobile
****************/
function TargetEvent(options){
	this.options={
		bindEle:document,
		type:"click"
	}
	for(i in options) this.options[i]=options[i];
	
	this.events();
}
TargetEvent.prototype.events=function(){
	var that=this;
	this.options.handleFn=function(e){
		var parent = e.target;
		while ( parent && parent.nodeType !== 9) {
			if ( parent.nodeType === 1 && $(parent).hasClass(that.options.className)) {
				if(typeof that.options.fn=="function"){
					that.options.fn.call(parent);
				}
				break;
			}
		parent = parent.parentNode;
		}
	}
	$(this.options.bindEle).bind(that.options.type,this.options.handleFn);
}
TargetEvent.prototype.clear=function(){
	$(this.options.bindEle).unbind(this.options.type,this.options.handleFn);	
}