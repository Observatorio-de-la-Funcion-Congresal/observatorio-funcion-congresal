/**
 * parliament-layout.js
 *
 * Pure JS port of the parliament-svg algorithm (https://github.com/juliuste/parliament-svg)
 * without lodash, hastscript or sainte-lague dependencies.
 *
 * Public API:
 *   generatePoints(seats)  → Array<{ cx, cy, r, fill, party }>
 *   getViewBox(r0, a)       → string viewBox for the SVG element
 */

const PI = Math.PI

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Round to 10 decimal places (replaces lodash/round) */
const round = (x) => Math.round(x * 1e10) / 1e10

/** Sum all seat counts */
const seatSum = (seats) => seats.reduce((acc, s) => acc + s.count, 0)

/**
 * Distribute `total` integer seats across rings proportionally to their radii
 * using the Largest Remainder Method (replaces sainte-lague).
 *
 * @param {Record<number, number>} rings  – { ringIndex: radius }
 * @param {number} total
 * @returns {Record<number, number>}      – { ringIndex: seatCount }
 */
const distributeSeats = (rings, total) => {
  const keys = Object.keys(rings).map(Number)
  const totalRadius = keys.reduce((s, k) => s + rings[k], 0)

  const exact = keys.map((k) => ({ k, val: (total * rings[k]) / totalRadius }))
  const floored = exact.map(({ k, val }) => ({ k, seats: Math.floor(val), remainder: val - Math.floor(val) }))

  let remaining = total - floored.reduce((s, e) => s + e.seats, 0)

  floored.sort((a, b) => b.remainder - a.remainder)
  for (let i = 0; i < remaining; i++) floored[i].seats++

  return Object.fromEntries(floored.map(({ k, seats }) => [k, seats]))
}

// ---------------------------------------------------------------------------
// Core geometry
// ---------------------------------------------------------------------------

/** Polar arc-length → cartesian (hemicycle, opens upward) */
const coords = (r, b) => ({
  x: round(r * Math.cos(b / r - PI)),
  y: round(r * Math.sin(b / r - PI)),
})

const calculateSeatDistance = (seatCount, numberOfRings, r) => {
  const x = (PI * numberOfRings * r) / (seatCount - numberOfRings)
  const y = 1 + (PI * (numberOfRings - 1) * numberOfRings) / 2 / (seatCount - numberOfRings)
  return x / y
}

const score = (m, n, r) => Math.abs((calculateSeatDistance(m, n, r) * n) / r - 5 / 7)

const calculateNumberOfRings = (seatCount, r) => {
  let n = Math.floor(Math.log(seatCount) / Math.log(2)) || 1
  let distance = score(seatCount, n, r)

  let direction = 0
  if (score(seatCount, n + 1, r) < distance) direction = 1
  if (score(seatCount, n - 1, r) < distance && n > 1) direction = -1

  while (n > 0 && score(seatCount, n + direction, r) < distance) {
    distance = score(seatCount, n + direction, r)
    n += direction
  }
  return n
}

/**
 * Determine which ring should receive the next seat so that all rings fill
 * at the same proportional rate.
 *
 * @param {Array<Array>} rings       – rings[i] = array of seat slots in ring i
 * @param {number[]}     progress    – how many slots have been assigned per ring
 * @returns {number} ring index
 */
const nextRing = (rings, progress) => {
  let minQuota = Infinity
  let chosen = 0
  for (let i = 0; i < rings.length; i++) {
    if (rings[i].length === 0) continue
    const quota = round((progress[i] || 0) / rings[i].length)
    if (quota < minQuota) {
      minQuota = quota
      chosen = i
    }
  }
  return chosen
}

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

/**
 * @typedef {{ party: string, count: number, color: string }} SeatGroup
 * @typedef {{ cx: number, cy: number, r: number, fill: string, party: string }} Point
 */

/**
 * Generate the list of circle positions and colours for a parliament chart.
 *
 * @param {SeatGroup[]} seats  – e.g. [{ party: 'ABC', count: 20, color: '#f00' }]
 * @param {number}      [r0=20] – outer ring radius (in SVG user units)
 * @returns {{ points: Point[], r0: number, a: number }}
 */
export const generatePoints = (seats, r0 = 20) => {
  const seatCount = seatSum(seats)
  if (seatCount === 0) return { points: [], r0, a: 1 }

  const numberOfRings = calculateNumberOfRings(seatCount, r0)
  const seatDistance = calculateSeatDistance(seatCount, numberOfRings, r0)

  // Build ring radii: ring 1 = outermost (r0), ring N = innermost
  const ringRadii = {}
  for (let i = 1; i <= numberOfRings; i++) {
    ringRadii[i] = r0 - (i - 1) * seatDistance
  }

  // Distribute total seats across rings proportionally to radius
  const seatsPerRing = distributeSeats(ringRadii, seatCount)

  // Build seat slots for every ring
  const rings = []
  for (let i = 1; i <= numberOfRings; i++) {
    const ring = []
    const r = ringRadii[i]
    const count = seatsPerRing[i]
    // angular distance between adjacent seats on this ring
    const a = (PI * r) / ((count - 1) || 1)

    for (let j = 0; j < count; j++) {
      const pos = coords(r, j * a)
      ring.push({ cx: pos.x, cy: pos.y, r: round(0.3 * seatDistance), fill: '', party: '' })
    }
    rings.push(ring)
  }

  // Assign parties to slots (fills rings proportionally)
  const progress = new Array(rings.length).fill(0)
  for (const group of seats) {
    for (let i = 0; i < group.count; i++) {
      const ri = nextRing(rings, progress)
      rings[ri][progress[ri]].fill = group.color
      rings[ri][progress[ri]].party = group.party
      progress[ri]++
    }
  }

  const points = rings.flat()
  const a = seatDistance // seat radius factor used for viewBox padding

  return { points, r0, a }
}

/**
 * Return the SVG viewBox string matching the generated layout.
 *
 * @param {number} r0
 * @param {number} a  – seatDistance (= a returned by generatePoints)
 * @returns {string}
 */
export const getViewBox = (r0, a) => {
  const pad = a / 2
  return `${-r0 - pad} ${-r0 - pad} ${2 * r0 + a} ${r0 + a}`
}
