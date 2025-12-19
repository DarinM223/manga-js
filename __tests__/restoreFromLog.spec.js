import { test, expect } from 'vitest'
import { restoreFromLog } from '../src/renderer/restoreFromLog.ts'
import { LoadStateType } from '../utils/constants.ts'

test('restoreFromLog', () => {
  const state = {
    manga: {
      'a': {
        'chapters': [
          { loadState: LoadStateType.LOADED },
          { loadState: LoadStateType.LOADED },
          { loadState: LoadStateType.LOADED }
        ]
      },
      'b': {
        'chapters': [
          { loadState: LoadStateType.LOADED },
          { loadState: LoadStateType.LOADED },
          { loadState: LoadStateType.LOADED }
        ]
      },
      'c': { 'chapters': [{ loadState: LoadStateType.LOADED }] }
    },
    log: {
      'a': {
        '0': true,
        '2': true
      },
      'b': {
        '1': true
      }
    }
  }

  const expectedManga = {
    'a': {
      'chapters': [
        { loadState: LoadStateType.NOT_LOADED },
        { loadState: LoadStateType.LOADED },
        { loadState: LoadStateType.NOT_LOADED }
      ]
    },
    'b': {
      'chapters': [
        { loadState: LoadStateType.LOADED },
        { loadState: LoadStateType.NOT_LOADED },
        { loadState: LoadStateType.LOADED }
      ]
    },
    'c': { 'chapters': [{ loadState: LoadStateType.LOADED }] }
  }

  const [newManga, newLog] = restoreFromLog(state.manga, state.log)

  expect(newManga).toEqual(expectedManga)
  expect(newLog).toEqual({})
})
