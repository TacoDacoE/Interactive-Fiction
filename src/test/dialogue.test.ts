import { describe, it, expect } from 'vitest'
import { dialogueTriggers } from '../dialogueTriggers'

describe('dialogueTriggers', () => {
  it('has unique ids', () => {
    const ids = dialogueTriggers.map((t) => t.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })
})