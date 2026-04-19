// src/engine/resolveDialogue.ts
import { DialogueTrigger } from '../dialogueTriggers'

const SUIT_INDEX: Record<string, number> = {
  spades: 0, clubs: 1, diamonds: 2, hearts: 3,
}

export function resolveDialogue(
  triggers: DialogueTrigger[],
  suitScores: number[],
  triggeredIds: string[]
): DialogueTrigger | null {
  const dominantSuitIndex = suitScores.indexOf(Math.max(...suitScores))
  const dominantSuit = Object.keys(SUIT_INDEX)[dominantSuitIndex] as DialogueTrigger['suit']
  const dominantScore = suitScores[dominantSuitIndex]

  const candidates = triggers.filter((t) => {
    if (triggeredIds.includes(t.id)) return false
    if (t.suit !== dominantSuit) return false
    const [min, max] = t.scoreRange
    return dominantScore >= min && dominantScore <= max
  })

  // Return first match — order your triggers array by priority
  return candidates[0] ?? null
}