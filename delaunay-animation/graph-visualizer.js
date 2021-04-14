var Field = function(canvas){
    var width = canvas.width;
    var height = canvas.height;
    var ctx = canvas.getContext("2d");
    var verts = {};
    var edges = {};
    this.verts = verts;
    this.edges = edges;
    var that = this;
    this.r = 5;
    
    var idd = 0;
    var genid = function(){
        return idd++;
    }
    
    this.addVert = function(x,y){
        var id = genid();
        vert = {
            id,x,y,edges:{}
        };
        verts[id] = vert;
        return vert;
    };
    this.addEdge = function(v1,v2){
        var id = genid();
        edge = {
            id,verts:{}
        };
        edge.verts[v1.id] = v2;
        edge.verts[v2.id] = v1;
        v1.edges[id] = edge;
        v2.edges[id] = edge;
        edges[id] = edge;
        return edge;
    };
    this.removeVert = function(vert){
        var es = vert.edges;
        for(var i in es){
            that.removeEdge(es[i]);
        }
        delete verts[vert.id]
    };
    this.removeEdge = function(edge){
        //removing all traces
        var vs = edge.verts;
        for(var i in vs){
            delete vs[i].edges[edge.id];
        }
        delete edges[edge.id];
    };
    this.render = function(){
        ctx.clearRect(0,0,width,height);
        ctx.fillStyle = "#fff"
        ctx.fillRect(0,0,width,height);
        for(var i in verts){
            var v = verts[i];
            ctx.beginPath();
            ctx.arc(v.x,v.y,v.r || that.r,0,6.28);
            ctx.closePath();
            ctx.fillStyle = v.color || "#000";
            ctx.fill();
            //drawing the number
            ctx.strokeText(v.id,v.x+5,v.y-5);
        }
        for(var i in edges){
            var e = edges[i];
            ctx.beginPath();
            for(var j in e.verts){
                var v = e.verts[j];
                ctx.lineTo(v.x,v.y);
            }
            ctx.stroke();
        }
    };
    this.ctx = ctx;
    this.resetEdges = function(){
        for(var i in edges){
            var e = edges[i];
            that.removeEdge(e);
        }
    };
};