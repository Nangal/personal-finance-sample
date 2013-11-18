﻿/*!@license
* Infragistics.Web.ClientUI Layout Manager 13.2.20132.1010
*
* Copyright (c) 2011-2013 Infragistics Inc.
*
* http://www.infragistics.com/
*
* Depends on:
*	jquery-1.7.0.js
*	jquery.ui.core.js
*	jquery.ui.widget.js
*   infragistics.util.js
*/
if(typeof jQuery!=="function"){throw new Error("jQuery is undefined")}(function($){$.widget("ui.igLayoutManager",{css:{item:"ig-layout-item",container:"ig-layout",flowItem:"ig-layout-flow-item",flow:"ig-layout-flow",vertical:"ig-layout-vertical",verticalItem:"ig-layout-vertical-item",border:"ig-layout-border",borderItem:"ig-layout-border-item",borderHeader:"ig-layout-border-header",borderFooter:"ig-layout-border-footer",borderLeft:"ig-layout-border-left",borderCenter:"ig-layout-border-center",borderRight:"ig-layout-border-right",borderContainer:"ig-layout-border-container",gridItemAbs:"ig-layout-griditem-abs",gridItemRel:"ig-layout-griditem-rel"},options:{layoutMode:"column",itemCount:null,gridLayout:{cols:null,rows:null,columnWidth:null,columnHeight:null,marginLeft:0,marginTop:0,rearrangeItems:true,overrideConfigOnSetOption:true,animationDuration:500},borderLayout:{showHeader:true,showFooter:true,showLeft:true,showRight:true,leftWidth:"20%",rightWidth:"10%"},items:[{rowSpan:1,colSpan:1,colIndex:0,rowIndex:0,width:null,height:null}],width:null,height:null},events:{itemRendering:"itemRendering",itemRendered:"itemRendered",rendered:"rendered",internalResizing:"internalResizing",internalResized:"internalResized"},_opt:null,_createWidget:function(options,element){this.options.items=[];this.options.gridLayout.useOffset=true;this._opt={eventHandlers:{},gridLayout:null,scrollBarWidth:$.ig.util.getScrollWidth(),scrollBarHeight:$.ig.util.getScrollHeight(),setOptionCall:false};if(options&&options.items){options.items=$.extend(true,[],options.items)}$.Widget.prototype._createWidget.apply(this,arguments)},_create:function(){var self=this;this.element.addClass(this.css.container);if(this.options.width!==null){this.element.css("width",this.options.width)}if(this.options.height!==null){this.element.css("height",this.options.height)}this._opt.eventHandlers.elementResizeHandler=function(e){var noCancel=self._triggerInternalResizing(e);if(noCancel){self.reflow(false,e)}};this.element.on("resize",this._opt.eventHandlers.elementResizeHandler);this._opt.eventHandlers.windowResizeHandler=function(e){var noCancel=self._triggerInternalResizing(e);if(noCancel){self.reflow(false,e)}};$(window).on("resize",this._opt.eventHandlers.windowResizeHandler);switch(this.options.layoutMode){case"grid":this._initGridLayout();break;case"border":this._initBorderLayout();break;case"flow":this._initFlowLayout();break;case"column":break;case"vertical":this._initVerticalLayout();break;default:break}},_setOption:function(option,value){if(this.options[option]===value){return}var opt=this.options,borderLayout=$.extend(true,{},this.options.borderLayout),initGridLayout,gridLayout;switch(option){case"gridLayout":if(opt.gridLayout.overrideConfigOnSetOption){gridLayout=$.extend(true,{overrideConfigOnSetOption:opt.gridLayout.overrideConfigOnSetOption,useOffset:opt.gridLayout.useOffset},{cols:null,rows:null,columnWidth:null,columnHeight:null,marginLeft:0,marginTop:0,rearrangeItems:true,animationDuration:500});initGridLayout=true}else{gridLayout=$.extend(true,{},this.options.gridLayout);initGridLayout=value.cols||value.rows||value.columnWidth||value.columnHeight||value.marginLeft||value.marginTop||value.useOffset}break;default:break}$.Widget.prototype._setOption.apply(this,arguments);switch(option){case"width":this.element.width(this.options.width);if(opt.layoutMode==="grid"){this.reflow(true)}break;case"height":this.element.height(this.options.height);if(opt.layoutMode==="grid"){this.reflow(true)}break;case"gridLayout":this.options.gridLayout=$.extend(true,{},gridLayout,this.options.gridLayout);if(initGridLayout){this._opt.setOptionCall=true;this._initGridLayout();this._opt.setOptionCall=false}else{if(value.hasOwnProperty("rearrangeItems")){this._opt.gridLayout.rearrangeItems=value.rearrangeItems}if(value.hasOwnProperty("animationDuration")){this._opt.gridLayout.animationDuration=value.animationDuration}}break;case"borderLayout":this._destroyBorderLayout();this.options.borderLayout=$.extend(true,{},borderLayout,this.options.borderLayout);this._initBorderLayout();break;case"items":switch(opt.layoutMode){case"vertical":this._destroyVerticalLayout();this._initVerticalLayout();break;case"grid":this._updateGLItemsConfig();break;case"flow":this._destroyFlowLayout();this._initFlowLayout();break}break;case"itemCount":switch(opt.layoutMode){case"vertical":this._destroyVerticalLayout();this._initVerticalLayout();break;case"flow":this._destroyFlowLayout();this._initFlowLayout();break}break;default:break}},reflow:function(forceReflow,event){if(this.options.layoutMode==="grid"){this._reflowGlConfiguration(forceReflow,this.options.gridLayout.animationDuration,event)}},_initVerticalLayout:function(){var i,length=this.options.itemCount,items=this.options.items,item;this.element.addClass(this.css.vertical);if(length>0){for(i=0;i<length;i++){this._trigger(this.events.itemRendering,null,{index:i});item=$("<div></div>").appendTo(this.element).addClass(this.css.verticalItem);this.options.destroyItems=true;this._trigger(this.events.itemRendered,null,{item:item,index:i})}this._trigger(this.events.rendered,null,{owner:this})}else if(items&&items.length>0){for(i=0;i<items.length;i++){this._trigger(this.events.itemRendering,null,{itemData:items[i],index:i});item=$("<div></div>").appendTo(this.element).addClass(this.css.verticalItem);if(items[i].width){item.css("width",items[i].width)}if(items[i].height){item.css("height",items[i].height)}this._trigger(this.events.itemRendered,null,{item:item,index:i})}this.options.destroyItems=true;this._trigger(this.events.rendered,null,{owner:this})}else{this.element.children().addClass(this.css.verticalItem)}},_initGridLayout:function(){var e=this.element,offset=e.offset(),top=0,left=0,gl,items,ml,mt,col,row,colSpan,iw,ih,rowSpan,item,itemData,width,height,elements,i,j;if(this._opt.setOptionCall){elements=this._opt.gridLayout.elements}this._opt.gridLayout=$.extend(true,{},this.options.gridLayout,{items:$.extend(true,[],this.options.items),elements:elements||$(),minColCount:1,columnWidthRatio:null,columnHeightRatio:null,containerWidthNoScroll:e.width(),containerHeightNoScroll:e.height(),resizeItems:false,animating:false,autoAdjustColumnWidth:false,autoAdjustColumnHeight:false,useOffset:(this.element.css("position")==="static"||this.element.css("position")==="fixed")&&this.options.gridLayout.useOffset?true:false});gl=this._opt.gridLayout;items=gl.items;ml=gl.marginLeft;mt=gl.marginTop;this._analyzeGlConfiguration();this._opt.gridLayout.resizeItems=!!(this._opt.gridLayout.columnWidthRatio||this._opt.gridLayout.columnHeightRatio);iw=gl.columnWidth;ih=gl.columnHeight;this._allvisible=true;if(items&&items.length>0){for(i=0;i<items.length;i++){itemData=items[i];colSpan=itemData.colSpan=typeof itemData.colSpan==="number"?itemData.colSpan:1;rowSpan=itemData.rowSpan=typeof itemData.rowSpan==="number"?itemData.rowSpan:1;row=itemData.rowIndex=typeof itemData.rowIndex==="number"?itemData.rowIndex:Math.floor(i/gl.cols);col=itemData.colIndex=typeof itemData.colIndex==="number"?itemData.colIndex:i%gl.cols;if(!this._opt.setOptionCall){this._trigger(this.events.itemRendering,null,{itemData:itemData,index:i});item=$("<div></div>").appendTo(this.element).addClass(this.css.item).addClass("ig-layout-griditem-abs").attr("data-index",i);gl.elements=gl.elements.add(item)}else{item=gl.elements.eq(i)}width=colSpan*iw+(colSpan-1)*ml;height=rowSpan*ih+(rowSpan-1)*mt;left=col*iw+(col+1)*ml;top=row*ih+(row+1)*mt;if(gl.useOffset){top+=offset.top;left+=offset.left}item.css({top:top,left:left,width:width,height:height});itemData.itemIndex=i;if(colSpan>gl.minColCount){gl.minColCount=colSpan}if(!this._opt.setOptionCall){this._trigger(this.events.itemRendered,null,{item:item,itemData:itemData,index:i})}}}else{if(e.children().length===0){for(i=0;i<gl.rows;i++){for(j=0;j<gl.cols;j++){item=$("<div></div>").appendTo(this.element).addClass(this.css.item).attr("data-index",i*gl.cols+j).width(iw).height(ih);this._trigger("itemrendered",null,{item:item});item.addClass(this.css.gridItemAbs);left=j*iw+(j+1)*ml;top=i*ih+(i+1)*mt;left+=j===0?ml:0;item.css({top:top,left:left})}}}}items.sort(this._glSortItemsByPositionOrder);this._trigger(this.events.rendered,null,{items:this.options.items});this._reflowGlConfiguration(false,0,null)},_updateGLItemsConfig:function(){var gl=this._opt.gridLayout,elements=gl.elements,items=this.options.items,currEl,item,itemData,i,colSpan;for(i=0;i<items.length;i++){currEl=elements.eq(i);itemData=items[i];colSpan=itemData.colSpan=typeof itemData.colSpan==="number"?itemData.colSpan:1;itemData.rowSpan=typeof itemData.rowSpan==="number"?itemData.rowSpan:1;itemData.rowIndex=typeof itemData.rowIndex==="number"?itemData.rowIndex:Math.floor(i/gl.cols);itemData.colIndex=typeof itemData.colIndex==="number"?itemData.colIndex:i%gl.cols;if(currEl.length>0){itemData.itemIndex=parseInt(currEl.attr("data-index"),10)}else{itemData.itemIndex=i;this._trigger(this.events.itemRendering,null,{itemData:itemData,index:i});item=$("<div></div>").appendTo(this.element).addClass(this.css.item).addClass("ig-layout-griditem-abs").attr("data-index",i);gl.elements=gl.elements.add(item);this._trigger(this.events.itemRendered,null,{item:item,itemData:itemData,index:i})}if(colSpan>gl.minColCount){gl.minColCount=colSpan}}while(gl.elements.length>items.length){Array.prototype.pop.call(gl.elements).remove()}gl.items=$.extend(true,[],items);this._reflowGlConfiguration(true,0)},_glReflowNeeded:function(){var e=this.element,gl=this._opt.gridLayout,newContainerWidthNoScroll=e.width()-($.ig.util.hasVerticalScroll(e)?this._opt.scrollBarWidth:0),newContainerHeightNoScroll=e.height()-($.ig.util.hasHorizontalScroll(e)?this._opt.scrollBarHeight:0);return gl.containerWidthNoScroll!==newContainerWidthNoScroll&&(gl.columnWidthRatio||gl.cols!==Math.floor(newContainerWidthNoScroll/(gl.columnWidth+gl.marginLeft)))||gl.containerHeightNoScroll!==newContainerHeightNoScroll&&gl.columnHeightRatio},_reflowGlConfiguration:function(forceReflow,animationDuration,event){var self=this,e=this.element,gl=this._opt.gridLayout,ml=gl.marginLeft,mt=gl.marginTop,items=gl.items,newContainerWidthNoScroll=e.width()-($.ig.util.hasVerticalScroll(e)?this._opt.scrollBarWidth:0),newContainerHeightNoScroll=e.height()-($.ig.util.hasHorizontalScroll(e)?this._opt.scrollBarHeight:0),leftOffset=gl.useOffset?e.offset().left:0,topOffset=gl.useOffset?e.offset().top:0,col,row,colSpan,rowSpan,newColCount,newDim,helperArray,itemData,colWidthChanged,colHeightChanged,positionsChanged,foundMatch,currentRow,item,i,j,k,r,n,rearrangeCallback=function(){if(!gl.elements.is(":animated")){gl.animating=false;if(self._glReflowNeeded()){self._reflowGlConfiguration(false,animationDuration,event)}else{self._triggerInternalResized(event)}}};if(items){if(gl.columnWidthRatio&&gl.containerWidthNoScroll!==newContainerWidthNoScroll){gl.columnWidth=Math.floor(newContainerWidthNoScroll*gl.columnWidthRatio-ml);colWidthChanged=true}else{colWidthChanged=false}if(gl.columnHeightRatio&&gl.containerHeightNoScroll!==newContainerHeightNoScroll){gl.columnHeight=Math.floor(newContainerHeightNoScroll*gl.columnHeightRatio-mt);colHeightChanged=true}else{colHeightChanged=false}if(gl.autoAdjustColumnWidth&&(gl.containerHeightNoScroll!==newContainerHeightNoScroll&&gl.rearrangeItems||forceReflow)){gl.rows=Math.max(Math.floor(newContainerHeightNoScroll/(gl.columnHeight+mt)),1);gl.columnWidthRatio=1/Math.ceil(items.length/gl.rows);gl.columnWidth=Math.floor(newContainerWidthNoScroll*gl.columnWidthRatio-ml);colWidthChanged=true}gl.containerWidthNoScroll=newContainerWidthNoScroll;gl.containerHeightNoScroll=newContainerHeightNoScroll;if(gl.rearrangeItems||forceReflow){if(gl.rearrangeItems){if(gl.columnWidthRatio){newColCount=Math.floor(1/gl.columnWidthRatio)}else{newColCount=Math.floor(newContainerWidthNoScroll/(gl.columnWidth+ml))}}else{if(gl.autoAdjustColumnWidth){newColCount=Math.ceil(items.length/gl.rows)}else if(gl.autoAdjustColumnHeight){newColCount=Math.floor(newContainerWidthNoScroll/(gl.columnWidth+ml))}else{newColCount=gl.cols}}if(gl.minColCount>newColCount){newColCount=gl.minColCount}if(newColCount!==gl.cols||forceReflow){gl.cols=newColCount;helperArray=[[]];helperArray[0].length=gl.cols;for(i=0;i<items.length;i++){itemData=items[i];colSpan=itemData.colSpan;rowSpan=itemData.rowSpan;foundMatch=false;for(j=0;j<helperArray.length&&!foundMatch;j++){for(k=0;k<helperArray[j].length&&!foundMatch;k++){if(!helperArray[j][k]){foundMatch=true;for(r=0;foundMatch&&r<rowSpan*colSpan;r++){if(colSpan>helperArray[j].length-k){foundMatch=false}else{currentRow=j+Math.floor(r/colSpan);if(!helperArray[currentRow]){helperArray[currentRow]=[];helperArray[currentRow].length=gl.cols}if(helperArray[currentRow][k+r%colSpan]===1){foundMatch=false}}}}if(foundMatch){itemData.rowIndex=j;itemData.colIndex=k;for(n=0;n<rowSpan*colSpan;n++){helperArray[itemData.rowIndex+Math.floor(n/colSpan)][itemData.colIndex+n%colSpan]=1}}else if(j===helperArray.length-1&&k===helperArray[j].length-1){helperArray[j+1]=[];helperArray[j+1].length=gl.cols}}}}if(gl.autoAdjustColumnHeight&&gl.rows!==helperArray.length){gl.columnHeightRatio=1/helperArray.length;gl.columnHeight=Math.floor(newContainerHeightNoScroll*gl.columnHeightRatio-mt);colHeightChanged=true}gl.rows=helperArray.length;positionsChanged=true}}if(colWidthChanged||colHeightChanged||positionsChanged||forceReflow){gl.animating=positionsChanged&&animationDuration>0||gl.animating;for(i=0;i<items.length;i++){itemData=items[i];item=gl.elements.filter("[data-index="+'"'+itemData.itemIndex+'"'+"]");row=itemData.rowIndex;col=itemData.colIndex;colSpan=itemData.colSpan;rowSpan=itemData.rowSpan;newDim={};if(positionsChanged||gl.animating){newDim.left=col*gl.columnWidth+(col+1)*ml+leftOffset;newDim.top=row*gl.columnHeight+(row+1)*mt+topOffset;if(colWidthChanged||forceReflow){newDim.width=colSpan*gl.columnWidth+(colSpan-1)*ml}if(colHeightChanged||forceReflow){newDim.height=rowSpan*gl.columnHeight+(rowSpan-1)*mt}if(animationDuration>0){item.animate(newDim,{duration:animationDuration,queue:false,complete:rearrangeCallback})}else{item.css(newDim)}}else{if(colWidthChanged||forceReflow){newDim.left=col*gl.columnWidth+(col+1)*ml+leftOffset;newDim.width=colSpan*gl.columnWidth+(colSpan-1)*ml}if(colHeightChanged||forceReflow){newDim.top=row*gl.columnHeight+(row+1)*mt+topOffset;newDim.height=rowSpan*gl.columnHeight+(rowSpan-1)*mt}item.css(newDim)}}if(!gl.animating){if(this._glReflowNeeded()){this._reflowGlConfiguration(false,animationDuration,event)}else{this._triggerInternalResized(event)}}}}},_analyzeGlItems:function(){var config=this._opt.gridLayout,items=config.items,cols=0,rows=0,item,itemCols,itemRows,i;for(i=0;items.length>i;i++){item=items[i];itemCols=item.colIndex+item.colSpan;itemRows=item.rowIndex+item.rowSpan;if(itemCols>cols){cols=itemCols}if(itemRows>rows){rows=itemRows}}if(cols>0){config.cols=cols}if(rows>0){config.rows=rows}},_analyzeGlWidth:function(){var config=this._opt.gridLayout,elWidth=this.element.width(),units;if(config.columnWidth){if(typeof config.columnWidth==="string"){if(config.columnWidth.indexOf("%")!==-1){units=config.columnWidth.substring(0,config.columnWidth.length-1);units=parseInt(units,10)/100;if(!isNaN(units)&&units>0){this._opt.gridLayout.columnWidthRatio=units;config.columnWidth=Math.floor(elWidth*units-config.marginLeft)}}else{units=parseInt(config.columnWidth,10);if(!isNaN(units)&&units>0){config.columnWidth=units}}}}},_analyzeGlHeight:function(){var config=this._opt.gridLayout,elHeight=this.element.height(),units;if(config.columnHeight){if(typeof config.columnHeight==="string"){if(config.columnHeight.indexOf("%")!==-1){units=config.columnHeight.substring(0,config.columnHeight.length-1);units=parseInt(units,10)/100;if(!isNaN(units)&&units>0){this._opt.gridLayout.columnHeightRatio=units;config.columnHeight=Math.floor(elHeight*units-config.marginTop)}}else{units=parseInt(config.columnHeight,10);if(!isNaN(units)&&units>0){config.columnHeight=units}}}}},_analyzeGlNotSetOptions:function(){var config=this._opt.gridLayout,elWidth=this.element.width(),elHeight=this.element.height(),itemsLength=config.items.length,columnWidthOption=typeof config.columnWidth==="number"&&config.columnWidth>0,columnHeightOption=typeof config.columnHeight==="number"&&config.columnHeight>0,colsOption=typeof config.cols==="number"&&config.cols>0,rowsOption=typeof config.rows==="number"&&config.rows>0;if(!colsOption){if(rowsOption){config.cols=Math.ceil(itemsLength/config.rows)}else{if(columnWidthOption){config.cols=Math.floor(elWidth/(config.columnWidth+config.marginLeft));config.rows=Math.ceil(itemsLength/config.cols)}else if(columnHeightOption){config.rows=Math.floor(elHeight/(config.columnHeight+config.marginTop));config.cols=Math.ceil(itemsLength/config.rows)}else{config.cols=Math.ceil(Math.sqrt(itemsLength));config.rows=Math.ceil(itemsLength/config.cols)}}}else if(!rowsOption){config.rows=Math.ceil(itemsLength/config.cols)}if(!columnWidthOption){config.columnWidth=Math.floor(elWidth*(1/config.cols)-config.marginLeft);config.columnWidthRatio=1/config.cols}if(!columnHeightOption){config.columnHeight=Math.floor(elHeight*(1/config.rows)-config.marginTop);config.columnHeightRatio=1/config.rows}if(!columnHeightOption&&!colsOption&&!config.columnWidthRatio){config.autoAdjustColumnHeight=true}if(!columnWidthOption&&!rowsOption&&!config.columnHeightRatio){config.autoAdjustColumnWidth=true}},_analyzeGlConfiguration:function(){this._analyzeGlWidth();this._analyzeGlHeight();this._analyzeGlItems();this._analyzeGlNotSetOptions()},_glSortItemsByPositionOrder:function(item1,item2){return item1.rowIndex!==item2.rowIndex?item1.rowIndex-item2.rowIndex:item1.colIndex-item2.colIndex},_initBorderLayout:function(){var left,right,center,header,footer,rwidth,lwidth,bl=this.options.borderLayout,container;this.element.addClass(this.css.border);left=this.element.find(".left");header=this.element.find(".header");right=this.element.find(".right");center=this.element.find(".center");footer=this.element.find(".footer");if(left.length===0&&bl.showLeft){this._trigger(this.events.itemRendering,null,{region:"left"});left=$("<div></div>").appendTo(this.element);this._removeLeft=true;this._trigger(this.events.itemRendered,null,{region:"left",element:left})}left.addClass(this.css.borderItem).addClass(this.css.borderLeft);if(right.length===0&&bl.showRight){this._trigger(this.events.itemRendering,null,{region:"right"});right=$("<div></div>").appendTo(this.element);this._removeRight=true;this._trigger(this.events.itemRendered,null,{region:"right",element:right})}right.addClass(this.css.borderItem).addClass(this.css.borderRight);if(center.length===0){this._trigger(this.events.itemRendering,null,{region:"center"});center=$("<div></div>").appendTo(this.element);this._removeCenter=true;this._trigger(this.events.itemRendered,null,{region:"center",element:center})}center.addClass(this.css.borderItem).addClass(this.css.borderCenter);if(footer.length===0&&bl.showFooter){this._trigger(this.events.itemRendering,null,{region:"footer"});footer=$("<div></div>").appendTo(this.element);this._removeFooter=true;this._trigger(this.events.itemRendered,null,{region:"footer",element:footer})}footer.addClass(this.css.borderItem).addClass(this.css.borderFooter);if(header.length===0&&bl.showHeader){this._trigger(this.events.itemRendering,null,{region:"header"});header=$("<div></div>").appendTo(this.element);this._removeHeader=true;this._trigger(this.events.itemRendered,null,{region:"header",element:header})}header.addClass(this.css.borderItem).addClass(this.css.borderHeader);container=$("<div></div>").appendTo(this.element).addClass(this.css.borderContainer).append(left).append(right).append(center);this.element.append(footer);if(bl.leftWidth!==null&&bl.showLeft){left.css("width",bl.leftWidth)}else if(bl.showLeft===false||left.length===0){container.css("padding-left",0)}if(bl.rightWidth!==null&&bl.showRight){right.css("width",bl.rightWidth)}else if(bl.showRight===false||right.length===0){container.css("padding-right",0)}lwidth=bl.leftWidth&&bl.leftWidth.indexOf&&bl.leftWidth.indexOf("%")!==-1?0:parseInt(bl.leftWidth,10);rwidth=bl.rightWidth&&bl.rightWidth.indexOf&&bl.rightWidth.indexOf("%")!==-1?0:parseInt(bl.rightWidth,10);this.element.css("min-width",lwidth+rwidth);this._trigger(this.events.rendered,null,{owner:this})},_initFlowLayout:function(){var i,length=this.options.itemCount,items=this.options.items,item;this.element.addClass(this.css.flow);if(length>0){for(i=0;i<length;i++){this._trigger(this.events.itemRendering,null,{index:i});item=$("<li></li>").appendTo(this.element).addClass(this.css.flowItem);this.options.destroyItems=true;this._trigger(this.events.itemRendered,null,{item:item,index:i})}this._trigger(this.events.rendered,null,{owner:this})}else if(items&&items.length>0){for(i=0;i<items.length;i++){this._trigger(this.events.itemRendering,null,{itemData:items[i],index:i});item=$("<li></li>").appendTo(this.element).addClass(this.css.flowItem);if(items[i].width){item.css("width",items[i].width)}if(items[i].height){item.css("height",items[i].height)}this._trigger(this.events.itemRendered,null,{item:item,index:i})}this.options.destroyItems=true;this._trigger(this.events.rendered,null,{owner:this})}else{this.element.children().addClass(this.css.flowItem)}},_triggerInternalResizing:function(event){var args={owner:this};return this._trigger(this.events.internalResizing,event,args)},_triggerInternalResized:function(event){var args={owner:this};return this._trigger(this.events.internalResized,event,args)},_destroyBorderLayout:function(){this.element.removeClass(this.css.border);this.element.find("."+this.css.borderLeft).unwrap();if(this._removeLeft){this.element.children("."+this.css.borderLeft).remove()}if(this._removeRight){this.element.children("."+this.css.borderRight).remove()}if(this._removeCenter){this.element.children("."+this.css.borderCenter).remove()}if(this._removeHeader){this.element.children("."+this.css.borderHeader).remove()}if(this._removeFooter){this.element.children("."+this.css.borderFooter).remove()}this.element.children().removeClass(this.css.borderItem).removeClass(this.css.borderLeft).removeClass(this.css.borderRight).removeClass(this.css.borderCenter).removeClass(this.css.borderFooter).removeClass(this.css.borderHeader)},_destroyGridLayout:function(){if(this.options.destroyItems){this.element.empty()}else{this.element.children().removeClass(this.css.item).removeClass(this.css.gridItemAbs).removeClass(this.css.gridItemRel).removeAttr("data-index")}this.element.off("resize",this._opt.eventHandlers.elementResizeHandler)},_destroyFlowLayout:function(){this.element.removeClass(this.css.flow);if(this.options.destroyItems){this.element.empty()}else{this.element.children().removeClass(this.css.flowItem)}},_destroyVerticalLayout:function(){this.element.removeClass(this.css.vertical);if(this.options.destroyItems){this.element.empty()}else{this.element.children().removeClass(this.css.verticalItem)}},destroy:function(){$.Widget.prototype.destroy.apply(this,arguments);this.element.removeClass(this.css.container);switch(this.options.layoutMode){case"grid":this._destroyGridLayout();break;case"border":this._destroyBorderLayout();break;case"flow":this._destroyFlowLayout();break;case"vertical":this._destroyVerticalLayout();break;default:break}$(window).off("resize",this._opt.eventHandlers.windowResizeHandler);return this}});$.extend($.ui.igLayoutManager,{version:"13.2.20132.1010"})})(jQuery);