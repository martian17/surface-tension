var canvas = document.getElementById("canvas");
canvas.width = 300;
canvas.height = 300;

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
    
}


var getLeftCandidate = function(field,origin,e0){
    var edges = origin.edges;
    var dest = e0.verts[origin.id];
    var originAngle = Math.atan(dest.y-origin.y, dest.x-origin.x);
    
    //first sort by angle
    var es = [];
    for(var i in edges){
        var e = edges[i];
        if(e === e0)continue;//same edge, isnt worth checking
        var v2 = e.verts[origin.id];
        e.angle = (Math.atan(v2.y-origin.y, v2.x-origin.x)-originAngle+Math.PI*2)%Math.PI*2;
        if(e.angle < Math.PI)es.push(e);
    }
    if(es.length === 0)return false;
    es.sort((a,b)=>{//angle from small to big
        return a.angle-b.angle;//angle from small to big
    });
    for(var i = 0; i < es.length-1; i++){
        var cand1 = es[i].verts[origin.id];
        var cand2 = es[i+1].verts[origin.id];
        //if cand2 is inside the cand1 circle go on
        if(!isInside(origin,dest,cand1,   cand2)){//if cnad2 is inside all that
            //remove the edge
            field.removeEdge(ed[i]);
        }else{
            return cand1;
        }
    }
    return es[es.length-1].verts[origin.id];
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

