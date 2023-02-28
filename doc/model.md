## Quadrilateral - Model description

@author Jesse Greenberg (PhET Interactive Simulations)

This document is a high-level description of the model used in PhET's Quadrilateral simulation.

### Overview

This simulation is all about the quadrilateral. The user can play with a 4-sided shape to change geometric
properties, and see how geometric properties "build-up" to define specific named quadrilaterals.

#### Geometric properties and the shape name 
The quadrilateral has geometric properties, such as the number of parallel sides, number of equal angles,
and number of equal side lengths. The name of the quadrilateral is determined by its geometric properties.
There are families of shapes that share overlapping geometric properties, and within those families, properties
"build-up" to create named shapes with more specific requirements. For example:
- "Convex Quadrilateral" has no relevant geometric properties
- "Trapezoid" has one pair of parallel sides
- "Isosceles Trapezoid" has the properties of "Trapezoid" plus two equal adjacent angles and one pair of equal opposite side lengths.
- "Parallelogram" has the properties of "Isosceles Trapezoid" plus two pairs of parallel sides, two pairs of equal opposite angles, and two pairs of equal opposite side lengths. 

So you can see how shape properties "build-up" from the general convex quadrilateral to the more specific "parallelogram".

Here is a full diagram showing the geometric properties associated with each quadrilateral shape. Each family of shapes
is a path through this graph. As shapes gain geometric properties, they become a more specific shape within that
shape family.
<img src="https://user-images.githubusercontent.com/6396244/221933377-fdc7d16e-9edb-4974-bf9a-eff72ce49af0.png" alt="Alt text" title="Optional title">

#### Tolerance Intervals
This simulation uses tolerance intervals to make it easier to create geometric properties and work well with precision
errors. For example, placing Vertices at exact positions to create exact
90 degree angles would be impossible, especially for rotated shapes. So when angles or lengths are "equal", they are
equal enough for the purposes of this simulation but may be slightly different.

The tolerance intervals are defined in QuadrilateralQueryParameters and can be changed. They include
- parallelAngleToleranceInterval: Used when comparing Vertex angles to determine whether sides are parallel.
- interAngleToleranceInterval: Used when comparing Vertex angles to determine if they are equal.
- staticAngleToleranceInterval: Used when comparing an angle to a static constant.
- interLengthToleranceInterval: Used when comparing lengths of two sides to determine if they are equal

The default tolerance intervals are small enough to not create incorrectly named shapes, but are large enough to
make finding shapes easy for all forms of input.