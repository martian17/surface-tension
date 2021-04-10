var canvas = document.getElementById("canvas");
canvas.width = 300;
canvas.height = 300;


var getLeftCandidate = function(origin,e0){
    var edges = origin.edges;
    var dest = e0.verts[origin.id];
    var originAngle = Math.atan(dest.y-origin.y, dest.x-origin.x);
    //first sort by angle
}


var getLeftCandidate = function(origin,e0){
    //first sort it by angle
    var edges = origin.edges;
    var dest = e0.verts[1];
    if(e0.verts[1] === origin){
        dest = e0.verts[0];
    }
    var originAngle = Math.atan(dest.y-origin.y, dest.x-origin.x);
    
    
    var es = [];
    for(var i in edges){
        var e = edges[i];
        if(e === e0)continue;//same edge, isnt worth checking
        es.push(e);
        var v1 = e.verts[0];
        var v2 = e.verts[1];
        if(v1 === origin){
            var temp = v1;
            v1 = v2;
            v2 = temp;//now v2 is the destination
        }
        var dx = v2.x - v1.x;
        var dy = v2.y - v1.y;
        e.angle = (Math.atan2(dy,dx)-originAngle+2*Math.PI)%(2*Math.PI);
    }
    es.sort((a,b)=>{//angle from small to big
        return a.angle-b.angle;//angle from small to big
    });
    for(var i = 0; i < es.length; i++){
        var edge = es[i];
        var vert = edge.verts[1];
        if(edge.verts[1] === origin){
            vert = edge.verts[0];
        }
        //now vert is the candidate
    }
    
};



var divideAndConquer = function(arr){
    if(arr.lenght <= 3){//then form it all you want
        var ymin = arr[0];
        for(var i = 0; i < arr.length; i++){
            if(ymin.y > arr[i].y){//finding the minimum y vertex
                ymin = arr[i];
            }
            for(var j = i+1; j < arr.length; j++){
                field.addEdge(arr[i],arr[j]);
            }
        }
        return ymin;
    }else{
        var middle = Math.floor(arr.length/2);
        var ll = arr.slice(0,middle);
        var rr = arr.slice(middle);
        var leftPivot = divideAndConquer(arr.slice(ll));
        var rightPivot = divideAndConquer(arr.slice(rr));
        var ymin = leftPivot.y < rightPivot.y ? leftPivot : rightPivot;
        //merging
        while(true){
            field.addEdge(leftPivot,rightPivot);
            var leftCandidates = sortEdges(leftPivot.edges,e);//sorts it countet clock wise
            var leftCandidate = getLeftCandidate(leftPivot,e);
            var rightCandidate = getRightCandidate(rightPivot,e);
            if(!leftCandidate && !rightCandidate){
                //no more points to add
                //returning
                return ymin;
            }else if(!rightCandidate){
                leftPivot = leftCandidate;
            }else if(!leftCandidate){
                rightPivot = rightCandidate;
            }else{
                //comparison between left and right pivot
                if(isInside(leftPivot,rightPivot,rightCandidate,   leftCandidate)){
                    leftPivot = leftCandidate;
                }else{
                    rightPivot = rightCandidate;
                }
            }
        }
    }
}

var generatetriangulation = function(points){
    //divide and conquer algorithm to delaunay triangulation
    var ps = [];
    for(var i in points){
        ps.push(points);
    }
    ps.sort((a,b)=>a.x-b.x);//sorting small to big x
    return divideAndConquer(ps);
};

var field = new Field(canvas);
var waterMoleculeSimulation = function(n){
    var mols = [];
    
    for(){
        
    }
}



var start = 0;
var animate = function(t){
    if(start === 0)start = t;
    var dt = (t - start)/1000;//now things are in seconds, not in milliseconds
    start = t;
    field.render();
    requestAnimationFrame(animate);
};

requestAnimationFrame(animate);

