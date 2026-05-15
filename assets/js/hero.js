document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    let width = 0;
    let height = 0;
    let dpr = 1;
    let tick = 0;

    const pointer = {
        x: 0,
        y: 0,
        active: false
    };

    const anchorBlueprints = [
        { label: 'QI', x: 0.22, y: 0.34, color: '#5cd7ff', halo: 'rgba(92, 215, 255, 0.30)' },
        { label: 'Si', x: 0.5, y: 0.66, color: '#74ffd1', halo: 'rgba(116, 255, 209, 0.26)' },
        { label: 'MAT', x: 0.78, y: 0.4, color: '#ffc173', halo: 'rgba(255, 193, 115, 0.24)' }
    ];

    let particles = [];

    function createParticle() {
        const speed = 0.45 + Math.random() * 0.65;
        const angle = Math.random() * Math.PI * 2;

        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: 0.8 + Math.random() * 2.1,
            phase: Math.random() * Math.PI * 2,
            drift: 0.3 + Math.random() * 0.8
        };
    }

    function rebuildScene() {
        const targetCount = clamp(Math.floor((width * height) / 26000), 50, 110);
        particles = Array.from({ length: targetCount }, createParticle);
    }

    function resize() {
        const rect = canvas.getBoundingClientRect();
        width = Math.max(320, Math.floor(rect.width));
        height = Math.max(320, Math.floor(rect.height));

        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        pointer.x = width * 0.5;
        pointer.y = height * 0.5;

        rebuildScene();
    }

    function drawBackdrop() {
        const backdrop = ctx.createLinearGradient(0, 0, 0, height);
        backdrop.addColorStop(0, '#050a14');
        backdrop.addColorStop(0.6, '#04081099');
        backdrop.addColorStop(1, '#03060d');

        ctx.fillStyle = backdrop;
        ctx.fillRect(0, 0, width, height);

        const spacing = clamp(Math.round(width / 22), 36, 64);
        const xOffset = (tick * 0.15) % spacing;
        const yOffset = (tick * 0.09) % spacing;

        ctx.strokeStyle = 'rgba(92, 215, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();

        for (let x = -spacing; x < width + spacing; x += spacing) {
            ctx.moveTo(x - xOffset, 0);
            ctx.lineTo(x - xOffset, height);
        }

        for (let y = -spacing; y < height + spacing; y += spacing) {
            ctx.moveTo(0, y - yOffset);
            ctx.lineTo(width, y - yOffset);
        }

        ctx.stroke();
    }

    function anchorPositions() {
        return anchorBlueprints.map((anchor, index) => {
            const pulse = 1 + Math.sin(tick * 0.018 + index * 2.1) * 0.08;
            const orbitShiftX = Math.sin(tick * 0.01 + index * 1.4) * 7;
            const orbitShiftY = Math.cos(tick * 0.012 + index * 1.6) * 7;

            return {
                ...anchor,
                x: width * anchor.x + orbitShiftX,
                y: height * anchor.y + orbitShiftY,
                pulse
            };
        });
    }

    function drawAnchors(anchors) {
        anchors.forEach((anchor, index) => {
            const baseRadius = clamp(Math.min(width, height) * 0.018 + index * 1.5, 9, 16);
            const haloRadius = baseRadius * (2.8 + index * 0.25) * anchor.pulse;

            ctx.beginPath();
            ctx.fillStyle = anchor.halo;
            ctx.arc(anchor.x, anchor.y, haloRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.24 + index * 0.04})`;
            ctx.lineWidth = 1.2;
            ctx.arc(anchor.x, anchor.y, haloRadius * 1.34, 0, Math.PI * 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.fillStyle = anchor.color;
            ctx.arc(anchor.x, anchor.y, baseRadius * anchor.pulse, 0, Math.PI * 2);
            ctx.fill();

            ctx.font = '700 11px Sora, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#f4f8ff';
            ctx.fillText(anchor.label, anchor.x, anchor.y + 0.3);
        });
    }

    function moveParticle(particle) {
        particle.phase += 0.012 * particle.drift;

        const flowX = Math.cos(particle.phase + tick * 0.002) * 0.014;
        const flowY = Math.sin(particle.phase * 1.3 - tick * 0.002) * 0.014;

        particle.vx += flowX;
        particle.vy += flowY;

        if (pointer.active) {
            const dx = pointer.x - particle.x;
            const dy = pointer.y - particle.y;
            const distance = Math.hypot(dx, dy);

            if (distance > 0 && distance < 210) {
                const pull = (1 - distance / 210) * 0.032;
                particle.vx += (dx / distance) * pull;
                particle.vy += (dy / distance) * pull;
            }
        }

        particle.vx *= 0.986;
        particle.vy *= 0.986;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -16) particle.x = width + 16;
        if (particle.x > width + 16) particle.x = -16;
        if (particle.y < -16) particle.y = height + 16;
        if (particle.y > height + 16) particle.y = -16;
    }

    function drawParticleNetwork(anchors) {
        const threshold = clamp(Math.min(width, height) * 0.18, 95, 150);

        for (let i = 0; i < particles.length; i += 1) {
            const p = particles[i];

            for (let j = i + 1; j < particles.length; j += 1) {
                const n = particles[j];
                const dx = p.x - n.x;
                const dy = p.y - n.y;
                const distance = Math.hypot(dx, dy);

                if (distance < threshold) {
                    const alpha = 0.16 * (1 - distance / threshold);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(92, 215, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(n.x, n.y);
                    ctx.stroke();
                }
            }

            anchors.forEach(anchor => {
                const dx = anchor.x - p.x;
                const dy = anchor.y - p.y;
                const distance = Math.hypot(dx, dy);
                const anchorThreshold = threshold * 1.15;

                if (distance < anchorThreshold) {
                    const alpha = 0.22 * (1 - distance / anchorThreshold);
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(220, 234, 255, ${alpha})`;
                    ctx.lineWidth = 0.9;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(anchor.x, anchor.y);
                    ctx.stroke();
                }
            });
        }
    }

    function drawParticles() {
        particles.forEach(particle => {
            const glow = 0.2 + Math.sin(particle.phase + tick * 0.01) * 0.14;
            ctx.beginPath();
            ctx.fillStyle = `rgba(180, 232, 255, ${0.32 + glow})`;
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function animate() {
        tick += 1;

        drawBackdrop();

        const anchors = anchorPositions();

        particles.forEach(moveParticle);
        drawParticleNetwork(anchors);
        drawParticles();
        drawAnchors(anchors);

        requestAnimationFrame(animate);
    }

    function updatePointer(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        pointer.x = clientX - rect.left;
        pointer.y = clientY - rect.top;
        pointer.active = true;
    }

    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', event => {
        updatePointer(event.clientX, event.clientY);
    });

    window.addEventListener('mouseout', event => {
        if (!event.relatedTarget) {
            pointer.active = false;
        }
    });

    window.addEventListener('touchstart', event => {
        if (!event.touches.length) return;
        const touch = event.touches[0];
        updatePointer(touch.clientX, touch.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', event => {
        if (!event.touches.length) return;
        const touch = event.touches[0];
        updatePointer(touch.clientX, touch.clientY);
    }, { passive: true });

    window.addEventListener('touchend', () => {
        pointer.active = false;
    }, { passive: true });

    resize();
    animate();
});
