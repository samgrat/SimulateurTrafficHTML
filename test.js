var i = [];
for( var k=0; k<4; k++ ) {
	i.push([]);}
	


function init(){
console.log(i)
var circle = new createjs.Shape();
circle.end = new Boolean(false)
i[Math.floor(Math.random() * 4)].push(circle)

console.log(i)
}

function disp(){
	console.log(i)
}