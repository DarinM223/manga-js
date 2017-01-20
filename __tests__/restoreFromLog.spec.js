/* global test, expect */

import { restoreFromLog } from '../client/restoreFromLog.js'
import { NOT_LOADED, LOADED } from '../utils/constants.js'
import Immutable from 'immutable'

test('restoreFromLog', () => {
  const state = Immutable.fromJS({
    manga: {
      'a': {
        'chapters': [
          { loadState: LOADED },
          { loadState: LOADED },
          { loadState: LOADED }
        ]
      },
      'b': {
        'chapters': [
          { loadState: LOADED },
          { loadState: LOADED },
          { loadState: LOADED }
        ]
      },
      'c': { 'chapters': [{ loadState: LOADED }] }
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
  })

  const expectedManga = {
    'a': {
      'chapters': [
        { loadState: NOT_LOADED },
        { loadState: LOADED },
        { loadState: NOT_LOADED }
      ]
    },
    'b': {
      'chapters': [
        { loadState: LOADED },
        { loadState: NOT_LOADED },
        { loadState: LOADED }
      ]
    },
    'c': { 'chapters': [{ loadState: LOADED }] }
  }

  const [newManga, newLog] = restoreFromLog(state.get('manga'), state.get('log'))

  expect(newManga.toJS()).toEqual(expectedManga)
  expect(newLog.toJS()).toEqual({})
})
