import { useEffect, useRef } from 'react'
import { create } from 'zustand'
import { evaluateTienLenHand } from './EvaluateHand'
import { PLAY_HAND_LIMIT, SCORE_TO_BEAT } from '../constants'
import { dialogueTriggers, PageData, Suit } from '../dialogueTriggers'
import { resolveDialogue } from './resolveDialogue'

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
  discardPile: Card[]   // accumulates all cards played this round; consumed by nextRound
  phase: GamePhase
  score: number
  suitScores: number[]
  drawsRemaining: number
  playsRemaining: number
  gameOver: boolean
  gameResult: GameResult
  roundNumber: number
  triggeredDialogueIds: string[]
  activeDialoguePages: PageData[] | null
  activeDialogueSuit: Suit | null

  drawCard: () => void
  drawCards: (amount: number) => void
  toggleSelect: (id: string) => void
  playSelected: () => void
  discardSelected: () => void
  setPhase: (phase: GamePhase) => void
  clearPlayed: () => void
  resetGame: () => void
  nextRound: () => void
  sortBySuit: () => void
  sortByRank: () => void
  dismissDialogue: () => void
}

// --- Constants ---

// Every round has 22 cards. After dealing 13, 9 remain drawable.
// On each loss, 2 penalty cards are added, so round N has 22 + (N-1)*2 cards.
const ROUND_1_DECK_SIZE = 20
const INITIAL_HAND_SIZE = 13
const PENALTY_CARDS_PER_LOSS = 2

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

/**
 * Picks `count` cards from a full shuffled deck that are NOT already in `existingIds`.
 * Guarantees no duplicates when adding penalty cards to an existing pool.
 */
function pickUniqueCards(count: number, existingIds: Set<string>): Card[] {
  const pool = shuffle(buildDeck()).filter((c) => !existingIds.has(c.id))
  return pool.slice(0, count)
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
  console.log('[resolveGameOver] inputs:', { playsRemaining, drawsRemaining, handSize, score, SCORE_TO_BEAT })

  if (playsRemaining > 0) {
    console.log('[resolveGameOver] → not over (plays remaining)')
    return { gameOver: false, gameResult: null }
  }
  if (playsRemaining === 0) {
    const result = score >= SCORE_TO_BEAT ? 'win' : 'loss'
    console.log(`[resolveGameOver] → GAME OVER (0 plays left) | score ${score} vs target ${SCORE_TO_BEAT} → ${result}`)
    return { gameOver: true, gameResult: result }
  }
  const cantContinue = handSize === 0 && drawsRemaining === 0
  if (!cantContinue) {
    console.log('[resolveGameOver] → not over (can still continue)')
    return { gameOver: false, gameResult: null }
  }
  const result = score >= SCORE_TO_BEAT ? 'win' : 'loss'
  console.log(`[resolveGameOver] → GAME OVER (no hand + no draws) | score ${score} vs target ${SCORE_TO_BEAT} → ${result}`)
  return { gameOver: true, gameResult: result }
}

// --- Dialogue Resolution Debug Wrapper ---

function resolveDialogueDebug(
  suitScores: number[],
  triggeredDialogueIds: string[]
) {
  const SUIT_NAMES = ['spades', 'clubs', 'diamonds', 'hearts']
  const maxScore = Math.max(...suitScores)
  const dominantIndex = suitScores.indexOf(maxScore)
  const dominantSuit = SUIT_NAMES[dominantIndex]

  console.group('[resolveDialogue] Evaluating triggers')
  console.log('suitScores:', { spades: suitScores[0], clubs: suitScores[1], diamonds: suitScores[2], hearts: suitScores[3] })
  console.log('dominantSuit:', dominantSuit, '| dominantScore:', maxScore)
  console.log('triggeredDialogueIds:', triggeredDialogueIds)
  console.log('dialogueTriggers available:', dialogueTriggers.map(t => ({
    id: t.id,
    suit: t.suit,
    scoreRange: t.scoreRange,
  })))

  dialogueTriggers.forEach((t) => {
    const alreadyTriggered = triggeredDialogueIds.includes(t.id)
    const suitMatch = t.suit === dominantSuit
    const scoreMatch = maxScore >= t.scoreRange[0] && maxScore <= t.scoreRange[1]
    const passes = !alreadyTriggered && suitMatch && scoreMatch

    console.log(
      `  trigger "${t.id}":`,
      passes ? '✅ MATCH' : '❌ skip',
      {
        alreadyTriggered,
        suitMatch: `${t.suit} === ${dominantSuit} → ${suitMatch}`,
        scoreMatch: `${maxScore} in [${t.scoreRange[0]}, ${t.scoreRange[1]}] → ${scoreMatch}`,
      }
    )
  })

  const match = resolveDialogue(dialogueTriggers, suitScores, triggeredDialogueIds)
  console.log('resolveDialogue result:', match ? `matched "${match.id}"` : 'NO MATCH')
  console.groupEnd()

  return match
}

