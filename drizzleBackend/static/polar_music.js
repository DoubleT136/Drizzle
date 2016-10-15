var w = 500//window.innerWidth,
    h = 500 //window.innerHeight

var maxTime = 30

var tau = 2 * Math.PI,
    anglePerStep = tau / maxTime,
    stepsPerAngle = maxTime / tau

var strokeColor = "grey"
var levelDepth = 30
var padding = 6
var circleRadius = 12

var animateDuration = 0


var id = 0
function getId() {
	id = id + 1
	return id
}



/*********************************************************
 *       Code for Making Requests to Server
 *********************************************************/


$("#download").on("click", function(e){
	console.log(data)
});


/***********************************************************
 *      Code for Handling Names and Creating Options       *
 ***********************************************************/

var current_level = 0
var optionLevelDict = {}

function next_level(name) {
	if (optionLevelDict[name])
		return optionLevelDict[name]
	else {
		current_level += 1
		optionLevelDict[name] = current_level
		return current_level

	}
}

function random_angle() {
	return Math.random() * tau
}

var optionsDict = {
	fire: function() {
		return {
	        name: "fire",
	        level: next_level("fire"),
	        angle: random_angle(),
	        dAngle: 1,
	        color: "green",
	        id: getId(),
	        intensity: 1
		}
	},
	forest: function() {
		return {
	        name: "forest",
	        level: next_level("forest"),
	        angle: random_angle(),
	        dAngle: 1,
	        color: "blue",
	        id: getId(),
	        intensity: 1
		}
	},
	water: function() {
		return {
	        name: "water",
	        level: next_level("water"),
	        angle: random_angle(),
	        dAngle: 1,
	        color: "purple",
	        id: getId(),
	        intensity: 1
		}
	},
	wind: function() {
		return {
	        name: "wind",
	        level: next_level("wind"),
	        angle: random_angle(),
	        dAngle: 1,
	        color: "orange",
	        id: getId(),
	        intensity: 1
		}
	}
}

$("#water").click(function(e){
	var waterObj = optionsDict.water()
	addGroups([waterObj])
	console.log("water");
});


$("#wind").click(function(e){
	var windObj = optionsDict.wind()
	addGroups([windObj])
	console.log("water");
});


$("#forest").click(function(e){
	var forestObj = optionsDict.forest()
	addGroups([forestObj])
	console.log("water");
});


$("#fire").click(function(e){
	var fireObj = optionsDict.fire()
	addGroups([fireObj])
	console.log("water");
});

var data = []



/***********************************************************
 *      Code for Building Visualization                    *
 ***********************************************************/


// add tool tip
var tooltip = d3.select("body")
	.append("div")
	.attr("class", "tooltip_vis")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")


// create main svg
var svg = d3.select("body").append("svg:svg")
	.attr("width", w)
	.attr("height", h)
	.attr("id", "clock");

// create arc group
var arcGroup = svg.append("svg:g")
	.attr(
		"transform", 
		"translate(" + w / 2 + "," + h / 2 + ")"
	);


var arc = d3.svg.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius)
	.startAngle(function(d) {return d.angle})
	.endAngle(function(d) {return d.angle + d.dAngle})
	.padRadius(4)


var arcGroups = arcGroup.selectAll("g")
	.data(data).enter()
	.append("g")
updateArcGroups(arcGroups)


function addGroups(newGroups) {
	data = data.concat(newGroups)

	var arcGroups = arcGroup.selectAll("g")
		.data(data).enter()
		.append("g")

	console.log("ARC GROUP: ", data)
	updateArcGroups(arcGroups)
}




function updateArcGroups(arcGroups) {
	arcGroups.each(function(d) {
		var wrapGroup = d3.select(this)

		var angle = d.angle + d.dAngle 
		var rMean = (outerRadius(d) + innerRadius(d))/2

			//.attr("stroke-width", circleRadius/2 + 2)	

		var path = wrapGroup.append("path")
			.style("fill", function(d) {return d.color})
			.attr("d", arc)
			.on("mouseover", function(){
				return tooltip.style("visibility", "visible")
							  .text(d.name)
			})
			.on("mousemove", function(){
				return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")
							   .style("visibility", "visible")
							  .text(d.name)
			})
			.on("mouseout", function(){
				return tooltip.style("visibility", "hidden");
			});


		var circle = wrapGroup.append("circle")
			.attr("cx", getXfromAngleRadius(angle, rMean))
			.attr("cy", getYfromAngleRadius(angle, rMean))
			.attr("r", circleRadius)
			.attr("fill", d.color)
			.on("mouseover", function(){
				d3.select(this).attr("r", circleRadius * 1.3)
				return tooltip.style("visibility", "visible")
							  .text(d.name)
							  
			})
			.on("mousemove", function(){
				d3.select(this).attr("r", circleRadius * 1.3)
				return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")
							  .text(d.name)
			})
			.on("mouseout", function(){
				d3.select(this).attr("r", circleRadius * 1.0)
				return tooltip.style("visibility", "hidden")
			})
			/*.on("click", function() {
				wrapGroup
			})*/
		
		wrapGroup.on("click", function(d) {
			if (d.intensity > .7) d.intensity = 0.4
			else if(d.intensity > 0.4) d.intensity = 1
			else d.intensity = 0.7
			wrapGroup.attr("opacity", d.intensity)
		})

		
		wrapGroup.attr("opacity", d.intensity)



		function onDrag() {
		    var angle = findAngle(d3.event.x, d3.event.y);
		    console.log("ANGLE", angle)
		    transitionArcCircle(angle, path, circle)

		}


		circle.call(d3.behavior.drag().on('drag', onDrag))
	})
}




function transitionArcCircle(angle, arcPath, circle) { 


  	arcPath.transition()
    .duration(animateDuration)
    .ease("linear")
    .call(
      arcTweenandCircleTween,
      angle, 
      arcPath,
      circle
    );
}

// animate function
function arcTweenandCircleTween(transition, newAngle, arcPath, circle) {



	transition.attrTween("d", function(d) {
		var interpolate = d3.interpolate(d.angle + d.dAngle, newAngle);
		return function(t) {
		    d.angle = interpolate(t) - d.dAngle;
		            
		      // transalte circle
		    anglePoint = d.angle + d.dAngle;
		      //console.log(anglePoint)
		    moveCircle(anglePoint, circle);
		      
		    return arc(d);
		};
	});
}



function moveCircle(angle, circle) {
	var rMean
	circle.each(function(d) {

		rMean = (outerRadius(d) + innerRadius(d))/2

	})
	//console.log(rMean, angle)
	circle
		.attr("cx", getXfromAngleRadius(angle, rMean))
		.attr("cy", getYfromAngleRadius(angle, rMean))
    ;
}



function findAngle(x, y) {
    var addAngle = x < 0 ? 270 : 90;
    var angle360 = (Math.atan(y/x) * 180 / Math.PI) + addAngle; 
    return angle360 / 360 * tau
}


function innerRadius(d) {
	return  d.level * levelDepth + padding/2
}

function outerRadius(d) {
	return (d.level + 1) * levelDepth - padding/2
}

function getXfromAngleRadius(angle, r) {
    return Math.sin(angle) * r
}

function getYfromAngleRadius(angle, r) {
    return Math.cos(angle) * -r
}