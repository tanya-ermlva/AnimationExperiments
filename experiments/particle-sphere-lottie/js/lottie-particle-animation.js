// Play the provided Lottie animation JSON file

document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.lottie-animation');
    if (containers.length > 0) {
        const anim = lottie.loadAnimation({
            container: containers[0],
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'Grid-Being-Shaped.json'
        });

        anim.addEventListener('DOMLoaded', () => {
            // Remove black background by setting SVG background to transparent
            const svg = containers[0].querySelector('svg');
            if (svg) {
                svg.style.background = 'none';
                svg.style.backgroundColor = 'transparent';
            }
            
            // Display animation information
            const durationElement = containers[0].querySelector('#duration');
            const framesElement = containers[0].querySelector('#frames');
            
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
            containers[0].innerHTML = '<div style="color: white; text-align: center; padding-top: 50%;">Failed to load animation</div>';
        });
    }
}); 