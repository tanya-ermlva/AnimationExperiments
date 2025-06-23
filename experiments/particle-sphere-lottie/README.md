# Particle Sphere Gathering (Lottie Version)

This is a Lottie-based implementation of the particle sphere gathering experiment, designed to demonstrate the performance benefits and limitations of using Lottie for particle animations.

## Performance Comparison

### Original Three.js Version
- **Particles**: 3,000
- **Rendering**: WebGL (Three.js)
- **Dimensions**: 3D space
- **File Size**: ~150KB (JavaScript + Three.js library)
- **Performance**: CPU/GPU intensive, requires continuous rendering
- **Interactivity**: High - real-time duration control
- **Mobile Performance**: Can be challenging on older devices

### Lottie Version
- **Particles**: 500 (reduced for optimal performance)
- **Rendering**: Hardware-accelerated SVG
- **Dimensions**: 2D space
- **File Size**: ~45KB (JSON data)
- **Performance**: Optimized, battery-friendly
- **Interactivity**: Limited - speed control only
- **Mobile Performance**: Excellent across all devices

## Technical Implementation

### Key Features
1. **Programmatic Generation**: The Lottie JSON is generated entirely in JavaScript
2. **Keyframe Optimization**: Keyframes are spaced every 5-20 frames to reduce file size
3. **Color Transitions**: Smooth white → red → blue color transitions
4. **Easing Functions**: Cubic easing for natural movement
5. **Size Variation**: Particles have varying sizes with subtle pulsing effects

### Limitations
1. **2D Only**: No true 3D rotation or depth
2. **Fixed Duration**: Animation duration is baked into the JSON
3. **Reduced Particles**: Limited to 500 particles for optimal performance
4. **Less Dynamic**: No real-time parameter changes

## When to Use Lottie vs Three.js

### Use Lottie When:
- ✅ Mobile performance is critical
- ✅ Battery life is important
- ✅ Animation is relatively simple
- ✅ File size matters
- ✅ Consistent playback across devices needed
- ✅ Animation doesn't need real-time interaction

### Use Three.js When:
- ✅ 3D effects are required
- ✅ Real-time interaction is needed
- ✅ Complex particle physics
- ✅ Dynamic parameter changes
- ✅ High particle counts
- ✅ Custom shaders or effects

## File Structure
```
particle-sphere-lottie/
├── index.html          # Main experiment page
├── js/
│   └── lottie-particle-animation.js  # Lottie generation logic
└── README.md           # This file
```

## Browser Compatibility
- Modern browsers with Lottie support
- Mobile browsers (excellent performance)
- No WebGL requirements
- Works offline once loaded 