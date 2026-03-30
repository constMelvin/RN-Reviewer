const CircuitBoardBackground = () => {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        background: '#f8fafc',
        backgroundImage: `
                linear-gradient(90deg, #e2e8f0 1px, transparent 1px),
                linear-gradient(180deg, #e2e8f0 1px, transparent 1px),
                linear-gradient(90deg, #cbd5e1 1px, transparent 1px),
                linear-gradient(180deg, #cbd5e1 1px, transparent 1px)
                  `,
        backgroundSize: '50px 50px, 50px 50px, 10px 10px, 10px 10px',
      }}
    />
  )
}

export default CircuitBoardBackground
