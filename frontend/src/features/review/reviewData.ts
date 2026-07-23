import type { Instrument, PianoNote } from './types'

export const instruments: Instrument[] = [
  { name: 'Acoustic piano', className: 'instrument-piano' },
  { name: 'Electric guitar', className: 'instrument-guitar' },
  { name: 'Bass', className: 'instrument-bass' },
  { name: 'Drums', className: 'instrument-drums' },
  { name: 'Strings', className: 'instrument-strings' },
]

export const pianoNotes: PianoNote[] = [
  { left: 4, top: 14, width: 4, instrument: 'piano' },
  { left: 10, top: 11, width: 5, instrument: 'piano' },
  { left: 17, top: 17, width: 3, instrument: 'piano' },
  { left: 22, top: 9, width: 6, instrument: 'piano' },
  { left: 31, top: 14, width: 5, instrument: 'piano' },
  { left: 39, top: 8, width: 7, instrument: 'piano' },
  { left: 49, top: 16, width: 5, instrument: 'piano' },
  { left: 57, top: 12, width: 4, instrument: 'piano' },
  { left: 65, top: 7, width: 8, instrument: 'piano' },
  { left: 77, top: 13, width: 5, instrument: 'piano' },
  { left: 85, top: 8, width: 7, instrument: 'piano' },

  { left: 5, top: 33, width: 7, instrument: 'guitar' },
  { left: 15, top: 29, width: 4, instrument: 'guitar' },
  { left: 22, top: 36, width: 8, instrument: 'guitar' },
  { left: 34, top: 31, width: 5, instrument: 'guitar' },
  { left: 42, top: 27, width: 6, instrument: 'guitar' },
  { left: 53, top: 34, width: 7, instrument: 'guitar' },
  { left: 64, top: 29, width: 5, instrument: 'guitar' },
  { left: 73, top: 35, width: 8, instrument: 'guitar' },
  { left: 84, top: 30, width: 6, instrument: 'guitar' },

  { left: 3, top: 53, width: 12, instrument: 'bass' },
  { left: 18, top: 50, width: 8, instrument: 'bass' },
  { left: 29, top: 55, width: 13, instrument: 'bass' },
  { left: 46, top: 49, width: 11, instrument: 'bass' },
  { left: 61, top: 54, width: 13, instrument: 'bass' },
  { left: 78, top: 50, width: 12, instrument: 'bass' },

  { left: 7, top: 68, width: 3, instrument: 'drums' },
  { left: 13, top: 72, width: 2, instrument: 'drums' },
  { left: 20, top: 65, width: 3, instrument: 'drums' },
  { left: 28, top: 70, width: 2, instrument: 'drums' },
  { left: 35, top: 66, width: 3, instrument: 'drums' },
  { left: 43, top: 72, width: 2, instrument: 'drums' },
  { left: 51, top: 65, width: 3, instrument: 'drums' },
  { left: 59, top: 70, width: 2, instrument: 'drums' },
  { left: 67, top: 66, width: 3, instrument: 'drums' },
  { left: 75, top: 72, width: 2, instrument: 'drums' },
  { left: 83, top: 65, width: 3, instrument: 'drums' },

  { left: 4, top: 84, width: 15, instrument: 'strings' },
  { left: 23, top: 81, width: 17, instrument: 'strings' },
  { left: 44, top: 85, width: 14, instrument: 'strings' },
  { left: 62, top: 80, width: 16, instrument: 'strings' },
  { left: 82, top: 84, width: 12, instrument: 'strings' },
]