// --- Store ---

export const useCardGame = create<CardGameState>((set) => ({
  // Round 1: 22-card subset of a full shuffled deck
  deck: shuffle(buildDeck()).slice(0, ROUND_1_DECK_SIZE),
  hand: [],
  selected: [],
  played: [],
  discardPile: [],
  phase: 'playing',
  score: 0,
  suitScores: [0, 0, 0, 0],
  drawsRemaining: ROUND_1_DECK_SIZE - INITIAL_HAND_SIZE,
  playsRemaining: PLAY_HAND_LIMIT,
  gameOver: false,
  gameResult: null,
  roundNumber: 1,
  triggeredDialogueIds: [],
  activeDialoguePages: null,
  activeDialogueSuit: null,

  drawCard: () =>
    set((state) => {
      if (state.gameOver) { console.log('[drawCard] blocked — game over'); return state }
      if (state.deck.length === 0) { console.log('[drawCard] blocked — deck empty'); return state }
      if (state.hand.length >= 13) { console.log('[drawCard] blocked — hand full'); return state }
      if (state.drawsRemaining === 0) { console.log('[drawCard] blocked — no draws remaining'); return state }
      const [top, ...rest] = state.deck
      console.log('[drawCard] drew:', `${top.rank}${top.suit[0]}`, '| draws remaining:', state.drawsRemaining - 1)
      return { deck: rest, hand: [...state.hand, top], drawsRemaining: state.drawsRemaining - 1 }
    }),

  drawCards: (amount: number) =>
    set((state) => {
      if (state.gameOver) { console.log('[drawCards] blocked — game over'); return state }
      const toDraw = Math.min(amount, state.deck.length)
      const drawn = state.deck.slice(0, toDraw)
      const rest = state.deck.slice(toDraw)
      console.log('[drawCards] drew', toDraw, 'of requested', amount, '| cards:', drawn.map(c => `${c.rank}${c.suit[0]}`), '| deck remaining:', rest.length)
      return { deck: rest, hand: [...state.hand, ...drawn] }
    }),

  toggleSelect: (id) =>
    set((state) => {
      if (state.phase !== 'playing' || state.gameOver) {
        console.log('[toggleSelect] blocked — phase:', state.phase, '| gameOver:', state.gameOver)
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
        console.log('[playSelected] blocked — phase:', state.phase, '| gameOver:', state.gameOver)
        return state
      }
      if (state.selected.length === 0) {
        console.log('[playSelected] blocked — nothing selected')
        return state
      }
      if (state.playsRemaining <= 0) {
        console.log('[playSelected] blocked — no plays remaining')
        return state
      }
      const toPlay = state.hand.filter((c) => state.selected.includes(c.id))
      const nextHand = state.hand.filter((c) => !state.selected.includes(c.id))
      const nextPlaysRemaining = state.playsRemaining - 1
      console.log('[playSelected] playing:', toPlay.map(c => `${c.rank}${c.suit[0]}`), '| plays remaining after:', nextPlaysRemaining)
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
        console.log('[discardSelected] blocked — phase:', state.phase, '| gameOver:', state.gameOver)
        return state
      }
      if (state.selected.length === 0) {
        console.log('[discardSelected] blocked — nothing selected')
        return state
      }

      const toDiscard = state.hand.filter((c) => state.selected.includes(c.id))
      const nextHand = state.hand.filter((c) => !state.selected.includes(c.id))
      console.log('[discardSelected] discarding:', toDiscard.map(c => `${c.rank}${c.suit[0]}`))
      console.log('[discardSelected] hand after discard:', nextHand.map(c => `${c.rank}${c.suit[0]}`))
      console.log('[discardSelected] state going into resolveGameOver:', {
        playsRemaining: state.playsRemaining,
        drawsRemaining: state.drawsRemaining,
        nextHandSize: nextHand.length,
        score: state.score,
      })

      const { gameOver, gameResult } = resolveGameOver(
        state.playsRemaining,
        state.drawsRemaining,
        nextHand.length,
        state.score
      )

      let activeDialoguePages = state.activeDialoguePages
      let activeDialogueSuit = state.activeDialogueSuit
      let triggeredDialogueIds = state.triggeredDialogueIds

      if (gameOver) {
        console.log('[discardSelected] game is over — attempting dialogue resolution')
        const match = resolveDialogueDebug(state.suitScores, triggeredDialogueIds)
        if (match) {
          console.log('[discardSelected] ✅ dialogue matched:', match.id, '| pages:', match.pages.length)
          activeDialoguePages = match.pages
          activeDialogueSuit = match.suit
          triggeredDialogueIds = [...triggeredDialogueIds, match.id]
        } else {
          console.warn('[discardSelected] ⚠️ game over but NO dialogue matched — modal will not open')
        }
      } else {
        console.log('[discardSelected] game not over — skipping dialogue resolution')
      }

      console.log('[discardSelected] returning state:', { gameOver, gameResult, hasActiveDialogue: !!activeDialoguePages })
      return {
        hand: nextHand,
        selected: [],
        gameOver,
        gameResult,
        activeDialoguePages,
        activeDialogueSuit,
        triggeredDialogueIds,
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
      const newSuitScores = [
        state.suitScores[0] + result.spadesScore,
        state.suitScores[1] + result.clubsScore,
        state.suitScores[2] + result.diamondsScore,
        state.suitScores[3] + result.heartsScore,
      ]

      console.log('[clearPlayed] hand result:', result)
      console.log('[clearPlayed] score:', state.score, '+', result.score, '=', newScore)
      console.log('[clearPlayed] newSuitScores:', {
        spades: newSuitScores[0],
        clubs: newSuitScores[1],
        diamonds: newSuitScores[2],
        hearts: newSuitScores[3],
      })
      console.log('[clearPlayed] state going into resolveGameOver:', {
        playsRemaining: state.playsRemaining,
        drawsRemaining: state.drawsRemaining,
        handSize: state.hand.length,
        newScore,
      })

      const { gameOver, gameResult } = resolveGameOver(
        state.playsRemaining,
        state.drawsRemaining,
        state.hand.length,
        newScore
      )

      let activeDialoguePages = state.activeDialoguePages
      let activeDialogueSuit = state.activeDialogueSuit
      let triggeredDialogueIds = state.triggeredDialogueIds

      if (gameOver) {
        console.log('[clearPlayed] game is over — attempting dialogue resolution')
        const match = resolveDialogueDebug(newSuitScores, triggeredDialogueIds)
        if (match) {
          console.log('[clearPlayed] ✅ dialogue matched:', match.id, '| pages:', match.pages.length)
          activeDialoguePages = match.pages
          activeDialogueSuit = match.suit
          triggeredDialogueIds = [...triggeredDialogueIds, match.id]
        } else {
          console.warn('[clearPlayed] ⚠️ game over but NO dialogue matched — modal will not open')
        }
      } else {
        console.log('[clearPlayed] game not over yet — skipping dialogue')
      }

      console.log('[clearPlayed] returning state:', { gameOver, gameResult, hasActiveDialogue: !!activeDialoguePages })
      return {
        played: [],
        discardPile: [...state.discardPile, ...state.played],
        score: newScore,
        suitScores: newSuitScores,
        phase: 'playing',
        gameOver,
        gameResult,
        activeDialoguePages,
        activeDialogueSuit,
        triggeredDialogueIds,
      }
    }),

  // Full reset — wipes everything, goes back to round 1 with a fresh 20-card deck
  resetGame: () => {
    console.log('[resetGame] resetting all state to round 1')
    return set({
      deck: shuffle(buildDeck()).slice(0, ROUND_1_DECK_SIZE),
      hand: [],
      selected: [],
      played: [],
      discardPile: [],
      phase: 'playing',
      score: 0,
      suitScores: [0, 0, 0, 0],
      drawsRemaining: ROUND_1_DECK_SIZE - INITIAL_HAND_SIZE,
      playsRemaining: PLAY_HAND_LIMIT,
      gameOver: false,
      gameResult: null,
      roundNumber: 1,
      triggeredDialogueIds: [],
      activeDialoguePages: null,
      activeDialogueSuit: null,
    })
  },

  /**
   * Advance to the next round after a loss.
   *
   * New deck = every card from this round (hand + undealt deck + played pile)
   *          + PENALTY_CARDS_PER_LOSS brand-new unique cards
   *
   * All reshuffled together. Cards the player saw or held all survive into
   * the next round. drawsRemaining = new deck size − 13 (the initial deal).
   */
  nextRound: () =>
    set((state) => {
      const nextRoundNumber = state.roundNumber + 1

      // Every card that existed this round: still in hand, still in deck, or accumulated in discard pile
      const allThisRoundCards = [...state.hand, ...state.deck, ...state.discardPile]
      const allThisRoundIds = new Set(allThisRoundCards.map((c) => c.id))

      // Add fresh penalty cards (guaranteed unique)
      const penaltyCards = pickUniqueCards(PENALTY_CARDS_PER_LOSS, allThisRoundIds)

      const nextDeck = shuffle([...allThisRoundCards, ...penaltyCards])
      const nextDrawsRemaining = nextDeck.length - INITIAL_HAND_SIZE

      console.log('[nextRound] → round', nextRoundNumber)
      console.log('[nextRound] carried cards:', allThisRoundCards.length, '| penalty:', penaltyCards.map(c => `${c.rank}${c.suit[0]}`))
      console.log('[nextRound] new deck size:', nextDeck.length, '| drawsRemaining after deal:', nextDrawsRemaining)

      return {
        deck: nextDeck,
        hand: [],
        selected: [],
        played: [],
        discardPile: [],
        phase: 'playing',
        score: 0,
        suitScores: [0, 0, 0, 0],
        drawsRemaining: nextDrawsRemaining,
        playsRemaining: PLAY_HAND_LIMIT,
        gameOver: false,
        gameResult: null,
        roundNumber: nextRoundNumber,
        triggeredDialogueIds: [],
        activeDialoguePages: null,
        activeDialogueSuit: null,
      }
    }),

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

  dismissDialogue: () => {
    console.log('[dismissDialogue] clearing activeDialoguePages')
    return set({ activeDialoguePages: null, activeDialogueSuit: null })
  },
}))

// --- Hooks ---

export function useInitialDraw(amount: number) {
  const drawCards = useCardGame((state) => state.drawCards)
  const gameOver = useCardGame((state) => state.gameOver)
  const hand = useCardGame((state) => state.hand)
  const roundNumber = useCardGame((state) => state.roundNumber)
  const hasDrawn = useRef(false)
  const lastDrawnRound = useRef(0)

  useEffect(() => {
    // When the round/game ends, clear the draw guard so the next round can draw
    if (gameOver) {
      hasDrawn.current = false
    }
  }, [gameOver])

  useEffect(() => {
    // When a new round begins (hand is empty again), clear the guard for that round
    if (hand.length === 0 && !gameOver && roundNumber !== lastDrawnRound.current) {
      hasDrawn.current = false
    }
  }, [roundNumber])

  useEffect(() => {
    if (hasDrawn.current) return
    if (hand.length === 0 && !gameOver) {
      hasDrawn.current = true
      lastDrawnRound.current = roundNumber
      console.log('[useInitialDraw] drawing initial hand of', amount, '| round', roundNumber)
      drawCards(amount)
    }
  }, [gameOver, roundNumber])
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