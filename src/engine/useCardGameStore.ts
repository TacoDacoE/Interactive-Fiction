import { useEffect, useRef } from 'react'
import { create } from 'zustand'
import { evaluateTienLenHand } from './EvaluateHand'
import { PLAY_HAND_LIMIT, SCORE_TO_BEAT } from '../constants'

// --- Types ---

export type Card = {
  id: string
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'
  rank: string
  value: number
}

export type GamePhase = 'playing' | 'resolving' | 'clearing'

export type GameResult = 'win' | 'loss' | null

type CardGameState = {
  deck: Card[]
  hand: Card[]
  selected: string[]
  played: Card[]
  phase: GamePhase
  score: number
  suitScores: number[]
  drawsRemaining: number
  playsRemaining: number
  gameOver: boolean
  gameResult: GameResult

  // Actions
  drawCard: () => void
  drawCards: (amount: number) => void
  toggleSelect: (id: string) => void
  playSelected: () => void
  discardSelected: () => void
  setPhase: (phase: GamePhase) => void
  clearPlayed: () => void
  resetGame: () => void
  sortBySuit: () => void
  sortByRank: () => void
}

// --- Helpers ---

function buildDeck(): Card[] {
  const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades']
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
  const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11]

  return suits.flatMap((suit) =>
    ranks.map((rank, i) => ({
      id: `${rank}-${suit}`,
      suit,
      rank,
      value: values[i],
    }))
  )
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function scoreCards(cards: Card[]): number {
  return cards.reduce((sum, card) => sum + card.value, 0)
}

const BIG2_RANK_ORDER: Record<string, number> = {
  '3': 0, '4': 1, '5': 2, '6': 3, '7': 4,
  '8': 5, '9': 6, '10': 7, 'J': 8, 'Q': 9,
  'K': 10, 'A': 11, '2': 12,
}

const BIG2_SUIT_ORDER: Record<Card['suit'], number> = {
  spades: 0, clubs: 1, diamonds: 2, hearts: 3,
}

function sortBySuitFn(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    const suitDiff = BIG2_SUIT_ORDER[a.suit] - BIG2_SUIT_ORDER[b.suit]
    if (suitDiff !== 0) return suitDiff
    return BIG2_RANK_ORDER[a.rank] - BIG2_RANK_ORDER[b.rank]
  })
}

function sortByRankFn(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    const rankDiff = BIG2_RANK_ORDER[a.rank] - BIG2_RANK_ORDER[b.rank]
    if (rankDiff !== 0) return rankDiff
    return BIG2_SUIT_ORDER[a.suit] - BIG2_SUIT_ORDER[b.suit]
  })
}

function resolveGameOver(
  playsRemaining: number,
  drawsRemaining: number,
  handSize: number,
  score: number
): { gameOver: boolean; gameResult: GameResult } {
  if (playsRemaining > 0) return { gameOver: false, gameResult: null }
  if (playsRemaining === 0) return {
    gameOver: true,
    gameResult: score >= SCORE_TO_BEAT ? 'win' : 'loss',
  }
  const cantContinue = handSize === 0 && drawsRemaining === 0
  if (!cantContinue) return { gameOver: false, gameResult: null }
  return {
    gameOver: true,
    gameResult: score >= SCORE_TO_BEAT ? 'win' : 'loss',
  }
}

// --- Store ---

