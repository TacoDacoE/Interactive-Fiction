import gAngry from './assets/g_angry.png'
import gHappy from './assets/g_happy.png'
import gSad from './assets/g_sad.png'

import dAngry from './assets/d_angry.png'
import dHappy from './assets/d_happy.png'
import dSad from './assets/d_sad.png'

import mAngry from './assets/m_angry.png'
import mHappy from './assets/m_happy.png'
import mSad from './assets/m_sad.png'

import tAngry from './assets/t_angry.png'
import tHappy from './assets/t_happy.png'
import tSad from './assets/t_sad.png'

export type Suit = 'spades' | 'clubs' | 'diamonds' | 'hearts'
export type Emotion = 'happy' | 'sad' | 'angry'
export type CharacterId = 'g' | 'd' | 'm' | 't'

export interface SceneCharacter {
  id: CharacterId
  emotion: Emotion
  imageSrc: string
}

export interface PageData {
  name: string
  content: string
}

export interface DialogueTrigger {
  id: string
  suit: Suit
  scoreRange: [min: number, max: number]
  sceneCharacters: SceneCharacter[]
  pages: PageData[]
}

const portraitMap: Record<CharacterId, Record<Emotion, string>> = {
  g: {
    angry: gAngry,
    happy: gHappy,
    sad: gSad,
  },
  d: {
    angry: dAngry,
    happy: dHappy,
    sad: dSad,
  },
  m: {
    angry: mAngry,
    happy: mHappy,
    sad: mSad,
  },
  t: {
    angry: tAngry,
    happy: tHappy,
    sad: tSad,
  },
}

const character = (id: CharacterId, emotion: Emotion): SceneCharacter => ({
  id,
  emotion,
  imageSrc: portraitMap[id][emotion],
})

const page = (name: string, content: string): PageData => ({
  name,
  content,
})

