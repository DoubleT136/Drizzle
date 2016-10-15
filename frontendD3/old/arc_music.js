var w = 400,
    h = 400,
    maxStep = 30
var cx = w/2, cy = h/2
var tau = 2 * Math.PI,
    anglePerStep = tau / maxStep,
    stepsPerAngle = maxStep / tau

var levelDepth = 30


data = [
    {
        name: "drizzle",
        level: 1,
        angle: 0,
        dAngle: 2
    }

]


var strokeColor = "#ffc000"

  // variable for arc
  , arcStartAngle = 0
  , arcInnerRadius = w / 2 - 20
  , arcOuterRadius = w / 2 - 10

  // variable for circle
  , circleRadius = 10
  , anglePoint = 0

  // variable for animate arc path
 // , maxStep = 24 * 60
  , currentStep = 0
  , animateDuration = 50
  ;

// create main svg
var svg = d3.select("body").append("svg:svg")
  .attr("width", w)
  .attr("height", h)
  .attr("id", "clock")
  ;

// create arc group
var arcGroup = svg.append("svg:g")
  .attr(
    "transform", 
    "translate(" + w / 2 + "," + h / 2 + ")"
  )
  ;

// create arc object (not display in svg,
// but use as data of path)
var arc = d3.svg.arc()
  .innerRadius( arcInnerRadius )
  .outerRadius( arcOuterRadius )
  .startAngle( arcStartAngle )
  ;

// create arc path

var arcPath = arcGroup.append("path")
  .datum({ endAngle: arcStartAngle })
  .style("fill", strokeColor)
  .attr("d", arc)
  ;

var circle = arcGroup.append("circle")
  .attr("r", circleRadius)
  .attr("fill", "#ffffff")
  .attr("stroke", strokeColor)
  .attr("stroke-width", circleRadius/2 + 2)

  // .attr("cx", 0)
  // .attr("cy", 5 + circleRadius - h/2)
  .attr("cursor", "move")
  .call( d3.behavior.drag().on('drag', function(){
    console.log(this)
    var angle = findAngle(d3.event.x, d3.event.y);
    setAngle(angle);
    
    // moveCircle(a);
  }) )
  ;

// init
setAngle(0);

// // register scroll event
// $('#clock').bind('mousewheel', function(e){
//   if ( e.originalEvent.wheelDelta<0 ){
//     currentStep--;
//   }
//   else {
//     currentStep++;
//   }
  
//   if ( currentStep<0 ) currentStep = 0;
//   if ( currentStep>maxStep ) currentStep = maxStep;
  
//   //console.log('currentStep:', currentStep);
  
//   setAngle(currentStep);
// });

// set animate step
function setAngle(angle) {
 
  //console.log('step:', step);
  
  arcPath.transition()
    .duration(animateDuration)
    .ease("linear")
    .call(
      arcTween,
      angle, 
      arc
    );
}

// animate function
function arcTween(transition, newAngle, arc) {
  //console.log('newAngle:', newAngle);
  // arc path transition
  transition.attrTween("d", function(d) {
    var interpolate = d3.interpolate(d.endAngle, newAngle);
    return function(t) {
      d.endAngle = interpolate(t);
      
      console.log('end angle:', d.endAngle, d.endAngle / anglePerStep / 4);
      
      // transalte circle
      anglePoint = d.endAngle;
      
      moveCircle(anglePoint);
      
      return arc(d);
    };
  });
}

function angleToStep(angle) {
  return angle * stepsPerAngle;
}

function stepToAngle(step) {
  return step * anglePerStep;
}





function findAngle(x, y) {
    var addAngle = x < 0 ? 270 : 90;
    var angle360 = (Math.atan(y/x) * 180 / Math.PI) + addAngle; 
    return angle360 / 360 * tau
}

function moveCircle(angle) {
  var r = h/2 - 15;
  var x = r * Math.sin(angle);
  var y = -r * Math.cos(angle);
  
  circle
    .attr("cx", x)
    .attr("cy", y)
    ;
}



function getXfromAngleRadius(angle, r) {
    return Math.sin(angle) * r
}

function getYfromAngleRadius(angle) {
    return Math.cos(angle) * -r
}

// ===
console.log('[done]');