export const useCardGame = create<CardGameState>((set) => ({
  deck: shuffle(buildDeck()),
  hand: [],
  selected: [],
  played: [],
  phase: 'playing',
  score: 0,
  suitScores: [0, 0, 0, 0],
  drawsRemaining: 13,
  playsRemaining: PLAY_HAND_LIMIT,
  gameOver: false,
  gameResult: null,

  drawCard: () =>
    set((state) => {
      if (state.gameOver) return state
      if (state.deck.length === 0 || state.hand.length >= 13 || state.drawsRemaining === 0) return state
      const [top, ...rest] = state.deck
      return { deck: rest, hand: [...state.hand, top], drawsRemaining: state.drawsRemaining - 1 }
    }),

  drawCards: (amount: number) =>
    set((state) => {
      if (state.gameOver) return state
      const toDraw = Math.min(amount, state.deck.length)
      const drawn = state.deck.slice(0, toDraw)
      const rest = state.deck.slice(toDraw)
      console.log('[drawCards] drew', toDraw, 'cards:', drawn.map(c => `${c.rank}${c.suit[0]}`), '| deck remaining:', rest.length)
      return { deck: rest, hand: [...state.hand, ...drawn] }
    }),

  toggleSelect: (id) =>
    set((state) => {
      if (state.phase !== 'playing' || state.gameOver) {
        console.log('[toggleSelect] blocked — phase is', state.phase, '| gameOver:', state.gameOver)
        return state
      }
      const isDeselecting = state.selected.includes(id)
      const next = isDeselecting
        ? state.selected.filter((s) => s !== id)
        : [...state.selected, id]
      console.log(`[toggleSelect] ${isDeselecting ? 'deselected' : 'selected'} ${id} | selected now:`, next)
      return { selected: next }
    }),

  playSelected: () =>
    set((state) => {
      if (state.phase !== 'playing' || state.gameOver) {
        return state
      }
      if (state.selected.length === 0) {
        return state
      }
      if (state.playsRemaining <= 0) {
        console.log('[playSelected] blocked — no plays remaining')
        return state
      }
      const toPlay = state.hand.filter((c) => state.selected.includes(c.id))
      const nextHand = state.hand.filter((c) => !state.selected.includes(c.id))
      const nextPlaysRemaining = state.playsRemaining - 1
      console.log('[playSelected] plays remaining after this:', nextPlaysRemaining)
      return {
        hand: nextHand,
        played: sortByRankFn(sortBySuitFn(toPlay)),
        selected: [],
        phase: 'resolving',
        playsRemaining: nextPlaysRemaining,
      }
    }),

  discardSelected: () =>
    set((state) => {
      if (state.phase !== 'playing' || state.gameOver) {
        console.log('[discardSelected] blocked — phase is', state.phase, '| gameOver:', state.gameOver)
        return state
      }
      if (state.selected.length === 0) {
        console.log('[discardSelected] blocked — nothing selected')
        return state
      }
      const toDiscard = state.hand.filter((c) => state.selected.includes(c.id))
      const nextHand = state.hand.filter((c) => !state.selected.includes(c.id))
      console.log('[discardSelected] discarding:', toDiscard.map(c => `${c.rank}${c.suit[0]}`))
      console.log('[discardSelected] hand after:', nextHand.map(c => `${c.rank}${c.suit[0]}`))

      const { gameOver, gameResult } = resolveGameOver(
        state.playsRemaining,
        state.drawsRemaining,
        nextHand.length,
        state.score
      )

      return {
        hand: nextHand,
        selected: [],
        gameOver,
        gameResult,
      }
    }),

  setPhase: (phase) =>
    set((state) => {
      console.log(`[setPhase] ${state.phase} → ${phase}`)
      return { phase }
    }),

  clearPlayed: () =>
    set((state) => {
      const result = evaluateTienLenHand(state.played)
      const newScore = state.score + result.score

      const { gameOver, gameResult } = resolveGameOver(
        state.playsRemaining,
        state.drawsRemaining,
        state.hand.length,
        newScore
      )

      if (gameOver) {
        console.log(`[clearPlayed] game over — result: ${gameResult} | score: ${newScore} | target: ${SCORE_TO_BEAT}`)
      }

      return {
        played: [],
        score: newScore,
        phase: 'playing',
        suitScores: [
          state.suitScores[0] + result.spadesScore,
          state.suitScores[1] + result.clubsScore,
          state.suitScores[2] + result.diamondsScore,
          state.suitScores[3] + result.heartsScore,
        ],
        gameOver,
        gameResult,
      }
    }),

  resetGame: () => {
    console.log('[resetGame] resetting all state')
    return set({
      deck: shuffle(buildDeck()),
      hand: [],
      selected: [],
      played: [],
      phase: 'playing',
      score: 0,
      suitScores: [0, 0, 0, 0],
      drawsRemaining: 13,
      playsRemaining: PLAY_HAND_LIMIT,
      gameOver: false,
      gameResult: null,
    })
  },

  sortBySuit: () =>
    set((state) => {
      console.log('[sortBySuit] sorting hand by suit')
      return { hand: sortBySuitFn(state.hand) }
    }),

  sortByRank: () =>
    set((state) => {
      console.log('[sortByRank] sorting hand by rank')
      return { hand: sortByRankFn(state.hand) }
    }),
}))

// --- Hooks ---

export function useInitialDraw(amount: number) {
  const drawCards = useCardGame((state) => state.drawCards)
  const hasDrawn = useRef(false)

  useEffect(() => {
    if (hasDrawn.current) return
    hasDrawn.current = true
    console.log('[useInitialDraw] drawing initial hand of', amount)
    drawCards(amount)
  }, [])
}

export function usePhaseSequence(resolvingMs = 1200, clearingMs = 600) {
  const phase = useCardGame((state) => state.phase)
  const setPhase = useCardGame((state) => state.setPhase)
  const clearPlayed = useCardGame((state) => state.clearPlayed)

  useEffect(() => {
    if (phase === 'resolving') {
      console.log(`[usePhaseSequence] resolving — will move to clearing in ${resolvingMs}ms`)
      const t = setTimeout(() => setPhase('clearing'), resolvingMs)
      return () => clearTimeout(t)
    }
    if (phase === 'clearing') {
      console.log(`[usePhaseSequence] clearing — will call clearPlayed in ${clearingMs}ms`)
      const t = setTimeout(() => clearPlayed(), clearingMs)
      return () => clearTimeout(t)
    }
  }, [phase])
}