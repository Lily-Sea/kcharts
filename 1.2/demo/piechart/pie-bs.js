KISSY.use('gallery/kcharts/1.2/piechart/index,gallery/kcharts/1.1/tip/index',function(S,Pie,Tip){
	function pie1(){
		var Raphael = window.Raphael
    //使元素el的颜色变深
		function darker(el,times) {
			times = times || 2;
			var fs = [el.attr("fill"), el.attr("stroke")];
			this.fs = this.fs || [fs[0], fs[1]];
			fs[0] = Raphael.rgb2hsb(Raphael.getRGB(fs[0]).hex);
			fs[0].s = Math.min(fs[0].s * times, 1);
			fs[0].b = fs[0].b / times;
			el.attr({fill: "hsb(" + [fs[0].h, fs[0].s, fs[0].b] + ")"});
			return this;
		}

		var tip
		function getTip(){
			if(!tip){
				tip = new Tip({rootNode:S.one('#J_Pie1')});
			}
			return tip;
		}
		var data = [
			{
				color:"#78a5da",
				label:"Trident",
				data:[
					{
						data:23,
						label:"IE8"
					},{
						data:11,
						label:"IE7"
					},{
						data:6,
						label:"IE9"
					},{
						data:4.4,
						label:"IE6"
					},{
						data:4,
						label:"IE10"
					}
				]
			},{
				color:"#d26e6b",
				label:"Webket",
				data:[
					{
						data:27,
						label:"Chrome 21"
					},{
						data:8,
						label:"Chrome 24"
					},{
						data:20,
						label:"Chrome 20"
					},{
						data:2.6,
						label:"Chrome 17"
					},{
						data:2,
						label:"Chrome 28"
					}
				]
			},{
				color:"#ffa2a2",
				label:"Getko",
				data:[
					{
						data:2,
						label:"FireFox22"
					}
				]
			}];

		var cfg = {
			data:data,
			renderTo:"#J_Pie1",
			cx:400,cy:400,
			rs:[150,200],
			labelfn:function(txt,sector,pie){
				var framedata = sector.get("framedata")
					, percent = (framedata.percent*100).toFixed(2)+"%"
				return txt+":<span class='kcharts-donut-percent'>"+percent+"</span>";
			},
			sizefn:function(size,sector,pie){
				return {
					width:size.width+10,
					height:size.height
				}
			},
			interval:5,
			padding:50,//label和pie之间的距离
			anim:{
				easing:'swing',
				duration:800
			}
		};
		var pie = new Pie(cfg)
			, ms = 200;
		var prevset
			, prevsector;
		function onclick(e){
      //如果饼图正在展开
			if(this.isRunning()){
				return;
			}
			var sector = e.sector
				, $path = sector.get("$path")
				, groupindex = sector.get('groupIndex') //面包圈索引，从内到外的环形索引
				, donutindex = sector.get('donutIndex') //面包圈的索引
				, donut = S.indexOf(0,groupindex) == -1 //是否为外层的环形
				, set = sector.get('set')//包含最内层的扇形以及外层donut的集合

				, middleangle = sector.get('middleangle') //角平分线
				, angel = middleangle*Math.PI/180
				, unit = 30 //点击后，向外偏移的距离
				, x = unit*Math.cos(angel)
				, y = -unit*Math.sin(angel)

			if(donut){//如果点击的是最外侧的，面包圈
				if(prevset){//之前已经有图形集合偏移出来了
					if(prevset == set){//并且跟刚才点击的是一样的，那么缩回去
						prevset.animate({transform:""},ms,function(){
							if(prevsector && prevsector == $path){
								$path.animate({transform:""},ms);
								prevsector = null;
							}else{
								$path.animate({transform:'t'+x+' '+ y},ms);
								prevsector = $path;
							}
						});
					}else{
						prevset.animate({transform:""},ms);
						prevset = null;
						if(prevsector && prevsector == $path){
							$path.animate({transform:""},ms);
							prevsector = null;
						}else{
							$path.animate({transform:'t'+x+' '+ y},ms);
							prevsector = $path;
						}
					}
				}else{
					if(prevsector){
						if(prevsector == $path){
							$path.animate({transform:''},ms);
							prevsector = null;
						}else{
							prevsector.animate({transform:''},ms);
							$path.animate({transform:'t'+x+' '+ y},ms);
							prevsector = $path;
						}
					}else{
						$path.animate({transform:'t'+x+' '+ y},ms);
						prevsector = $path;
					}
				}
			}else{
				if(prevsector){
					if(prevsector == $path){
						prevsector.animate({transform:""},ms);
						prevsector = null;
					}else{
						prevsector.animate({transform:""},ms);
						prevsector = $path
					}
				}
				if(prevset){
					if(prevset == set){
						prevset.animate({transform:""},ms);
						prevset = null;
					}else{
						prevset.animate({transform:""},ms);
						set.animate({transform:'t'+x+' '+ y},ms);
						prevset = set;
					}
				}else{
					set.animate({transform:'t'+x+' '+ y},ms);
					prevset = set;
				}
			}
		}
		pie.on("click",onclick);
		pie.on("labelclick",function(e){
			var sector = e.sector
			sector.fire("click");
		});
		pie.on("mouseover",function(e){
			var sector = e.sector
				, $path = sector.get("$path")
				, middlex = sector.get("middlex")
			  , middley = sector.get("middley")
				, isleft = sector.get("isleft")
				, data = sector.get("framedata")
				, label = data.label
				, size = Pie.getSizeOf(label)
				, tip = getTip()
				, $tip = tip.getInstance()
				, groupindex = sector.get('groupIndex')
				, donutindex = sector.get('donutIndex')
				, donut = S.indexOf(0,groupindex) == -1
				, x
		    , y
			  , framedata = sector.get("framedata")
				, pec = (framedata.percent*100).toFixed(2)+'%'

			if(!donut){
				tip.renderTemplate('{{label}}:<span class="ks-chart-percent">{{percent}}</span>',{label:label,percent:pec});
				if(isleft){
					x = middlex - size.width - 10
				}else{
					x = middlex;
				}
				y=middley;
				tip.fire('move',{x:x,y:y});
			}
			sector.set("_fill",$path.attr("fill"));

			darker($path,1.5);
		});
		pie.on("mouseout",function(e){
			var sector = e.sector
				, $path = sector.get("$path")
				, fill = sector.get("_fill")
			$path.attr("fill",fill);
		});
		pie.on("mouseleave",function(){
			tip && tip.hide();
			prevset && prevset.animate({"transform":""},ms);
			prevsector && prevsector.animate({"transform":""},ms);
			prevset = null;
			prevsector = null;
		});

    pie.on("afterRender",drawCustomLabel);

    //绘制自定义的label
    function drawCustomLabel(){
      var that = pie;
		  var sectors = that.get("$sectors")
        , cx = that.get('cx')
        , cy = that.get('cy')
        , container = that.get("container")
        , rs = that.get("rs")
        , r = rs[0]

      //只标注内部的扇形部分
      sectors = S.filter(sectors,function(sector){
                  var i = sector.get("groupIndex");
                  return i && i[0] == 0;
                });

		  S.each(sectors,function(sector){
        var mx = sector.get("middlex")
          , my = sector.get("middley")
          , deg = sector.get("middleangle")
          , unit = Math.PI / 180
          , rad = deg*unit
          , factor = .7
          , x = cx + factor*r*Math.cos(-rad)
          , y = cy + factor*r*Math.sin(-rad)
          , framedata = sector.get('framedata')
          , isleft = sector.get('isleft')
          , label = framedata.label
          , size
          , px
          , py
          , percent = framedata.percent;

        if(label && percent > .05){//大于10%的扇形才添加标注
          //label = (100 * percent).toFixed(2)+"%";
          size = Pie.getSizeOf(S.Node("<div>"+label+"</div>"))//获取标注的尺寸
          // 计算标注的实际的标注位置
          if(!isleft){
            px = x - size.width/2
            py = y - size.height/2
          }else{
            px = x;
            py = y;
          }
          var $label = S.Node("<div>"+label+"</div>")
          $label.css({"position":"absolute","left":px+'px',"top":y+'px',"font-size":"20px"});
          $label.appendTo(container);
        }

      });
    };
	}
	pie1();
});
