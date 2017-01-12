/* global test, expect, jest */

import { BulkSender } from '../utils/process.js'

jest.useFakeTimers()

test('Bulk sender', () => {
  let bulkMessage = null
  const sender = new BulkSender((msg) => { bulkMessage = msg })

  sender.add({
    mangaName: 'onepunch-man',
    chapterNum: 0,
    url: 'a',
    total: 20,
    curr: 3
  })
  sender.add({
    mangaName: 'onepunch-man',
    chapterNum: 0,
    url: 'a',
    total: 20,
    curr: 1
  })
  sender.add({
    mangaName: 'onepunch-man',
    chapterNum: 1,
    url: 'b',
    total: 9,
    curr: 0
  })
  sender.add({
    mangaName: 'onepunch-man',
    chapterNum: 1,
    url: 'b',
    total: 9,
    curr: 8
  })

  const expectedBulkMessage = [
    {
      mangaName: 'onepunch-man',
      chapterNum: 0,
      total: 20,
      curr: 3
    },
    {
      mangaName: 'onepunch-man',
      chapterNum: 1,
      total: 9,
      curr: 8
    }
  ]

  jest.runOnlyPendingTimers()

  expect(bulkMessage).toEqual(expectedBulkMessage)
})
