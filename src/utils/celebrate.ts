import confetti from 'canvas-confetti';

export function fireLessonConfetti(): void {
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.65 },
    colors: ['#c97b3a', '#2d9a6a', '#f0c040', '#e85d4c', '#6b9bd1'],
  });
}

export function fireAchievementConfetti(): void {
  const duration = 2200;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ['#c97b3a', '#2d9a6a', '#f0c040'],
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ['#c97b3a', '#2d9a6a', '#f0c040'],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();

  confetti({
    particleCount: 120,
    spread: 100,
    origin: { y: 0.5 },
    startVelocity: 35,
  });
}
