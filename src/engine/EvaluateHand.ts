import { Card } from './useCardGameStore'

// --- Types ---

export type TienLenHandName =
  | 'Four Pairs Sequence'
  | 'Three Pairs Sequence'
  | 'Four of a Kind'
  | 'Sequence'
  | 'Triple'
  | 'Pair'
  | 'High Card'

export type TienLenHandResult = {
  name: TienLenHandName
  rankSum: number
  mult: number
  score: number
  scoringCards: Card[]
  heartsScore: number
  diamondsScore: number
  clubsScore: number
  spadesScore: number
}

// --- Constants ---

const HAND_TABLE: Record<TienLenHandName, { mult: number }> = {
  'Four Pairs Sequence': { mult: 8 },
  'Three Pairs Sequence': { mult: 6 },
  'Four of a Kind': { mult: 7 },
  'Sequence': { mult: 4 },
  'Triple': { mult: 3 },
  'Pair': { mult: 2 },
  'High Card': { mult: 1 },
}

const RANK_ORDER: Record<string, number> = {
  '3': 1, '4': 2, '5': 3, '6': 4,
  '7': 5, '8': 6, '9': 7, '10': 8,
  'J': 9, 'Q': 10, 'K': 11, 'A': 12, '2': 13,
}

// --- Helpers ---

function getRankValue(rank: string): number {
  return RANK_ORDER[rank] ?? 0
}

function groupByRank(cards: Card[]): Map<string, Card[]> {
  const map = new Map<string, Card[]>()
  for (const card of cards) {
    const group = map.get(card.rank) ?? []
    group.push(card)
    map.set(card.rank, group)
  }
  return map
}

function isSequence(cards: Card[]): { valid: boolean; sorted: Card[] } {
  if (cards.length < 3) return { valid: false, sorted: cards }
  if (cards.some(c => c.rank === '2')) return { valid: false, sorted: cards }

  const sorted = [...cards].sort((a, b) => getRankValue(a.rank) - getRankValue(b.rank))
  const values = sorted.map(c => getRankValue(c.rank))
  const isConsecutive = values.every((v, i) => i === 0 || v === values[i - 1] + 1)

  return { valid: isConsecutive, sorted }
}

function getPairsSequence(cards: Card[]): { pairCount: number; sorted: Card[] } | null {
  const byRank = groupByRank(cards)
  const pairs = [...byRank.values()]
  if (pairs.some(g => g.length !== 2)) return null
  if (cards.some(c => c.rank === '2')) return null

  const sortedPairs = pairs.sort(
    (a, b) => getRankValue(a[0].rank) - getRankValue(b[0].rank)
  )
  const rankValues = sortedPairs.map(p => getRankValue(p[0].rank))
  const isConsecutive = rankValues.every((v, i) => i === 0 || v === rankValues[i - 1] + 1)

  if (!isConsecutive) return null

  return {
    pairCount: sortedPairs.length,
    sorted: sortedPairs.flat(),
  }
}

// --- Main Evaluator ---

export function evaluateTienLenHand(cards: Card[]): TienLenHandResult {
  if (cards.length === 0) {
    return makeResult('High Card', [])
  }

  const byRank = groupByRank(cards)
  const groups = [...byRank.values()].sort((a, b) => b.length - a.length)

  if (cards.length === 6 || cards.length === 8) {
    const pairsSeq = getPairsSequence(cards)
    if (pairsSeq) {
      if (pairsSeq.pairCount === 4) return makeResult('Four Pairs Sequence', pairsSeq.sorted)
      if (pairsSeq.pairCount === 3) return makeResult('Three Pairs Sequence', pairsSeq.sorted)
    }
  }

  if (cards.length === 4 && groups[0].length === 4) {
    return makeResult('Four of a Kind', groups[0])
  }

  if (cards.length >= 3) {
    const { valid, sorted } = isSequence(cards)
    if (valid) return makeResult('Sequence', sorted)
  }

  if (cards.length === 3 && groups[0].length === 3) {
    return makeResult('Triple', groups[0])
  }

  if (cards.length === 2 && groups[0].length === 2) {
    return makeResult('Pair', groups[0])
  }

  const highCard = [...cards].sort(
    (a, b) => getRankValue(b.rank) - getRankValue(a.rank)
  )[0]
  return makeResult('High Card', [highCard])
}

function makeResult(name: TienLenHandName, scoringCards: Card[]): TienLenHandResult {
  const { mult } = HAND_TABLE[name]
  const rankSum = scoringCards.reduce((sum, card) => sum + getRankValue(card.rank), 0)

  const heartsScore = scoringCards
    .filter(c => c.suit === 'hearts')
    .reduce((sum, card) => sum + getRankValue(card.rank), 0) * mult

  const diamondsScore = scoringCards
    .filter(c => c.suit === 'diamonds')
    .reduce((sum, card) => sum + getRankValue(card.rank), 0) * mult

  const clubsScore = scoringCards
    .filter(c => c.suit === 'clubs')
    .reduce((sum, card) => sum + getRankValue(card.rank), 0) * mult

  const spadesScore = scoringCards
    .filter(c => c.suit === 'spades')
    .reduce((sum, card) => sum + getRankValue(card.rank), 0) * mult


  return {
    name,
    rankSum,
    mult,
    score: rankSum * mult,
    heartsScore,
    diamondsScore,
    clubsScore,
    spadesScore,
    scoringCards,
  }
}