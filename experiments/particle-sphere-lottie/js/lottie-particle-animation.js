// Play the provided Lottie animation JSON file

document.addEventListener('DOMContentLoaded', () => {
    const anim = lottie.loadAnimation({
        container: document.getElementById('lottie-animation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'Grid3.json'
    });

    anim.addEventListener('DOMLoaded', () => {
        // Remove black background by setting SVG background to transparent
        const svg = document.querySelector('#lottie-animation svg');
        if (svg) {
            svg.style.background = 'none';
            svg.style.backgroundColor = 'transparent';
        }
        
        // Display animation information
        const durationElement = document.getElementById('duration');
        const framesElement = document.getElementById('frames');
        
        if (durationElement) {
            const durationInSeconds = anim.getDuration() / 1000;
            durationElement.textContent = durationInSeconds.toFixed(1) + 's';
        }
        
        if (framesElement) {
            const totalFrames = anim.getDuration() * anim.frameRate / 1000;
            framesElement.textContent = Math.round(totalFrames);
        }
    });

    anim.addEventListener('data_failed', () => {
        // Show a fallback message if the animation fails to load
        const container = document.getElementById('lottie-animation');
        container.innerHTML = '<div style="color: white; text-align: center; padding-top: 50%;">Failed to load animation</div>';
    });
}); 