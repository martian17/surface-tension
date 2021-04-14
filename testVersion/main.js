var determinant = function(mat,n){//might experiment with sparse array in the future
    if(n === 1)return mat[0];
    var det = 0;
    var kk = 1;
    var mat2 = new Array((n-1)*(n-1));
    var mat2len = mat2.length;
    var bound = (n-1)*(n-1);
    for(var i = 0; i < n; i++){
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


var atan2pos = function(a,b){
    var angle = Math.atan2(a,b);
    return (angle+Math.PI*2)%(Math.PI*2);
};

var rectifyAngle = function(a){
    return (a+Math.PI*4)%(Math.PI*2);
};

var isInside = function(a,b,c,   d){
    var det = determinant([
        a.x,a.y,a.x*a.x+a.y*a.y,1,
        b.x,b.y,b.x*b.x+b.y*b.y,1,
        c.x,c.y,c.x*c.x+c.y*c.y,1,
        d.x,d.y,d.x*d.x+d.y*d.y,1,
    ],4);
    return det>0;
};


var getLeftCandidate = async function(field,origin,e0){
    var edges = origin.edges;
    var dest = e0.verts[origin.id];
    var originAngle = Math.atan(dest.y-origin.y, dest.x-origin.x);
    
    //first sort by angle
    var es = [];
    for(var i in edges){
        var e = edges[i];
        if(e === e0)continue;//same edge, isnt worth checking
        var v2 = e.verts[origin.id];
        //atan(a*conj(o))
        var or = dest.x-origin.x;
        var oi = -(dest.y-origin.y);//complex conjugate
        var ar = v2.x-origin.x;
        var ai = v2.y-origin.y;
        var ar1 = or*ar-oi*ai;
        var ai1 = or*ai+oi*ar;
        e.angle = atan2pos(ai1,ar1);//e.angle = (Math.atan(v2.y-origin.y, v2.x-origin.x)-originAngle+Math.PI*2)%Math.PI*2;
        if(e.angle < Math.PI)es.push(e);
    }
    if(es.length === 0)return false;
    es.sort((a,b)=>{//angle from small to big
        return a.angle-b.angle;//angle from small to big
    });
    console.log(es);
    for(var i = 0; i < es.length; i++){
        es[i].verts[origin.id].color = "#0f0";
        field.render();
        field.ctx.fillText(es[i].angle,es[i].verts[origin.id].x,es[i].verts[origin.id].y);
        await pause(1000);
        es[i].verts[origin.id].color = "#000";
    }
    for(var i = 0; i < es.length-1; i++){
        var cand1 = es[i].verts[origin.id];
        var cand2 = es[i+1].verts[origin.id];
        //if cand2 is inside the cand1 circle go on
        if(isInside(origin,dest,cand1,   cand2)){//if cnad2 is inside all that
            //remove the edge
            field.removeEdge(es[i]);
        }else{
            return cand1;
        }
    }
    return es[es.length-1].verts[origin.id];
};



var getRightCandidate = async function(field,origin,e0){
    var edges = origin.edges;
    var dest = e0.verts[origin.id];
    var originAngle = Math.atan(dest.y-origin.y, dest.x-origin.x);
    
    //first sort by angle
    var es = [];
    for(var i in edges){
        var e = edges[i];
        if(e === e0)continue;//same edge, isnt worth checking
        var v2 = e.verts[origin.id];
        //atan(conj(a*conj(o)))
        var or = dest.x-origin.x;
        var oi = -(dest.y-origin.y);//complex conjugate
        var ar = v2.x-origin.x;
        var ai = v2.y-origin.y;
        var ar1 = or*ar-oi*ai;
        var ai1 = or*ai+oi*ar;
        e.angle = atan2pos(-ai1,ar1);//e.angle = (Math.atan(v2.y-origin.y, v2.x-origin.x)-originAngle+Math.PI*2)%Math.PI*2;
        if(e.angle < Math.PI)es.push(e);
    }
    if(es.length === 0)return false;
    es.sort((a,b)=>{//angle from small to big
        return a.angle-b.angle;//angle from small to big
    });
    console.log(es);
    for(var i = 0; i < es.length; i++){
        es[i].verts[origin.id].color = "#0f0";
        field.render();
        field.ctx.fillText(es[i].angle,es[i].verts[origin.id].x,es[i].verts[origin.id].y);
        await pause(1000);
        es[i].verts[origin.id].color = "#000";
    }
    for(var i = 0; i < es.length-1; i++){
        var cand1 = es[i].verts[origin.id];
        var cand2 = es[i+1].verts[origin.id];
        //if cand2 is inside the cand1 circle go on
        if(isInside(dest,origin,cand1,   cand2)){//if cnad2 is inside all that
            //remove the edge
            field.removeEdge(es[i]);
        }else{
            return cand1;
        }
    }
    return es[es.length-1].verts[origin.id];
};



var findBaseEdge = function(leftPivot,rightPivot){
    var cnt2 = 0;
    console.log("findBaseEdge");
    while(true){
        var modifiedFlag = false;
        cnt2++;
        if(cnt2 > 5)return false;
        console.log(cnt2)
        //left edges
        var or = rightPivot.x-leftPivot.x;
        var oi = -(rightPivot.y-leftPivot.y);//complex conjugate
        
        var smallestAngleVert = false;
        for(var i in leftPivot.edges){
            var e = leftPivot.edges[i];
            var v2 = e.verts[leftPivot.id];
            console.log([leftPivot,rightPivot,v2]);
            //if v2 is over the edge, change leftPivot and continue
            var ar = v2.x-leftPivot.x;
            var ai = v2.y-leftPivot.y;
            var ar1 = or*ar-oi*ai;
            var ai1 = or*ai+oi*ar;
            var angle = rectifyAngle(-Math.atan2(ai1,ar1));
            v2.angle = angle;
            console.log(angle);
            if(!smallestAngleVert){
                smallestAngleVert = v2;
            }else if(smallestAngleVert.angle > angle){
                smallestAngleVert = v2;
            }
        }
        if(smallestAngleVert && smallestAngleVert.angle < Math.PI){
            leftPivot = smallestAngleVert;
            modifiedFlag = true;
        }
        
        //right edges
        var or = leftPivot.x-rightPivot.x;
        var oi = -(leftPivot.y-rightPivot.y);//complex conjugate
        
        var smallestAngleVert = false;
        for(var i in rightPivot.edges){
            var e = rightPivot.edges[i];
            var v2 = e.verts[rightPivot.id];
            //if v2 is over the edge, change leftPivot and continue
            var ar = v2.x-rightPivot.x;
            var ai = v2.y-rightPivot.y;
            var ar1 = or*ar-oi*ai;
            var ai1 = or*ai+oi*ar;
            var angle = rectifyAngle(Math.atan2(ai1,ar1));
            v2.angle = angle;
            if(!smallestAngleVert){
                smallestAngleVert = v2;
            }else if(smallestAngleVert.angle > angle){
                smallestAngleVert = v2;
            }
        }
        if(smallestAngleVert && smallestAngleVert.angle < Math.PI){
            rightPivot = smallestAngleVert;
            modifiedFlag = true;
        }
        
        if(!modifiedFlag)return [leftPivot,rightPivot]
    }
};




var cnt = 0;

var divideAndConquerTest = function(field,arr){
    //if(cnt > 100)return false;
    //cnt++;
    if(arr.length <= 3){//then form triangles all you want
        var ymin = arr[0];
        for(var i = 0; i < arr.length; i++){
            if(ymin.y > arr[i].y){//finding the minimum y vertex
                ymin = arr[i];
            }
            for(var j = i+1; j < arr.length; j++){
                field.addEdge(arr[i],arr[j]);
            }
        }
        return [ymin,0];
    }else{
        var middle = Math.floor(arr.length/2);
        var ll = arr.slice(0,middle);
        var rr = arr.slice(middle);
        var leftPivot = divideAndConquerTest(field,ll);
        var rightPivot = divideAndConquerTest(field,rr);
        var ymin = leftPivot.y < rightPivot.y ? leftPivot : rightPivot;
        //if(depth === 1)return [ymin,depth];//test code
        //merging
        while(true){
            var e = field.addEdge(leftPivot,rightPivot);
            var leftCandidate = getLeftCandidate(field,leftPivot,e);
            var rightCandidate = getRightCandidate(field,rightPivot,e);
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
};

var pause = function(t){
    return new Promise((res,rej)=>{
        setTimeout(res,t);
    })
};

var divideAndConquer = async function(field,arr){
    //if(cnt > 100)return false;
    //cnt++;
    if(arr.length <= 3){//then form triangles all you want
        var ymin = arr[0];
        for(var i = 0; i < arr.length; i++){
            if(ymin.y > arr[i].y){//finding the minimum y vertex
                ymin = arr[i];
            }
            for(var j = i+1; j < arr.length; j++){
                field.addEdge(arr[i],arr[j]);
            }
        }
        field.render();
        await pause(1000);
        return ymin;
    }else{
        var middle = Math.floor(arr.length/2);
        var ll = arr.slice(0,middle);
        var rr = arr.slice(middle);
        var leftPivot = await divideAndConquer(field,ll);
        var rightPivot = await divideAndConquer(field,rr);
        [leftPivot,rightPivot] = findBaseEdge(leftPivot,rightPivot);
        var ymin = leftPivot.y < rightPivot.y ? leftPivot : rightPivot;
        //merging
        while(true){
            await pause(1000);
            var e = field.addEdge(leftPivot,rightPivot);
            leftPivot.color = "#f00";
            rightPivot.color = "#f00";
            field.render();
            var leftCandidate = await getLeftCandidate(field,leftPivot,e);
            var rightCandidate = await getRightCandidate(field,rightPivot,e);
            console.log(leftCandidate);
            console.log(leftCandidate);
            leftPivot.color = "#000";
            rightPivot.color = "#000";
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
};

var generatetriangulation = async function(field){
    //divide and conquer algorithm to delaunay triangulation
    var ps = [];
    for(var i in field.verts){
        ps.push(field.verts[i]);
    }
    ps.sort((a,b)=>a.x-b.x);//sorting small to big x
    console.log(ps);
    field.resetEdges();
    await divideAndConquer(field,ps);
};


var canvas = document.getElementById("canvas");
var width = 500;
var height = 300;
canvas.width = width;
canvas.height = height;

var field = new Field(canvas);

/*
for(var i = 0; i < 5; i++){
    field.addVert(Math.random()*width,Math.random()*height);
}
*/
field.addVert(95.13964277361764,185.68910148899235);
field.addVert(147.09215740525772,250.6346584612596);
field.addVert(67.37463104850072,199.13962012789048);
field.addVert(493.0871408195855,299.995660743562);
field.addVert(174.05583583535721,59.01190928082014);

generatetriangulation(field);

field.render();

/*
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
*/
