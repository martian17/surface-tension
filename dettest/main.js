//I give up! Bye bye!



"use strict";

/*
var mats = [
    new Float64Array(1),
    new Float64Array(4),
    new Float64Array(9),
    new Float64Array(16),
];*/

var determinant = function(mat,n){//might experiment with sparse array in the future
    if(n === 1)return mat[0];
    var det = 0;
    var kk = 1;
    //var mat2 = mats[n-2];//new Float64Array((n-1)*(n-1));
    var mat2len = (n-1)*(n-1);
    var buff = new ArrayBuffer(mat2len*8);
    var mat2 = new DataView(buff);
    for(var i = 0; i < n; i++){
        //yes!! float64array to the rescue!
        var jj = 0;
        for(var j = 0; j < n; j++){//horizontal (x)
            if(j === i)continue;
            for(var k = 1; k < n; k++){//vertical (y)
                //if((k-1)*(n-1)+jj >= bound || (k-1)*(n-1)+jj < 0)console.log("asdfasdf");
                mat2[(k-1)*(n-1)+jj] = mat[k*n+j];
            }
            jj++;
        }
        det += mat[i]*kk*determinant(mat2,n-1);
        kk *= -1;
    }
    return det;
};

for(var i = 0; i < 10000; i++){
    var det = determinant(new Float64Array([
    1,0,4,-6,
    2,5,0,3,
    -1,2,3,5,
    2,1,-2,3]),4);
}


var det = determinant(new Float64Array([
1,0,4,-6,
2,5,0,3,
-1,2,3,5,
2,1,-2,3]),4);

console.log(det);