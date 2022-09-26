import confetti from 'canvas-confetti'

export function fireworks() {
  const duration = 15 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval: NodeJS.Timer = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0)
      return clearInterval(interval)

    const particleCount = 50 * (timeLeft / duration)
    // since particles fall down, start a bit higher than random
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }))
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }))
  }, 250)
}

export function schoolPride() {
  const end = Date.now() + (15 * 1000)

  // go Buckeyes!
  const colors = [
    '#ffa62d',
    '#ff5e7e',
    '#26ccff',
    '#a25afd',
    '#88ff5a',
    '#fcff42',
    '#ff36ff',
  ];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    })
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    })

    if (Date.now() < end)
      requestAnimationFrame(frame)
  }())
}

export function basicCannon() {
  confetti({
    particleCount: 100,
    spread: 100,
    origin: { y: 0.6 },
  })
}
