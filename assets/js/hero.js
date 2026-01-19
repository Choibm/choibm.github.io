document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    let width, height;
    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };

    const config = {
        strokeColor: '#161b22', // Softer black
        strokeWidth: 5,
        bgColor: '#0d1117'
    };

    function resize() {
        // Resize to parent container instead of window
        const container = canvas.parentElement;
        width = canvas.width = container.clientWidth;
        height = canvas.height = container.clientHeight;
    }

    window.addEventListener('resize', resize);
    // Call resize initially
    resize();

    // Track mouse relative to canvas/viewport
    // Note: If the canvas is not full screen, clientX/Y might need offset adjustment,
    // but for this visual effect (eyes following), clientX/Y usually works well enough 
    // if we assume the "look" target is the screen position of the mouse.
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        targetMouse.x = e.clientX - rect.left;
        targetMouse.y = e.clientY - rect.top;
    });

    // Initialize mouse at center
    targetMouse.x = width / 2;
    targetMouse.y = height / 2;
    mouse.x = width / 2;
    mouse.y = height / 2;

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // --- Drawing Helpers ---

    function drawCartoonEye(ctx, x, y, size, lookX, lookY, style = 'circle') {
        ctx.save();
        ctx.translate(x, y);

        // Sclera
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = config.strokeColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (style === 'rect') {
            ctx.roundRect(-size, -size, size * 2, size * 2, 5);
        } else {
            ctx.arc(0, 0, size, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.stroke();

        // Pupil
        const maxOffset = size * 0.4;
        const angle = Math.atan2(lookY, lookX);
        const dist = Math.min(maxOffset, Math.hypot(lookX, lookY) / 15);

        const pX = Math.cos(angle) * dist;
        const pY = Math.sin(angle) * dist;

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(pX, pY, size * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Shine
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(pX + size * 0.15, pY - size * 0.15, size * 0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // --- Classes ---

    class Character {
        constructor(xRatio, yRatio, scale) {
            this.xRatio = xRatio;
            this.yRatio = yRatio;
            this.baseScale = scale;
            this.time = Math.random() * 100;
            this.floatSpeed = 0.03;
            this.floatAmp = 15;
        }

        update() {
            this.time += this.floatSpeed;

            const centerX = width * this.xRatio;
            const centerY = height * this.yRatio;

            // Parallax
            const parallaxX = (width / 2 - mouse.x) * 0.08;
            const parallaxY = (height / 2 - mouse.y) * 0.08;

            // Bobbing
            const floatY = Math.sin(this.time) * this.floatAmp;

            this.x = centerX + parallaxX;
            this.y = centerY + parallaxY + floatY;

            // Responsive Scale
            this.s = this.baseScale * (Math.min(width, height) / 1000);

            // Breathing scale effect
            this.breathe = 1 + Math.sin(this.time * 2) * 0.02;
        }
    }

    class Whiskey extends Character {
        draw() {
            const s = this.s * this.breathe;
            ctx.save();
            ctx.translate(this.x, this.y);
            // Tilt based on movement
            const tilt = (mouse.x - width / 2) * 0.0005 + Math.sin(this.time) * 0.05;
            ctx.rotate(tilt);

            // -- Hard Shadow --
            ctx.save();
            ctx.translate(15 * s, 15 * s);
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            this.bottlePath(s);
            ctx.fill();
            ctx.restore();

            // -- Glass Body --
            // Use a gradient for glass
            const glassGrad = ctx.createLinearGradient(-40 * s, -100 * s, 40 * s, 100 * s);
            glassGrad.addColorStop(0, '#fdfbf7'); // light highlight
            glassGrad.addColorStop(0.3, '#E69138'); // amber
            glassGrad.addColorStop(1, '#B45F06'); // dark amber

            ctx.fillStyle = glassGrad;
            ctx.strokeStyle = config.strokeColor;
            ctx.lineWidth = config.strokeWidth;

            // Draw Body
            this.bottlePath(s);
            ctx.fill();
            ctx.stroke();

            // -- Liquid Slosh --
            ctx.save();
            this.bottlePath(s);
            ctx.clip();

            ctx.fillStyle = '#D35400'; // Darker liquid
            ctx.beginPath();
            const slosh = Math.sin(this.time * 3) * 10 * s;
            ctx.moveTo(-100 * s, 20 * s + slosh);
            ctx.bezierCurveTo(-30 * s, 20 * s - slosh, 30 * s, 20 * s + slosh, 100 * s, 20 * s - slosh);
            ctx.lineTo(100 * s, 200 * s);
            ctx.lineTo(-100 * s, 200 * s);
            ctx.fill();

            // Bubbles
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            const bubbleY = (this.time * 20) % 100;
            ctx.beginPath();
            ctx.arc(-20 * s, 50 * s - bubbleY * s * 0.5, 4 * s, 0, Math.PI * 2);
            ctx.arc(30 * s, 80 * s - bubbleY * s * 0.8, 6 * s, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // -- Label --
            ctx.fillStyle = '#FCE5CD';
            ctx.fillRect(-45 * s, -10 * s, 90 * s, 80 * s);
            ctx.strokeRect(-45 * s, -10 * s, 90 * s, 80 * s);

            // Label detail
            ctx.fillStyle = '#000';
            ctx.font = `900 ${14 * s}px "Segoe UI", sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText("SINGLE", 0, 50 * s);
            ctx.fillText("THREAD", 0, 64 * s);

            // -- Face (on label) --
            const lookX = mouse.x - this.x;
            const lookY = mouse.y - this.y;
            drawCartoonEye(ctx, -18 * s, 15 * s, 12 * s, lookX, lookY);
            drawCartoonEye(ctx, 18 * s, 15 * s, 12 * s, lookX, lookY);

            // Mouth
            ctx.lineWidth = 3 * s;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(0, 30 * s, 5 * s, 0.2, Math.PI - 0.2);
            ctx.stroke();

            // -- Cork --
            ctx.fillStyle = '#8d5524';
            ctx.fillRect(-22 * s, -135 * s, 44 * s, 30 * s);
            ctx.strokeRect(-22 * s, -135 * s, 44 * s, 30 * s);
            // Cork lines
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-15 * s, -125 * s); ctx.lineTo(-5 * s, -125 * s);
            ctx.moveTo(5 * s, -115 * s); ctx.lineTo(15 * s, -115 * s);
            ctx.stroke();

            ctx.restore();
        }

        bottlePath(s) {
            ctx.beginPath();
            // Neck top
            ctx.moveTo(-20 * s, -105 * s);
            ctx.lineTo(20 * s, -105 * s);
            // Neck
            ctx.lineTo(20 * s, -60 * s);
            // Shoulder
            ctx.quadraticCurveTo(55 * s, -55 * s, 55 * s, -10 * s);
            // Body side
            ctx.lineTo(50 * s, 90 * s);
            // Bottom
            ctx.quadraticCurveTo(0, 110 * s, -50 * s, 90 * s);
            // Left Body
            ctx.lineTo(-55 * s, -10 * s);
            // Left Shoulder
            ctx.quadraticCurveTo(-55 * s, -55 * s, -20 * s, -60 * s);
            ctx.closePath();
        }
    }

    class Microchip extends Character {
        draw() {
            const s = this.s * this.breathe;
            ctx.save();
            ctx.translate(this.x, this.y);

            // Floating tilt - wiggle more playfully
            const tilt = (mouse.x - width / 2) * 0.0003;
            ctx.rotate(tilt + Math.sin(this.time * 2) * 0.05);

            // -- Legs (Cute little wiggling pins) --
            const pinCount = 3; // Fewer, chunkier pins are cuter
            const pinSpacing = 30 * s;
            const startY = -((pinCount - 1) * pinSpacing) / 2;

            for (let side = -1; side <= 1; side += 2) {
                for (let i = 0; i < pinCount; i++) {
                    ctx.save();
                    const py = startY + i * pinSpacing;
                    // Wiggle legs faster and more playfully
                    const legWiggle = Math.sin(this.time * 5 + i + side) * 5 * s;

                    ctx.translate(side * 45 * s, py);

                    // Cute stubby leg
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    // Curve down and out (little feet)
                    ctx.quadraticCurveTo(side * 10 * s, legWiggle, side * 15 * s, 5 * s + legWiggle);
                    ctx.lineWidth = 6 * s;
                    ctx.strokeStyle = '#bdc3c7'; // Silver
                    ctx.lineCap = 'round';
                    ctx.stroke();

                    // Little round foot
                    ctx.beginPath();
                    ctx.arc(side * 15 * s, 5 * s + legWiggle, 4 * s, 0, Math.PI * 2);
                    ctx.fillStyle = '#bdc3c7';
                    ctx.fill();
                    ctx.restore();
                }
            }

            // -- Chip Body (Stout and Round) --
            // Softer dark grey instead of pure black
            ctx.fillStyle = '#2d3436';
            ctx.strokeStyle = config.strokeColor;
            ctx.lineWidth = config.strokeWidth;

            ctx.beginPath();
            // Squarer, chubbier body with very round corners
            ctx.roundRect(-50 * s, -60 * s, 100 * s, 120 * s, 25 * s);
            ctx.fill();
            ctx.stroke();

            // Matte highlight
            ctx.beginPath();
            ctx.roundRect(-40 * s, -50 * s, 80 * s, 40 * s, 15 * s);
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            ctx.fill();

            // -- Face --
            const lookX = mouse.x - this.x;
            const lookY = mouse.y - this.y;

            // Big Cute Eyes using helper
            // We use white sclera for maximum cuteness
            drawCartoonEye(ctx, -20 * s, -10 * s, 14 * s, lookX, lookY);
            drawCartoonEye(ctx, 20 * s, -10 * s, 14 * s, lookX, lookY);

            // Cute Smile
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3 * s;
            ctx.lineCap = 'round';

            ctx.beginPath();
            ctx.arc(0, 15 * s, 5 * s, 0.2, Math.PI - 0.2);
            ctx.stroke();

            // Blush Marks
            ctx.fillStyle = 'rgba(255, 105, 180, 0.5)'; // Hot pink blush
            ctx.beginPath();
            ctx.arc(-32 * s, 2 * s, 6 * s, 0, Math.PI * 2);
            ctx.arc(32 * s, 2 * s, 6 * s, 0, Math.PI * 2);
            ctx.fill();

            // -- Text Label (Decorative) --
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.font = `700 ${8 * s}px monospace`;
            ctx.textAlign = 'center';
            ctx.fillText("CHIP", 0, 45 * s);

            ctx.restore();
        }
    }

    // --- Background Detail Particles ---

    class TechParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 8 + 4;
            this.type = Math.floor(Math.random() * 3); // 0: +, 1: box, 2: dot
            this.opacity = Math.random() * 0.1 + 0.05; // Subtle visibility
            this.velX = (Math.random() - 0.5) * 0.3; // Slow float
            this.velY = (Math.random() - 0.5) * 0.3;
            this.phase = Math.random() * Math.PI * 2;
        }

        update() {
            this.x += this.velX;
            this.y += this.velY;
            this.phase += 0.02;

            // Subtle twinkling opacity
            this.currentOpacity = this.opacity + Math.sin(this.phase) * 0.02;

            // Screen Wrap
            if (this.x < -50) this.x = width + 50;
            if (this.x > width + 50) this.x = -50;
            if (this.y < -50) this.y = height + 50;
            if (this.y > height + 50) this.y = -50;
        }

        draw() {
            ctx.save();
            // Slight parallax for background depth
            const pX = (width / 2 - mouse.x) * 0.02;
            const pY = (height / 2 - mouse.y) * 0.02;

            ctx.translate(this.x + pX, this.y + pY);

            ctx.strokeStyle = `rgba(88, 166, 255, ${this.currentOpacity})`; // GitHub Blue-ish tint
            ctx.fillStyle = `rgba(88, 166, 255, ${this.currentOpacity})`;
            ctx.lineWidth = 2;

            const s = this.size;

            if (this.type === 0) { // Plus Sign
                ctx.beginPath();
                ctx.moveTo(-s, 0); ctx.lineTo(s, 0);
                ctx.moveTo(0, -s); ctx.lineTo(0, s);
                ctx.stroke();
            } else if (this.type === 1) { // Hollow Square
                ctx.strokeRect(-s / 2, -s / 2, s, s);
            } else { // Dot
                ctx.beginPath();
                ctx.arc(0, 0, s / 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    class Computer extends Character {
        constructor(x, y, s) {
            super(x, y, s);
            this.legAngle = 0;
        }

        draw() {
            const s = this.s * this.breathe;
            this.legAngle += 0.1;

            ctx.save();
            ctx.translate(this.x, this.y);

            // -- Legs (Cables with Mouse/Keyboard feet) --
            const legSwing = Math.sin(this.legAngle) * 5 * s;
            // Left Foot: Keyboard
            this.drawLeg(ctx, -25 * s, 85 * s, legSwing, s, 'keyboard');
            // Right Foot: Mouse
            this.drawLeg(ctx, 25 * s, 85 * s, -legSwing, s, 'mouse');

            // -- Stand (The Neck) --
            // This lifts it off the "floor" so it doesn't look like a microwave
            ctx.fillStyle = '#7f8c8d'; // Darker grey neck
            ctx.fillRect(-15 * s, 40 * s, 30 * s, 25 * s);
            ctx.strokeRect(-15 * s, 40 * s, 30 * s, 25 * s);

            // Base Plate
            ctx.beginPath();
            ctx.ellipse(0, 65 * s, 35 * s, 10 * s, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#bdc3c7'; // Base color
            ctx.fill();
            ctx.stroke();

            // -- CRT Monitor Body --
            // 1. Back/Top depth (Perspective trick to show it's deep)
            ctx.beginPath();
            ctx.moveTo(-55 * s, -65 * s); // Top Left Front
            ctx.lineTo(-35 * s, -85 * s); // Top Left Back
            ctx.lineTo(35 * s, -85 * s);  // Top Right Back
            ctx.lineTo(55 * s, -65 * s);  // Top Right Front
            ctx.fillStyle = '#bdc3c7'; // Darker beige for shading top
            ctx.fill();
            ctx.stroke();

            // 2. Main Face Box
            ctx.fillStyle = '#ecf0f1'; // Classic PC Beige
            ctx.strokeStyle = config.strokeColor;
            ctx.lineWidth = config.strokeWidth;

            ctx.beginPath();
            // Trapezoidal CRT shape (wider at top, slightly tapered bottom)
            ctx.moveTo(-65 * s, -65 * s);
            ctx.lineTo(65 * s, -65 * s);
            ctx.lineTo(60 * s, 55 * s);
            ctx.lineTo(-60 * s, 55 * s);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // -- Monitor Details --

            // Floppy Slot (The signature retro PC look)
            ctx.fillStyle = '#bdc3c7'; // Indent area
            ctx.fillRect(5 * s, 40 * s, 45 * s, 8 * s);
            ctx.fillStyle = '#000'; // The slot itself
            ctx.fillRect(8 * s, 43 * s, 39 * s, 2 * s);

            // Power Button (Green LED style)
            ctx.beginPath();
            ctx.arc(-45 * s, 44 * s, 4 * s, 0, Math.PI * 2);
            ctx.fillStyle = '#2ecc71';
            ctx.fill();
            ctx.stroke();

            // -- The Screen --
            ctx.fillStyle = '#2c3e50'; // Dark Blue-Grey OFF screen background
            ctx.beginPath();
            // Screen is inside the bezel
            ctx.roundRect(-55 * s, -55 * s, 110 * s, 85 * s, 8 * s);
            ctx.fill();

            // Inner Shadow
            ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Scanlines
            ctx.fillStyle = 'rgba(255,255,255,0.03)';
            for (let i = 0; i < 85; i += 3) {
                ctx.fillRect(-55 * s, -55 * s + i * s, 110 * s, 1 * s);
            }

            // -- Face (Terminal Style) --
            const lookX = mouse.x - this.x;
            const lookY = mouse.y - this.y;

            // Glow
            ctx.shadowColor = '#3498db'; // Blue glow
            ctx.shadowBlur = 15;

            // Set style for symbols
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 5 * s;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Reactive Eye Movement
            const eyeX = Math.max(-10 * s, Math.min(10 * s, lookX / 20));
            const eyeY = Math.max(-8 * s, Math.min(8 * s, lookY / 20));

            // Left Eye ( > )
            ctx.save();
            ctx.translate(-30 * s + eyeX, -25 * s + eyeY);
            ctx.beginPath();
            ctx.moveTo(-8 * s, -10 * s);
            ctx.lineTo(8 * s, 0);
            ctx.lineTo(-8 * s, 10 * s);
            ctx.stroke();
            ctx.restore();

            // Right Eye ( < )
            ctx.save();
            ctx.translate(30 * s + eyeX, -25 * s + eyeY);
            ctx.beginPath();
            ctx.moveTo(8 * s, -10 * s);
            ctx.lineTo(-8 * s, 0);
            ctx.lineTo(8 * s, 10 * s);
            ctx.stroke();
            ctx.restore();

            // Mouth (Underscore)
            ctx.fillStyle = '#3498db';
            ctx.font = `bold ${25 * s}px monospace`;
            ctx.textAlign = 'center';
            // Just the underscore
            ctx.fillText("_", 0, 15 * s);

            ctx.restore();
        }

        drawLeg(ctx, x, y, angle, s, type) {
            ctx.save();
            ctx.translate(x, y);

            // Cable Leg (Curvy wire)
            ctx.beginPath();
            ctx.moveTo(0, -45 * s); // Connects up to base
            // Bezier curve for flexible wire look
            ctx.bezierCurveTo(0, -20 * s, angle, -20 * s, angle * 1.2, 0);
            ctx.lineWidth = 4 * s;
            ctx.strokeStyle = '#95a5a6';
            ctx.stroke();

            // The Foot (Peripheral)
            ctx.translate(angle * 1.2, 0);
            ctx.rotate(angle * 0.05); // Subtle foot rotation

            ctx.fillStyle = '#ecf0f1';
            ctx.strokeStyle = config.strokeColor;
            ctx.lineWidth = 2;

            if (type === 'keyboard') {
                // Keyboard Shape
                ctx.beginPath();
                // Trapezoid side profile of a keyboard
                ctx.moveTo(-18 * s, 5 * s);
                ctx.lineTo(18 * s, 5 * s);
                ctx.lineTo(18 * s, -8 * s);
                ctx.lineTo(-18 * s, -12 * s); // Higher back
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Keys
                ctx.fillStyle = '#bdc3c7';
                ctx.fillRect(-14 * s, -6 * s, 4 * s, 4 * s);
                ctx.fillRect(-8 * s, -6 * s, 4 * s, 4 * s);
                ctx.fillRect(-2 * s, -6 * s, 4 * s, 4 * s);
                ctx.fillRect(4 * s, -6 * s, 4 * s, 4 * s);
                ctx.fillRect(10 * s, -6 * s, 4 * s, 4 * s);

            } else {
                // Mouse Shape
                ctx.beginPath();
                // Classic curved mouse shape
                ctx.ellipse(0, -2 * s, 14 * s, 10 * s, 0, Math.PI, 0); // Bottom arc
                ctx.lineTo(14 * s, -2 * s);
                ctx.bezierCurveTo(14 * s, -15 * s, -14 * s, -15 * s, -14 * s, -2 * s); // Top dome
                ctx.fill();
                ctx.stroke();

                // Button Line
                ctx.beginPath();
                ctx.moveTo(0, -15 * s); // Top center
                ctx.lineTo(0, -2 * s);  // Middle
                ctx.stroke();
                // Cross line
                ctx.beginPath();
                ctx.moveTo(-12 * s, -5 * s);
                ctx.lineTo(12 * s, -5 * s);
                ctx.stroke();
            }

            ctx.restore();
        }
    }

    // --- Init ---

    const characters = [
        new Computer(0.2, 0.5, 2.0),
        new Whiskey(0.5, 0.55, 1.8),
        new Microchip(0.8, 0.45, 1.5)
    ];

    // Create background particles
    const particles = Array.from({ length: 50 }, () => new TechParticle());

    function animate() {
        // Mouse smoothing
        mouse.x = lerp(mouse.x, targetMouse.x, 0.1);
        mouse.y = lerp(mouse.y, targetMouse.y, 0.1);

        ctx.fillStyle = config.bgColor;
        ctx.fillRect(0, 0, width, height);

        // Subtle Grid
        ctx.strokeStyle = '#21262d';
        ctx.lineWidth = 2;
        const gridSize = 60;
        const ox = (mouse.x * 0.02) % gridSize;
        const oy = (mouse.y * 0.02) % gridSize;

        ctx.beginPath();
        for (let x = -gridSize; x < width + gridSize; x += gridSize) {
            ctx.moveTo(x - ox, 0);
            ctx.lineTo(x - ox, height);
        }
        for (let y = -gridSize; y < height + gridSize; y += gridSize) {
            ctx.moveTo(0, y - oy);
            ctx.lineTo(width, y - oy);
        }
        ctx.stroke();

        // Draw Background Particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // --- Draw Network Connections ---
        // We calculate the actual visual position of particles (including parallax)
        const pParallaxX = (width / 2 - mouse.x) * 0.02;
        const pParallaxY = (height / 2 - mouse.y) * 0.02;

        particles.forEach(p => {
            const px = p.x + pParallaxX;
            const py = p.y + pParallaxY;

            // 1. Connect to Characters
            characters.forEach(c => {
                const dx = c.x - px;
                const dy = c.y - py;
                const dist = Math.hypot(dx, dy);
                const threshold = 300; // Connection range

                if (dist < threshold) {
                    ctx.beginPath();
                    // Opacity fades as distance increases
                    // Increased alpha from 0.15 to 0.4 for better visibility
                    const alpha = 0.4 * (1 - dist / threshold);
                    ctx.strokeStyle = `rgba(88, 166, 255, ${alpha})`;
                    ctx.lineWidth = 1.5; // Thicker lines
                    ctx.moveTo(px, py);
                    ctx.lineTo(c.x, c.y);
                    ctx.stroke();
                }
            });

            // 2. Connect to Mouse
            const mdx = mouse.x - px;
            const mdy = mouse.y - py;
            const mDist = Math.hypot(mdx, mdy);
            const mThreshold = 250;

            if (mDist < mThreshold) {
                ctx.beginPath();
                // Stronger mouse connection (Alpha 0.3 -> 0.7)
                ctx.strokeStyle = `rgba(88, 166, 255, ${0.7 * (1 - mDist / mThreshold)})`;
                ctx.lineWidth = 2; // Thicker line for user interaction
                ctx.moveTo(px, py);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        });

        // Sort by y position for depth sorting
        characters.sort((a, b) => a.y - b.y);

        characters.forEach(c => {
            c.update();
            c.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
});
