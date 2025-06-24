// Load and play the geometric pattern evolution Lottie animation

document.addEventListener('DOMContentLoaded', () => {
    const anim = lottie.loadAnimation({
        container: document.getElementById('lottie-animation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'Fields Circles.json'
    });

    anim.addEventListener('DOMLoaded', () => {
        // Remove black background by setting SVG background to transparent
        const svg = document.querySelector('#lottie-animation svg');
        if (svg) {
            svg.style.background = 'none';
            svg.style.backgroundColor = 'transparent';
        }
        
        console.log('Geometric pattern animation loaded successfully');
        console.log('Duration:', anim.getDuration() / 1000, 'seconds');
        console.log('Frame rate:', anim.frameRate, 'fps');
    });

    anim.addEventListener('data_failed', (error) => {
        console.error('Failed to load geometric pattern animation:', error);
        
        // Show a fallback message if the animation fails to load
        const container = document.getElementById('lottie-animation');
        container.innerHTML = `
            <div style="
                color: #7669DD; 
                text-align: center; 
                padding-top: 50%; 
                font-size: 18px;
                font-weight: 600;
            ">
                Failed to load geometric pattern
                <div style="font-size: 48px; margin-top: 20px;">🔷</div>
            </div>
        `;
    });

    // Add play/pause controls if needed
    anim.addEventListener('enterFrame', () => {
        // Optional: Add any frame-specific logic here
    });
}); 