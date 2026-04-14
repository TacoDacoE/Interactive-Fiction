export interface PageData {
  name: string
  imageSrc: string
  content: string
}

type Suit = "spades" | "clubs" | "diamonds" | "hearts";

export interface DialogueTrigger {
  id: string  // add a stable unique id
  suit: Suit
  scoreRange: [min: number, max: number]
  pages: PageData[]
}

const dialogueTriggers: DialogueTrigger[] = [
  {
    id: 'insert descriptor about scenario',
    suit: 'hearts',
    scoreRange: [0, 30],
    pages: [

    ],
  },
  {
    id: 'insert descriptor about scenario',
    suit: 'hearts',
    scoreRange: [31, 100],
    pages: [

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