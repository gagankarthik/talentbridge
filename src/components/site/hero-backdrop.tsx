// Animated hero backdrop: a "talent network" constellation with signals
// travelling along its links. Pure SVG + CSS, paused for reduced motion.

const NODES: [number, number][] = [
  [80, 120], [220, 60], [360, 170], [520, 90], [690, 150], [840, 70], [1010, 160], [1180, 90], [1340, 140],
  [140, 330], [300, 280], [470, 360], [640, 300], [800, 390], [960, 310], [1130, 380], [1290, 300],
  [60, 520], [240, 560], [410, 500], [590, 580], [760, 520], [930, 600], [1100, 530], [1270, 590], [1400, 480],
];

const LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [2, 10], [3, 11], [4, 12], [6, 13], [6, 14], [7, 15], [8, 16],
  [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16],
  [9, 17], [10, 18], [11, 19], [12, 20], [13, 21], [14, 22], [15, 23], [16, 24], [16, 25],
  [17, 18], [18, 19], [19, 20], [20, 21], [21, 22], [22, 23], [23, 24], [24, 25],
];

// Links that carry a travelling signal, with staggered timing
const SIGNALS = [1, 4, 9, 13, 18, 21, 26, 30, 35, 38];

export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Talent network */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 680" preserveAspectRatio="xMidYMid slice" fill="none">
        <g stroke="rgb(46 230 168 / 0.12)" strokeWidth="1">
          {LINKS.map(([a, b], i) => (
            <line key={i} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} />
          ))}
        </g>
        <g>
          {SIGNALS.map((li, k) => {
            const [a, b] = LINKS[li];
            return (
              <line
                key={li}
                x1={NODES[a][0]}
                y1={NODES[a][1]}
                x2={NODES[b][0]}
                y2={NODES[b][1]}
                stroke={k % 3 === 1 ? "#ffc247" : "#2ee6a8"}
                strokeWidth="1.6"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray="14 86"
                className="hero-signal"
                style={{ animationDelay: `${k * 0.7}s` }}
              />
            );
          })}
        </g>
        <g>
          {NODES.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="2.2" fill="rgb(203 213 225 / 0.45)" />
              {i % 5 === 0 && <circle cx={x} cy={y} r="6" fill="none" stroke="rgb(46 230 168 / 0.55)" className="hero-node" style={{ animationDelay: `${i * 0.3}s` }} />}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
