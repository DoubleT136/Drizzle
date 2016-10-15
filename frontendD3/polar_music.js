var w = 600//window.innerWidth,
    h = 600 //window.innerHeight

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


var data = [
    {
        name: "drizzle",
        level: 1,
        angle: 1,
        dAngle: 1,
        color: "red",
        id: getId()
    },
    {
        name: "fire",
        level: 2,
        angle: 2,
        dAngle: 1,
        color: "green",
        id: getId()
    },
    {
        name: "fire",
        level: 3,
        angle: 2,
        dAngle: 1,
        color: "blue",
        id: getId()
    },
    {
        name: "fire",
        level: 4,
        angle: 2,
        dAngle: 1,
        color: "orange",
        id: getId()
    }
]


var data2 = [
    {
        name: "cdscd",
        level: 1,
        angle: 1,
        dAngle: 1,
        color: "red",
        id: getId()
    },
    {
        name: "fds",
        level: 2,
        angle: 2,
        dAngle: 1,
        color: "green",
        id: getId()
    },
    {
        name: "rtewew",
        level: 3,
        angle: 2,
        dAngle: 1,
        color: "blue",
        id: getId()
    },
    {
        name: "jtyrh",
        level: 4,
        angle: 2,
        dAngle: 1,
        color: "orange",
        id: getId()
    },
    {
        name: "jtyrh",
        level: 5,
        angle: 3,
        dAngle: 1,
        color: "purple",
        id: getId()
    }
]



// add tool tip
var tooltip = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
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

// var arcGroups = arcGroup.selectAll("g")
// 	.data(data).enter()
// 	.append("g")

// create arc path
// var arcPaths = arcGroup.selectAll("path")
// 	.data(data).enter()
// 	.append("path")

// arcPaths

var arcGroups = arcGroup.selectAll("g")
	.data(data).enter()
	.append("g")
updateArcGroups(arcGroups)





function updateArcGroups(arcGroups) {
	arcGroups.each(function(d) {
		// console.log(d)
		// console.log(d3.select(d))
		// console.log(this)
		// console.log(d3.select(this))

		var angle = d.angle + d.dAngle 
		var rMean = (outerRadius(d) + innerRadius(d))/2

			//.attr("stroke-width", circleRadius/2 + 2)	

		var path = d3.select(this).append("path")
			.style("fill", function(d) {return d.color})
			.attr("d", arc)
			.on("mouseover", function(){
				return tooltip.style("visibility", "visible")
							  .text(d.name)
			})
			.on("mousemove", function(){
				return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")
							  .text(d.name)
			})
			.on("mouseout", function(){
				return tooltip.style("visibility", "hidden");
			});

		// path.append("text")
		//     .attr("dy", ".35em")
		//     .attr("dx", ".75em")
		//     .style("text-anchor", "start")
		//   .append("textPath")
		//     .attr("startOffset", "50%")
		//     .attr("class", "arc-text")
		//     .text(function(d) { return d.name; });
		//     //.attr("xlink:href", function(d, i) { return "#arc-center-" + i; });

		var circle = d3.select(this).append("circle")
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
			});




		function onDrag() {
		    var angle = findAngle(d3.event.x, d3.event.y);
		    console.log("ANGLE", angle)
		    transitionArcCircle(angle, path, circle)

		}


		circle.call(d3.behavior.drag().on('drag', onDrag))
	})
}

function addGroups(newGroups) {
	data = data.concat(newGroups)

	var arcGroups = arcGroup.selectAll("g")
		.data(data).enter()
		.append("g")

	console.log("ARC GROUP: ", data)
	updateArcGroups(arcGroups)
}

addGroups(data2)

console.log(data, data2)


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
  //console.log('newAngle:', newAngle);
  // arc path transition
 //	var roundTop = false
  // arcPath.each(function(d) {
  // 	if (d.angle + d.dAngle > tau - .2 && newAngle > 0) {
  // 		console.log("FOUND BAD", d.angle + d.dAngle, newAngle)
  // 		d.angle = newAngle
  // 		moveCircle(anglePoint, circle)
  // 		roundTop = true

  // 	}
  // })

  //if (roundTop) return
  // if (newAngle == 0) {
  // 	d.angle = 0
  // 	moveCircle(0, circle)
  // }




	transition.attrTween("d", function(d) {
		// if (d.angle + d.dAngle > 3/4 * tau && newAngle > 0 && newAngle < 1/4 * tau) {
		// 	var interpolateToTau = d3.interpolate

		// }

		//else {
			var interpolate = d3.interpolate(d.angle + d.dAngle, newAngle);
			return function(t) {
			    d.angle = interpolate(t) - d.dAngle;
			            
			      // transalte circle
			    anglePoint = d.angle + d.dAngle;
			      //console.log(anglePoint)
			    moveCircle(anglePoint, circle);
			      
			    return arc(d);
			
		//}

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
//   .attr("fill", "#ffffff")
//   .attr("stroke", "red")
//   .attr("stroke-width", circleRadius/2 + 2)

//   .attr("cursor", "move")
//   .call( d3.behavior.drag().on('drag', function(){
//     console.log(this)
//     var angle = findAngle(d3.event.x, d3.event.y);
//     setAngle(angle);
    
//     // moveCircle(a);
//   }) )


