export interface Archetype {
  name: 'Warrior' | 'Stoic' | 'Strategist' | 'Shadow'
  motto: string
  image: string
  coreValues: string[]
  coreRituals: string[]
}

export const archetypes: Archetype[] = [
  {
    name: 'Warrior',
    motto: 'I will move through resistance\nlike fire through a fog.',
    image: '/character-images/white-male/warrior.jpg',
    coreValues: ['Courage', 'Discipline'],
    coreRituals: ['Early Rise', 'Cold Plunge']
  },
  {
    name: 'Stoic',
    motto: 'I will act without craving.\nI will move without flinch.',
    image: '/character-images/white-male/stoic.jpg',
    coreValues: ['Secrecy', 'Devotion'],
    coreRituals: ['Early Rise', 'Meditation']
  },
  {
    name: 'Strategist',
    motto: 'I will observe what others miss.\nI will move when others stall.',
    image: '/character-images/white-male/strategist.jpg',
    coreValues: ['Foresight', 'Precision'],
    coreRituals: ['Planning', 'Contemplation']
  },
  {
    name: 'Shadow',
    motto: 'I will disappear to evolve.\nI will return unrecognizable.',
    image: '/character-images/white-male/shadow.jpg',
    coreValues: ['Stealth', 'Patience'],
    coreRituals: ['Night Walk', 'Stillness']
  }
]

// Finds an archetype definition by name
export const getArchetype = (name: Archetype['name']): Archetype =>
  archetypes.find(archetype => archetype.name === name)!
