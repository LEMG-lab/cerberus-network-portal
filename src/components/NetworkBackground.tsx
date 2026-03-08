import { useEffect, useRef } from 'react';

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const nodes: { x: number, y: number, vx: number, vy: number, isRed: boolean }[] = [];
    const numNodes = 65;

    for (let i = 0; i < numNodes; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            isRed: Math.random() > 0.85
        });
    }

    let animationFrameId: number;

    const render = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.globalAlpha = 0.15;

        for (let i = 0; i < numNodes; i++) {
            const node = nodes[i];
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;

            ctx.beginPath();
            ctx.arc(node.x, node.y, node.isRed ? 4 : 2.5, 0, Math.PI * 2);
            ctx.fillStyle = node.isRed ? '#E11D48' : '#6B6B6E';
            ctx.fill();

            for (let j = i + 1; j < numNodes; j++) {
                const node2 = nodes[j];
                const dx = node.x - node2.x;
                const dy = node.y - node2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 160) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(node2.x, node2.y);
                    ctx.strokeStyle = '#6B6B6E';
                    ctx.lineWidth = 1 - (dist / 160);
                    ctx.stroke();
                }
            }
        }
        animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-[-1]"
    />
  );
}
