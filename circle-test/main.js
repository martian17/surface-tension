var determinant = function(mat,n){//might experiment with sparse array in the future
    if(n === 1)return mat[0];
    var det = 0;
    var kk = 1;
    var mat2 = new Array((n-1)*(n-1));
    var mat2len = mat2.length;
    var bound = (n-1)*(n-1);
    for(var i = 0; i < n; i++){
        //yes!! float64array to the rescue!
        var jj = 0;
        for(var j = 0; j < n; j++){//horizontal (x)
            if(j === i)continue;
            for(var k = 1; k < n; k++){//vertical (y)
                if((k-1)*(n-1)+jj >= bound || (k-1)*(n-1)+jj < 0)console.log("asdfasdf");
                mat2[(k-1)*(n-1)+jj] = mat[k*n+j];
            }
            jj++;
        }
        det += mat[i]*kk*determinant(mat2,n-1);
        kk *= -1;
    }
    if(mat2len !== mat2.length){
        console.log("ourof bound");
    }
    return det;
};


var isInside = function(a,b,c,   d){
    var det = determinant([
        a.x,a.y,a.x*a.x+a.y*a.y,1,
        b.x,b.y,b.x*b.x+b.y*b.y,1,
        c.x,c.y,c.x*c.x+c.y*c.y,1,
        d.x,d.y,d.x*d.x+d.y*d.y,1,
    ],4);
    return det>0;
    //if(det > 0){//then d is inside
    //    
    //}
};



var width = 500;
var height = 500;
var canvas = document.getElementById("canvas");
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");


//setting up a,b,c
var Point = function(a){
    this.a = a;
    this.r = 5;
}

var center = {};
center.x = width/2;
center.y = height/2;
center.r = width/3;
var a = new Point(2);
var b = new Point(3);
var c = new Point(6);
var points = [a,b,c];
for(var i = 0; i < points.length; i++){
    var p = points[i];
    p.x = center.x+Math.cos(p.a)*center.r;
    p.y = center.y+Math.sin(p.a)*center.r;
}
var d = new Point(0);
points.push(d);



canvas.addEventListener("mousemove",function(e){
    var x = window.scrollX+e.clientX-this.offsetLeft;
    var y = window.scrollY+e.clientY-this.offsetTop;
    handleMouseMove(x,y);
});


var handleMouseMove = function(x,y){
    d.x = x;
    d.y = y;
    ctx.clearRect(0,0,width,height);
    ctx.beginPath();
    ctx.arc(center.x,center.y,center.r,0,6.28);
    ctx.closePath();
    ctx.strokeStyle = "#f00";
    if(isInside(a,b,c,d))ctx.strokeStyle = "#0f0";
    ctx.stroke();
    //plotting points
    for(var i = 0; i < points.length; i++){
        var p = points[i];
        ctx.beginPath();
        ctx.arc(p.x,p.y,5,0,6.28);
        ctx.closePath();
        ctx.fillStyle = "#000";
        ctx.fill();
    }
};

handleMouseMove(0,0);