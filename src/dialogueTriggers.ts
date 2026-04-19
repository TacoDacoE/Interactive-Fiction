export interface PageData {
  name: string
  imageSrc: string
  content: string
}

export type Suit = "spades" | "clubs" | "diamonds" | "hearts";

export interface DialogueTrigger {
  id: string  // add a stable unique id
  suit: Suit
  scoreRange: [min: number, max: number]
  pages: PageData[]
}

export const dialogueTriggers: DialogueTrigger[] = [
  {
    id: 'insert descriptor about scenario',
    suit: 'hearts',
    scoreRange: [0, 1000],
    pages:
      [
        {
          name: 'Alice',
          imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
          content: 'Alice was a brave adventurer who...',
        },
        {
          name: 'Bob',
          imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
          content: 'Bob was a cunning merchant who...',
        },
        {
          name: 'Carol',
          imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
          content: 'Carol was a wise scholar who...',
        },
      ],
  },
  {
    id: 'insert descriptor about scenario2',
    suit: 'spades',
    scoreRange: [31, 1000],
    pages:
      [
        {
          name: 'Alice',
          imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
          content: 'Alice was a brave adventurer who...',
        },
        {
          name: 'Bob',
          imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
          content: 'Bob was a cunning merchant who...',
        },
        {
          name: 'Carol',
          imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
          content: 'Carol was a wise scholar who...',
        },
      ],
  },
]

/*
example of pages
imageSrc are placed in the folder and then imported, before constructing
import alicePortrait from '../../assets/portraits/alice.png'
import bobPortrait from '../../assets/portraits/bob.png'

[
  {
    name: 'Alice',
    imageSrc: alicePortrait,
    content: 'Alice was a brave adventurer who...',
  },
  {
    name: 'Bob',
    imageSrc: bobPortrait,
    content: 'Bob was a cunning merchant who...',
  },
  {
    name: 'Carol',
    imageSrc: 'carolPortrait,
    content: 'Carol was a wise scholar who...',
  },
]

*/