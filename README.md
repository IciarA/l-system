# L-Systems

Spring 2020  
Iciar Andreu Angulo  
PennKey: iciar

Demo: https://iciara.github.io/l-system/

![](plant.png)

## Main Features
The L-System used to create this plant is:

X -> A  
A -> BTTA  
B1 -> T[&F*][&F*][&F*][&F*]  
B2 -> T[&F*][&F*][&F*][&F*][&F*]  
F -> F+F  

Where:
- **T and F** : move the turtle forward.
- **+** : rotates each section of the branches around the Z-axis.
- **&** : rotates the branch around the Y-axis.
- **\*** : represents the flowers.

- **B** : divides randomly between B1 and B2 (to change number of branches created each time).

## GUI Features
![](generalPlant.png)
- **Iterations**: the number of iterations of the l-system the plant goes through.  
More Iterations (iterations = 11):
![](moreIterations2.png)

- **Rotation**: How much each branch rotates to create the circular shapes.  
With more rotation (rotation = 34):
![](moreRotation.png)
With less rotation (rotation = 7):
![](lessRotation.png)

- **Flower Color**: Change the color or the flowers (which are at the end of each branch).
Changed color to light blue:
![](changeFlowers.png)


## Resources
- http://algorithmicbotany.org/papers/abop/abop-ch1.pdf
- https://learnopengl.com/Advanced-OpenGL/Instancing
- http://www.opengl-tutorial.org/intermediate-tutorials/billboards-particles/particles-instancing/
- http://glmatrix.net
