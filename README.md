<h1>Calculating π using surface tension and delaunay triangulation</h1>
Inspiration: <a target="_blank" href="https://www.youtube.com/watch?v=lmgCgzjlWO4">Calculating π with Avogadro's Number</a><br>
Thanks zu for the idea!<br>
<br>
<h2>Brief description</h2>
This program uses simulated molecules with surface tension to calculate pi.<br>
First molecules are evenly spread out on the canvas, and then a square section of know area is cut out from the middle,<br>
Therefore subecting the blob in the middle to surface tension, making them round in shape.<br>
From here, I simply reverse Area = πr^2 to calculate pi.<br>
<br>
<h2>Delaunay triangulation</h2>
In order to simulate molecular bonds, I kept applying delaunay triangulation to the set of molecules each frames,<br>
and did a spring force calculation to slightly advance the molecule's position.<br>
Using delaunay triangulation has a nice effect of cutting faraway bonds while retaining bonds that are close to the edge<br>
<a target="_blank" href="https://codepen.io/MartianLord/full/MWJGBbY">Demo</a><br>
<a target="_blank" href="https://github.com/martian17/surface-tension">Github</a><br>