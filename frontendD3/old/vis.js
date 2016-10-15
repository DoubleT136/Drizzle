data = [
	{
		filename: "drizzle.mpg",
		name: "Drizzle",
		x: 30,
		y: 30,
		r: 10,
		color: "red"
	},
	{
		filename: "crickets.mpg",
		name: "Crickets",
		x: 30,
		y: 80,
		r: 20,
		color: "blue"
	}
]

var container_width  = 200
var container_height = 150



var svg = d3.select("body").append("svg")
    .attr("width", container_width)
    .attr("height", container_height)
    .attr("class", "bubble");


var node = svg.selectAll(".node")
			.data(data)
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

node.append("title")
	.text(function(d) { return d.name; });

node.append("circle")
	.attr("r", function(d) { return d.r; })
    .style("fill", function(d) { return d.color; });


/*
var diameter = 960,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

d3.json("flare.json", function(error, root) {
  if (error) throw error;

  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.packageName); });

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.className.substring(0, d.r / 3); });
});

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");
*/