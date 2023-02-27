## Quadrilateral - Implementation Notes

@author Jesse Greenberg (PhET Interactive Simulations)

This document is a high-level description of the implementation for PhET's Quadrilateral simulation. It includes
an overview of the class hierarchy and responsibilities, as well as some specific information about tricky parts
of the implementation.

#### Model components
Here is an overview of the most important model components that determine simulation behavior.
- `QuadrilateralModel`: Entry point for the simulation model. Contains model subcomponents that manage simulation state and behavior.
- `QuadrilateralShapeModel`: Responsible for geometry and shape calculations and state. Has 4 Vertex and 4 Side instances.
- `Vertex`: Vertex as a `positionProperty` and an `angleProperty`. Most geometric properties of the quadrilateral are calculated from these two Properties. 
- `Side`: Side has a `lengthProperty` which is used to calculate geometric Properties. It is defined by two Vertices.
- `ParallelSideChecker`: Calculates whether a pair of opposite sides are parallel.
- `QuadrilateralShapeDetector`: Uses shape properties to determine the name of the quadrilateral.

#### Shape name detection
Shape detection in this sim works by tracking geometric properties of the shape. If the quadrilateral has the
geometric properties required for a named shape, it is a match. For named quadrilaterals, there are families of 
shapes such that as the quadrilateral gains more geometric properties, it will become a match for a name with
more specific requirements. Here is a diagram that illustrates the shape families, and properties that build up to 
more specific shapes.
<img src="https://user-images.githubusercontent.com/47331395/183741722-056b401f-8f97-4d55-a2c5-1726c3e27eb5.png" alt="Alt text" title="Optional title">

See QuadrilateralShapeDetector for the implementation of shape detection which matches this graphic.

#### View components

#### Voicing (description)

#### Prototypes