export const dialogueTriggers: DialogueTrigger[] = [
  {
    id: 'grandmother-scolds-alex-obedience',
    suit: 'diamonds',
    scoreRange: [0, 39],
    sceneCharacters: [character('g', 'angry'), character('t', 'happy')],
    pages: [
      page(
        'Grandmother',
        'You are the older one, you should know better than to pull something like this! How could you run out all by yourself? You need to tell me about this first! I do not care if it is just the neighbors, it is dangerous outside.',
      ),
      page(
        'Grandmother',
        'Even your younger brother knows this better than you do! Teddy tells me everything, and you should do it as well... you really need to do better as the older sister.',
      ),
      page('', "Grandmother puts her arms around Teddy's shoulder."),
      page(
        'Grandmother',
        'You are a good son. Do not be like your older sister when you grow up. Promise to tell me everything?',
      ),
      page('Teddy', 'I promise!'),
      page(
        '',
        'Grandmother pats his head affectionately and squeezes him tightly in her arms.',
      ),
    ],
  },
  {
    id: 'kitchen-table-responsibility-talk',
    suit: 'spades',
    scoreRange: [0, 39],
    sceneCharacters: [character('g', 'sad')],
    pages: [
      page(
        '',
        'You see your grandmother at the kitchen table, cutting up various fruits for a platter. You have a half-peeled mandarin in front of you.',
      ),
      page(
        'Grandmother',
        'Grandma does not want to yell at you. Trust me. I love you and Teddy both so much. I am just so worried about the dangers outside.',
      ),
      page(
        'Grandmother',
        'I know you are still young, but I know deep down you are mature enough to understand that you have a responsibility to our family.',
      ),
      page(
        'Grandmother',
        'We have to look out for each other and keep each other safe, so that means you need to listen to me when I tell you to talk to me.',
      ),
      page(
        '',
        'You nod in agreement, promise to tell her everything, and apologize for disobeying her before.',
      ),
      page(
        'Grandmother',
        'Thank you, Alex. It really means a lot. All I want is to keep this family together and safe. Now let us hurry and finish cutting the fruit before Teddy wakes up and gets jealous we did this without him!',
      ),
    ],
  },
  {
    id: 'grandmother-pressures-father-over-bills',
    suit: 'diamonds',
    scoreRange: [40, 79],
    sceneCharacters: [character('g', 'angry'), character('d', 'sad')],
    pages: [
      page(
        'Father',
        'We just keep on getting bill after bill. It is so hard to keep up with it all. I am not even sure where all of these are even coming from. If we cannot get on top of these, we might have to move and downsize the house.',
      ),
      page(
        'Grandmother',
        'Well we cannot let that happen, can we? I have seen how hard you work to keep this household together. There must be somewhere you can cut some spending.',
      ),
      page(
        'Father',
        'There is um... one area where we can cut some spending. If you could keep down some of your spending—',
      ),
      page(
        'Grandmother',
        'Nonsense! What are you even talking about? You are the head of your household, so get your act together.',
      ),
      page(
        'Grandmother',
        'I let you marry my daughter because you promised me that you would be able to take care of her and her family. When your family had an emergency, I was more than willing to give them my money to help out. Is this how you repay me?',
      ),
      page(
        '',
        'You have never seen your father this terrified before. His mouth is left agape for a moment before he finds his voice.',
      ),
      page(
        'Father',
        'Y-yes, you are right. I am sorry. I should not be treating my mother-in-law like this.',
      ),
      page(
        'Grandmother',
        'You are my son now, and I intend to treat you as such. Maybe you can take on another job to help with the bills, and I will try to find places where we can cut our budget.',
      ),
      page(
        'Grandmother',
        'At the end of the day, I just want to keep this family safe under one roof. Thank you for telling me this. I will also help in any way I can.',
      ),
      page(
        '',
        "Your father's mood lightens slightly as your grandmother takes his hands in her own and pats them softly.",
      ),
    ],
  },
  {
    id: 'mother-breakdown-and-grandmother-strength-lecture',
    suit: 'spades',
    scoreRange: [40, 79],
    sceneCharacters: [character('m', 'sad'), character('g', 'sad')],
    pages: [
      page(
        'Mother',
        'I do not know how much more I can take this. Every single day it feels like I cannot do anything! We are constantly behind on bills, and the kids are already in their rebellious stage, all while my husband works to the bone every single day just to keep us afloat. I just cannot take this anymore!',
      ),
      page(
        'Grandmother',
        'Calm down, calm down. The children might hear you if you keep screaming like that.',
      ),
      page(
        'Grandmother',
        'I know that this is hard right now, but you need to show your kids that you are in control of the house. How else will they listen to you if you are always so emotional?',
      ),
      page(
        'Mother',
        'You just do not get it! What am I supposed to do about Teddy? I never misbehaved the way he did when you raised me. I am just all out of ideas, and the never-ending bills make it hard to keep it from the kids.',
      ),
      page(
        'Grandmother',
        'You need to be strong. Your husband is out all day working, so you need to maintain the house from within. Our family needs you to be able to deal with these stresses yourself.',
      ),
      page(
        'Mother',
        'I know... I just keep on thinking how much easier it would be if we could just move back to our old place. It was so much cheaper.',
      ),
      page(
        'Grandmother',
        'It was cheaper, but now you have your own home! That is an investment worth a lifetime! You also have me to help with keeping the children in check.',
      ),
      page(
        'Mother',
        'Yeah... we have a permanent place for our family now, and I know the kids will listen to you much better than to me.',
      ),
      page(
        '',
        'Your grandmother puts her arms around your mother as your mother leans into her touch. She has stopped crying, but a crease remains in her brows.',
      ),
    ],
  },
  {
    id: 'old-property-loan-decision',
    suit: 'diamonds',
    scoreRange: [80, 119],
    sceneCharacters: [
      character('g', 'angry'),
      character('d', 'sad'),
      character('m', 'angry'),
      character('t', 'happy'),
    ],
    pages: [
      page(
        'Grandmother',
        'Please, please... I will not ask anymore out of this family financially. I just want to buy back our old home.',
      ),
      page(
        'Father',
        'I know how important this is to you, but we really do not have any money saved up for this. We just finished paying off the last of our bills.',
      ),
      page(
        'Grandmother',
        'Cannot you take out another loan? I will put all the money from my retirement into this, so you do not have to pay as much.',
      ),
      page(
        'Mother',
        'Do not you need those savings in case anything happens? Those funds are for emergency purposes only.',
      ),
      page(
        'Grandmother',
        'I know that. If this were not an emergency, I would not be willing to take all of it out to buy back our property. If we do not take this offer, someone else will lay claim to our property! We need to show our children where they came from. We must preserve our tradition.',
      ),
      page(
        'Teddy',
        'Hmm... it would be really cool if we had that land! We could go on vacation there sometime!',
      ),
      page(
        'Grandmother',
        'See! Listen to your children, respect their voices. Do not sell out your roots just because you no longer live there. We must maintain our traditions.',
      ),
      page(
        'Mother',
        'We cannot even pay for a vacation there after we buy the land. What purpose—',
      ),
      page('Father', 'How much exactly would we have to pay if we buy the land?'),
      page(
        'Mother',
        'What are you saying? We just got on top of our finances and you want to go back to working three jobs?',
      ),
      page(
        'Father',
        "No, I am just saying that we should respect your mother's wishes. She has made good calls in the past with major decisions. We should trust her on this if it is not too much money.",
      ),
      page('', 'Your mother storms off. Your grandmother looks upset.'),
      page(
        'Grandmother',
        'She is always this emotional. It is a good thing she married a rational man like you.',
      ),
      page(
        '',
        'You do not remember the rest clearly, only that your parents took out a loan to reclaim the property and both of them worked two jobs to pay it off.',
      ),
    ],
  },
  {
    id: 'soccer-dream-dimmed',
    suit: 'spades',
    scoreRange: [80, 119],
    sceneCharacters: [
      character('t', 'happy'),
      character('m', 'happy'),
      character('d', 'happy'),
      character('g', 'sad'),
    ],
    pages: [
      page(
        'Teddy',
        'That match was incredible! I swear, the entire student section started chanting your name after you scored your hat trick!',
      ),
      page(
        'Mother',
        'I think I heard that from the parent section! Your dad and I were cheering really loudly so we could not really hear anything else.',
      ),
      page(
        'Father',
        'I bet you are going to have recruiters chasing you down with that move you pulled!',
      ),
      page(
        '',
        'You excitedly talk about playing soccer in university and maybe even professionally.',
      ),
      page('Teddy', 'Yeah, yeah, just remember us when you are famous.'),
      page(
        'Grandmother',
        'What is all this commotion so late at night? You should all be going to sleep. It is too late to be holding a family meeting.',
      ),
      page(
        'Father',
        "Oh, sorry! We just came back from Alex's soccer game, and she did a really good job. There were probably some recruiters there, so we might be sending her off to—",
      ),
      page(
        'Grandmother',
        'I am glad that your hobbies are going well. It is good to have fun before all your responsibilities kick in for real.',
      ),
      page(
        'Mother',
        'Well, it would be great for this hobby to turn into a scholarship opportunity, would it not?',
      ),
      page(
        'Grandmother',
        'Yes, yes, it would be good for you to get a free ride so your parents will not have to work anymore to save up for your tuition for a real degree.',
      ),
      page(
        'Grandmother',
        'Well, I will be heading to bed now. I hope you all do the same, especially you, Alex. You have had your fun for the day.',
      ),
      page(
        '',
        'Your parents drop the subject. Later, when you remember your soccer days, there is still a pang in your chest.',
      ),
    ],
  },
  {
    id: 'teddy-detained-by-sheriff',
    suit: 'diamonds',
    scoreRange: [120, 159],
    sceneCharacters: [
      character('d', 'angry'),
      character('m', 'angry'),
      character('t', 'angry'),
    ],
    pages: [
      page(
        '',
        'An officer points your family toward the holding cell and mutters that kids will be kids, and that there will not be serious repercussions this time.',
      ),
      page(
        'Father',
        'What is wrong with you? Have you lost your mind sneaking out after midnight to an empty lot?',
      ),
      page(
        'Mother',
        'Is there anything that goes on inside there? Keep this up and not even community college will take you. Do you even understand the gravity of the situation?',
      ),
      page(
        'Teddy',
        'Why do you guys even care? All we did was hang out at an empty parking lot at night. You are blowing this out of proportion.',
      ),
      page(
        'Mother',
        'Your sister never did anything like this before. Why cannot you just be more like her?',
      ),
      page(
        'Teddy',
        'You just want a lap dog that follows your every order. You do not let me do what I am actually interested in unless it helps me get into a good university—',
      ),
      page(
        'Father',
        'Watch your language, young man. We have worked hard to give you what you have, but that is just never enough for you because all you can ever think about is yourself.',
      ),
      page(
        'Father',
        'Have you ever considered how grandmother felt when she got the call that you were detained by the police? She was worried sick. I was worried sick. We were all worried sick. You just never want to think about your family. What have you ever done for us?',
      ),
      page(
        '',
        'Their lectures keep piling on. Thinking of all the times you sacrificed your own desires for the family, you start to feel a little resentment toward Teddy.',
      ),
    ],
  },
  {
    id: 'dream-university-never-answers',
    suit: 'spades',
    scoreRange: [120, 159],
    sceneCharacters: [
      character('m', 'sad'),
      character('d', 'sad'),
      character('g', 'happy'),
    ],
    pages: [
      page(
        '',
        'Your father drops a hefty stack of mail onto the dinner table. There are local ads and invoices, but that is not what you are searching for.',
      ),
      page('Mother', 'Well... I am not seeing anything about university admissions letters.'),
      page('Father', 'No university letters, but a lot of unexpected invoices. That is odd.'),
      page('', 'You check each envelope carefully and dread settles in.'),
      page(
        'Mother',
        'Universities send offers at different times, so just because your friend got hers today does not mean you did not get in. Maybe it will get here tomorrow!',
      ),
      page(
        '',
        'You mumble that all your other friends already got theirs and that it is probably too late now.',
      ),
      page(
        'Grandmother',
        'I know you are sad now, but if you were to go there, you would be hundreds of miles away from us. You would get homesick, and if you were ever in trouble, we would be too far away to help you in time.',
      ),
      page(
        'Grandmother',
        'Every cloud has a silver lining. I think you would find it easier if you could go somewhere local. I will make sure to drop off my home-cooked meals when you get tired of the cafeteria food!',
      ),
      page(
        'Mother',
        'That is right! You get to be close to family. You got the offer from the university downtown. It has a great reputation and you can even live at home!',
      ),
      page(
        'Father',
        'It would also save us a fortune on housing and tuition. Uh, but you being close to family is the most important!',
      ),
      page(
        'Grandmother',
        'See, you do not have to leave us so soon. You will have the rest of your life after college to set out and explore the world. Stay with us a little longer, all right? Family needs to stick together.',
      ),
      page(
        '',
        'They keep listing reasons why not receiving the offer is a good thing. It does not make you feel any better.',
      ),
    ],
  },
  {
    id: 'job-offer-across-country-stay-home',
    suit: 'diamonds',
    scoreRange: [160, 199],
    sceneCharacters: [
      character('t', 'happy'),
      character('m', 'happy'),
      character('g', 'angry'),
    ],
    pages: [
      page(
        'Teddy',
        'No way! You got an offer from there? I heard they only hire less than one percent of applicants.',
      ),
      page('Mother', 'That is incredible! See? I told you that you had nothing to worry about!'),
      page(
        '',
        'Your grandmother comes downstairs. Somehow, you wish she had stayed upstairs and left you alone with your mother and Teddy.',
      ),
      page('Grandmother', 'Oh? Am I walking in on some good news? You all look so happy!'),
      page('Mother', 'Tell her!'),
      page(
        '',
        'You tell your grandmother about the job offer in a city across the country.',
      ),
      page(
        'Grandmother',
        'Will you be taking it? Do you not already have an offer from another company? When did this offer come in?',
      ),
      page(
        'Teddy',
        'She would have to be stupid not to. It pays so much more than what mom and dad make.',
      ),
      page(
        'Mother',
        'Watch your language, young man! However, he is right. She will not have to worry about money if she takes this job, and that is what we want for her.',
      ),
      page(
        'Grandmother',
        'Do you even hear yourselves? You want your daughter to leave her family and move to a city that is far too expensive for us to visit?',
      ),
      page('Mother', 'She will be fine on her own. We cannot expect her to—'),
      page(
        'Grandmother',
        "If this is about money, cannot she just live here? We have this house and an empty room just for her. She can save money and help out here with the family's finances.",
      ),
      page(
        'Teddy',
        'Oh my gosh, it is always about the family and money for you, is it not? Why cannot you just be happy for her this once?',
      ),
      page(
        'Mother',
        'Go to your room if you are just going to insult your grandmother. She just wants to help, and God knows how much we need the financial help around here.',
      ),
      page(
        'Grandmother',
        'Please do not raise your voice at me. I just want to keep this family together, and family needs to help each other out.',
      ),
      page(
        '',
        'Her words weigh on you. The moment she says them, you know you cannot leave the house.',
      ),
    ],
  },
  {
    id: 'teddy-leaves-and-grandmother-cuts-him-off',
    suit: 'diamonds',
    scoreRange: [200, 239],
    sceneCharacters: [
      character('g', 'angry'),
      character('d', 'angry'),
      character('m', 'sad'),
      character('t', 'angry'),
    ],
    pages: [
      page(
        'Grandmother',
        'What is it with you now? It is always something wrong with me, is it not?',
      ),
      page(
        'Teddy',
        'All I did was accept the offer. What the hell is it to you if I am in a different state? There is a lot of money to be made there.',
      ),
      page(
        'Grandmother',
        'Your sister understands how important family is, but you? You are just a lost cause. How could you go behind our back and abandon us?',
      ),
      page('', 'Your parents rush into the living room after hearing the shouting.'),
      page('Father', 'Calm down, Teddy! Stop yelling at your grandmother!'),
      page('Mother', 'Cannot we just talk about this calmly? We are a family after all!'),
      page(
        'Grandmother',
        'Family should not treat each other like this. If he wants to abandon us, then he can. Until then, I do not want to see your face again.',
      ),
      page('', 'Grandmother storms off. Teddy turns to you and your parents.'),
      page(
        'Teddy',
        'Why cannot you guys just defend me? Stop being her lap dog and do something for once.',
      ),
      page(
        '',
        'Before anyone can answer, Teddy grabs his luggage and leaves. You feel guilty about freezing.',
      ),
    ],
  },
  {
    id: 'teddy-calls-grandma-controlling',
    suit: 'diamonds',
    scoreRange: [240, 279],
    sceneCharacters: [character('t', 'angry')],
    pages: [
      page(
        '',
        'Teddy calls you out of the blue on a Saturday afternoon. He usually prefers texting, but after some small talk he finally gets to the point.',
      ),
      page(
        'Teddy',
        'Hey... have you talked to grandma recently? Mom and dad have been pestering me about calling her and apologizing ever since I left, but it has gotten way more frequent now.',
      ),
      page(
        'Teddy',
        'Sorry for bringing this up. I know you are close to her and she likes you a lot, so I wanted to see if you know a little more about what is going on.',
      ),
      page(
        '',
        "You tell him that you do not know what is going on in your grandmother's mind and that nobody has brought him up around you.",
      ),
      page(
        'Teddy',
        'Yeah, I figured. She is just crazy, and I would not be surprised if she has been losing it with you now that I am out of the house.',
      ),
      page(
        '',
        'You tell him he should not talk about her that way and that she probably just wants to make amends before it is too late.',
      ),
      page(
        'Teddy',
        'Ugh, you just do not get it. I have been talking to other people about her, and they have been telling me she is seriously controlling. Do you even remember how she tried to keep you inside the house? She told you to give up your dream job, and you did!',
      ),
      page(
        '',
        'The two of you start shouting at each other over who is really selfish: Teddy or your grandmother. The call ends when he hangs up. Neither of you reaches out for months.',
      ),
    ],
  },
  {
    id: 'cleaning-day-grandmothers-desk',
    suit: 'clubs',
    scoreRange: [0, 39],
    sceneCharacters: [character('m', 'happy'), character('g', 'sad')],
    pages: [
      page(
        'Mother',
        'Glad to see you again! I cannot believe it has been half a year since you came to visit. You only live forty minutes away. Come back more often!',
      ),
      page('', 'She pulls you into a warm embrace as you enter your childhood home.'),
      page(
        'Mother',
        'Sorry to ask you for help with cleaning. There is some furniture that is too heavy for me to move without your dad. I swear he picked now to visit his family just to skip spring cleaning.',
      ),
      page(
        '',
        'You spend some time rearranging the living room and chatting about current family updates and work drama.',
      ),
      page(
        'Mother',
        'This is looking really good now! I am so glad you live near us and can help us out. I will take out the trash and recycling. Could you start vacuuming upstairs? Grandma is out on a walk right now, so do not worry about the noise.',
      ),
      page(
        '',
        "You pass Teddy's untouched room and take a picture in case he wants anything from it.",
      ),
      page(
        '',
        "When you reach your grandmother's room, you hesitate. She always kept the door shut.",
      ),
      page(
        '',
        'Inside, everything is straight, neat, and severe. Then you notice a large stack of papers, photos, and scraps of notebook paper on her desk.',
      ),
      page(
        '',
        'There is a notebook opened to a date from around twenty years ago, but the ink glistens under the afternoon sunlight as if it were recent.',
      ),
    ],
  },
  {
    id: 'grandmother-secretive-about-room',
    suit: 'clubs',
    scoreRange: [40, 79],
    sceneCharacters: [
      character('g', 'happy'),
      character('m', 'sad'),
      character('d', 'happy'),
    ],
    pages: [
      page(
        'Grandmother',
        'I am so glad that you are here more often now! Your parents are starting to age as well, so they need your help more than ever.',
      ),
      page(
        'Father',
        'You are here so early! We did not prepare for you until the afternoon. Let us grab lunch together before we start packing boxes.',
      ),
      page(
        'Grandmother',
        'Oh, how delightful! I cannot seem to get ahold of my grandchildren. They are working too much these days and I am afraid I do not have enough time left to spend with them.',
      ),
      page(
        'Mother',
        'Do not go saying that. I am sure Alex is coming back as often as she can. Come on, let us talk over lunch.',
      ),
      page('', 'Everyone heads to the garage, but your grandmother suddenly stops.'),
      page('Grandmother', 'I forgot my bag. I will go back and grab it.'),
      page(
        'Mother',
        'Let your grandchild help you. Going up the stairs is getting hard on your knees.',
      ),
      page(
        'Grandmother',
        'That is all right. My bag is in my room, and it is a mess up there right now. I am not sure she could find it even if I told her exactly where it is!',
      ),
      page(
        'Mother',
        'Really? I could have sworn you were complaining about living upstairs just yesterday. Alex, go help your grandmother.',
      ),
      page(
        '',
        'You start to rise, but your grandmother quickly pushes you back down with surprising strength and insists on getting the bag herself.',
      ),
    ],
  },
  {
    id: 'alex-finds-hidden-letters',
    suit: 'clubs',
    scoreRange: [80, 119],
    sceneCharacters: [character('g', 'sad')],
    pages: [
      page(
        '',
        'Your parents take your grandmother on a weekend trip. Your mother calls and asks you to stay at the house for the gutter cleaning service she forgot to reschedule.',
      ),
      page(
        '',
        'After speaking to the workers, you go inside to avoid awkward small talk.',
      ),
      page(
        '',
        "You think back to the papers in your grandmother's room and decide to look again.",
      ),
      page(
        '',
        'A folder sticks out from one drawer. Inside are dozens more, most labeled with financial topics.',
      ),
      page('', 'Then you notice one with your own name on it.'),
      page('', 'Your hands shake as you open it. Three envelopes fall out.'),
      page('', '"University Admission Notice."'),
      page('', '"Offer for a company across the country."'),
      page('', '"Soccer Scholarship Offer."'),
      page(
        '',
        'Before you can process any of it, the cleaning service knocks on the door and you scramble to shove everything back into the folder.',
      ),
    ],
  },
  {
    id: 'mother-defends-grandmother-over-lunch',
    suit: 'spades',
    scoreRange: [160, 199],
    sceneCharacters: [character('m', 'sad')],
    pages: [
      page(
        'Mother',
        'I did not think you would have time to meet for lunch on a workday, but I am glad you got your lunch extended today!',
      ),
      page(
        '',
        'You vent about your demanding boss and lazy coworkers, but your mother struggles to empathize.',
      ),
      page(
        'Mother',
        'Life will always have its rough patches, but you just have to hold out. These busy seasons will pass before you know it.',
      ),
      page(
        '',
        'Frustrated, you ask why she never fights back, or encourages you to fight back.',
      ),
      page(
        'Mother',
        'We were brought up in different conditions. Where your grandmother and I are from, we are taught to work toward a collective goal, though I know it is different here.',
      ),
      page(
        'Mother',
        'I do not want you to be entirely like me or your grandmother, but thinking about the larger picture is just as important as your individual goals and success. I am not trying to undermine your stress.',
      ),
      page(
        '',
        'You say your grandmother is not passive at all and bring up times when she made major family decisions for selfish reasons.',
      ),
      page(
        'Mother',
        'You know she does that with our family at the forefront of her mind, right? You might think differently because you do not have children yet, but when you do, you will want to direct them in the right direction.',
      ),
      page(
        'Mother',
        'You do not need to agree with her on everything, but you need to understand that everything she has done is for her family.',
      ),
      page('', 'Arguing about your grandmother starts to feel useless.'),
    ],
  },
  {
    id: 'teddy-call-keep-track-of-documents',
    suit: 'clubs',
    scoreRange: [120, 159],
    sceneCharacters: [character('t', 'sad')],
    pages: [
      page(
        '',
        'Teddy calls you on a lazy Sunday. It is the first time he has called since your argument.',
      ),
      page(
        '',
        'You update him about your life, your promotion, and the two dogs you adopted from the shelter. He says he would love to meet them.',
      ),
      page(
        'Teddy',
        'I have always wanted dogs, and I am pretty sure mom did too at one point, but grandmother was always so adamantly against it. She always has something to say.',
      ),
      page('', 'When he brings up grandmother, you tell him what you found in her room.'),
      page(
        'Teddy',
        'Seriously? You were able to get into her room? I mean, no wonder she keeps everything locked up at all times.',
      ),
      page(
        'Teddy',
        'I am so sorry, Alex. I cannot believe she could do something like that, or that she would hold onto them for so long. Were you able to see what else she was hiding in there? It has got to be something on par with what you just told me.',
      ),
      page(
        '',
        'You tell him you were too shocked to take pictures and that your parents would never believe you over grandmother anyway.',
      ),
      page(
        'Teddy',
        'Wait, you did not confront her at all? I would have lost my temper. You would probably have to arrest me for what I would do to her if I saw that.',
      ),
      page(
        '',
        "The two of you start planning how to get back into grandmother's room and take photos next time.",
      ),
    ],
  },
  {
    id: 'alex-caught-snooping',
    suit: 'clubs',
    scoreRange: [160, 199],
    sceneCharacters: [character('g', 'angry')],
    pages: [
      page(
        '',
        "With Teddy's plan in mind, you buy your parents and grandparents tickets for a tourist destination across the country.",
      ),
      page(
        '',
        'Your grandmother declines and stays behind, saying travel is too hard on her at this age.',
      ),
      page(
        '',
        'You use work and a lack of PTO as an excuse not to go either, then offer to help her with chores that weekend.',
      ),
      page(
        'Grandmother',
        'I am glad that the two of us can spend some one-on-one time. I feel like we have been drifting apart. Oh... I just wish I knew how to work my smartphone, but I think I am a bit too old to learn now.',
      ),
      page(
        '',
        'You offer to take her to the library for a technology-literacy class for seniors. She agrees, and you drop her off.',
      ),
      page(
        '',
        'The moment she is inside, you rush back home. You know you have less than thirty minutes to find concrete evidence.',
      ),
      page('', 'You dig through her drawers and start snapping quick photos of the files.'),
      page(
        '',
        'Halfway through the pile, you hear steady footsteps. You shove everything back into the drawer as fast as you can.',
      ),
      page(
        'Grandmother',
        'What are you meandering around in my room for? Are you looking for something?',
      ),
      page(
        '',
        'You open your mouth, but no words come out. Your body locks up. All you can think is: why is she back already?',
      ),
    ],
  },
  {
    id: 'grandmother-false-theft-accusation',
    suit: 'diamonds',
    scoreRange: [280, 319],
    sceneCharacters: [character('m', 'angry'), character('g', 'angry')],
    pages: [
      page('', 'A few days later, your mother calls after returning from the vacation you paid for.'),
      page(
        'Mother',
        'Hey, Alex, your father and I really wanted to thank you for the vacation. We had a pretty good break. Uh... I am not sure how to say this.',
      ),
      page(
        'Mother',
        'Are you behind on your bills? You know we can help you, right? We are family. You do not need to hide this from us.',
      ),
      page(
        '',
        'Caught off guard, you ask why she thinks you need financial help and remind her you paid for their trip yourself.',
      ),
      page(
        'Mother',
        'I know you are responsible with your finances, but grandmother saw you taking something from her drawers. She told us that you took her remaining cash.',
      ),
      page(
        '',
        'You deny it over and over, more heated each time, saying you would never rob your family and that grandmother must be making it up.',
      ),
      page(
        'Mother',
        'Do not speak of your grandmother like that. She was just worried about you, but you always have to take it too far, do you not? You used to be better than this.',
      ),
      page('', 'She hangs up. You have no idea whether she believes you.'),
    ],
  },
  {
    id: 'parents-side-with-grandmother-at-cafe',
    suit: 'diamonds',
    scoreRange: [320, 359],
    sceneCharacters: [character('d', 'angry'), character('m', 'angry')],
    pages: [
      page('', 'A week later, you meet your parents at a local café after trying to cool down.'),
      page(
        'Father',
        'You need to apologize to your grandmother. She is only worried about you, and you know she cares about you above all else.',
      ),
      page(
        'Mother',
        'She has even offered to help you out! We can help you too. You can move back in whenever you need to. Grandma suggested that!',
      ),
      page('', 'You stare at them, stunned that they still do not believe you.'),
      page(
        '',
        "You tell them this is all part of grandmother's plan to pull you back into the house, and that your job pays more than enough for you to live on your own.",
      ),
      page(
        'Mother',
        'You are just like your brother, never considering how others feel. Think about how sad grandma would feel if she heard that! Do you know just how much she has had to sacrifice to get you where you are?',
      ),
      page(
        'Father',
        'If you are not willing to listen, or even take a helping hand from your family, then we will just head out now. You can resolve your issues on your own until you are ready to apologize.',
      ),
      page(
        '',
        'They seem more offended that you were disrespectful to grandmother than concerned about the accusation or the supposed financial crisis.',
      ),
    ],
  },
  {
    id: 'alex-studies-the-documents-alone',
    suit: 'spades',
    scoreRange: [200, 239],
    sceneCharacters: [character('g', 'sad')],
    pages: [
      page(
        '',
        'The next few months are painfully quiet. Neither you nor your parents wants to reach out first.',
      ),
      page(
        '',
        "With your weekends suddenly empty, you begin reviewing every photo you took from grandmother's drawers.",
      ),
      page(
        '',
        'Most of the files are loan invoices in your parents’ names. There are also unopened envelopes addressed to you, including university and job offers from far away.',
      ),
      page('', 'You print the photos and pin them to your walls so you can study them side by side.'),
      page(
        '',
        'As you annotate each page, you think back to every conversation about loans, bills, and purchases your parents should not have been able to afford.',
      ),
      page(
        '',
        'They were always worried about missing payments until just a few years ago, when they finally finished paying everything off and started saving for retirement.',
      ),
      page(
        '',
        'The loans came from third-party firms with brutally high interest rates. Your parents had to repay far more than they borrowed.',
      ),
      page(
        '',
        "Some loans were under your mother's name, some under your father's. Some were nearly identical in date and amount.",
      ),
      page(
        '',
        'One document details the overseas property your grandmother insisted on buying back. After researching the area, you learn it is little more than an empty dirt plot.',
      ),
      page(
        '',
        'Then you notice something worse: your grandmother shared a joint bank account with both of your parents. They may never have had a chance to become financially stable.',
      ),
    ],
  },
  {
    id: 'siblings-plan-to-expose-grandmother',
    suit: 'clubs',
    scoreRange: [200, 239],
    sceneCharacters: [character('t', 'angry')],
    pages: [
      page('', 'You call Teddy and share the file of evidence while your notes lie open beside you.'),
      page('Teddy', 'Did not expect you to call me all of a sudden! What is up?'),
      page('', "You explain how you snuck into grandmother's room and what you found there."),
      page(
        'Teddy',
        'Seriously? You are absolutely crazy for doing that. What kind of dirt were you able to find on her?',
      ),
      page(
        '',
        "You tell him about the unnecessary loans in your parents' names, your dream-school admission letter, and the soccer scholarship offers grandmother hid.",
      ),
      page('', 'He goes silent for a moment.'),
      page(
        'Teddy',
        'So are you going to tell mom and dad? Do they even know about half of these loans? We were always trying to cut corners while grandma sat there drowning us in debt. We could have had a normal middle-class family life, but no, she just had to have that stupid dirt land and whatever else she bought with those loans.',
      ),
      page(
        '',
        'You admit that you do not know how to approach your parents now that you have barely spoken to them.',
      ),
      page(
        'Teddy',
        'Oh... so they stopped listening to you too, huh? You attack grandma and suddenly they come after you. They are just her lap dogs.',
      ),
      page(
        'Teddy',
        'Is it not weird that she held onto all of this? It is almost like she wanted it to be found. Do you think you can figure out why she kept it after all these years?',
      ),
      page('', 'The challenge feels impossible, but impossible things have started to feel unavoidable.'),
    ],
  },
  {
    id: 'alex-confronts-grandmother',
    suit: 'diamonds',
    scoreRange: [360, 399],
    sceneCharacters: [character('g', 'angry')],
    pages: [
      page(
        'Grandmother',
        'Oh my, Alex, I was worried sick about you! Your parents say you have not called them in so long. You do not know how relieved I was when you texted me to meet you!',
      ),
      page(
        '',
        'You skip the pleasantries and lay out a folder full of photos from the files she hid in her bedroom. Her face shifts from worry to silent rage.',
      ),
      page(
        'Grandmother',
        'What are you doing? You said you were here to apologize to me.',
      ),
      page(
        '',
        'You demand to know why she kept those documents from you, especially the university and job offers.',
      ),
      page(
        'Grandmother',
        'You have no idea what you are talking about. This was for your own good. Did you really think you could make the right decision as a teenager? You were selfish, thinking about short-term results, but I led you the right way.',
      ),
      page(
        'Grandmother',
        'Your parents wanted me to take out those loans. I offered to help them, but they insisted they would pay for it themselves. I hid this from you because you were just a child then. I held onto these burdens so that you would not have to worry about them.',
      ),
      page(
        '',
        'You fire back that she destroyed your autonomy and stole your right to choose. You tell her she is the selfish one.',
      ),
      page(
        'Grandmother',
        'That is enough. If you want to act this childish over events that happened over a decade ago, then go be miserable by yourself. If you want to be independent so badly, then I will leave you alone for the rest of your life.',
      ),
      page(
        '',
        'She storms off, leaving you alone with the crumpled pages. The confrontation gives you no catharsis at all.',
      ),
    ],
  },
  {
    id: 'mother-rejects-the-evidence',
    suit: 'diamonds',
    scoreRange: [400, 439],
    sceneCharacters: [character('m', 'angry'), character('g', 'angry')],
    pages: [
      page('', 'A few hours later, your mother calls.'),
      page(
        'Mother',
        'You said you would apologize to your grandmother, so explain to me why she came back crying and telling your father and me that you wanted to leave this family.',
      ),
      page('', 'You carefully explain what happened, step by step.'),
      page(
        'Mother',
        'What are you even talking about? My mother would never do such a thing. You must have seen it incorrectly. No way she would do something like that.',
      ),
      page(
        '',
        'You tell her to check the room and the drawers for herself. You hear movement on the other end of the line.',
      ),
      page(
        'Mother',
        'There are no files in these drawers. I see a journal and some travel brochures, but no folders. If you want to make up a lie, at least try to make it more convincing.',
      ),
      page(
        '',
        'She hangs up. Grandmother must have destroyed or moved the evidence already.',
      ),
      page(
        '',
        'You send the photos from your phone to your mother anyway, hoping that this time she will believe you.',
      ),
    ],
  },
  {
    id: 'teddy-brings-loan-shark-proof',
    suit: 'clubs',
    scoreRange: [240, 279],
    sceneCharacters: [character('t', 'angry')],
    pages: [
      page(
        '',
        'You call Teddy and tell him how grandmother threatened to cut you off from your parents for disobeying her.',
      ),
      page(
        'Teddy',
        "Hey, so remember those loans she took out? I got a job with those loan sharks to dig up more information. They had files and meeting notes about grandma's transactions.",
      ),
      page(
        '',
        'You bite your tongue to stop yourself from lecturing him for taking such a suspicious job.',
      ),
      page(
        'Teddy',
        'If I come with you, I think we can expose grandma pretty well. I will grab those files and fly in next weekend.',
      ),
      page(
        '',
        'For the first time in a while, you feel a little steadier. Teddy may have finally found proof strong enough to crack the façade.',
      ),
    ],
  },
  {
    id: 'night-walk-blackout',
    suit: 'clubs',
    scoreRange: [280, 319],
    sceneCharacters: [],
    pages: [
      page(
        '',
        'It is past your usual bedtime, but you need to clear your head before confronting your parents tomorrow.',
      ),
      page(
        '',
        'You head out for a quiet nighttime walk with only your apartment keys in your pocket.',
      ),
      page(
        '',
        'The cool air helps at first. The streets are quiet. A few people are walking their dogs.',
      ),
      page('', 'You round the final block and start toward home.'),
      page('', 'BANG.'),
      page('', 'Your head hurts.'),
      page('', 'The world suddenly bleeds black.'),
    ],
  },
]
