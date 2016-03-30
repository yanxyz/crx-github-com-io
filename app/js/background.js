'use strict'

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: 'github.com',
              schemes: ['https']
            },
            css: ['.pagehead-actions']
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostSuffix: 'github.io'
            }
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ])
  })
})

chrome.pageAction.onClicked.addListener((tab) => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.create({
      index: ++tabs[0].index,
      url: transform(tab.url)
    })
  })
})

function parseUrl (urlStr) {
  return new URL(urlStr)
}

function transform (urlStr) {
  const urlObj = parseUrl(urlStr)
  const hostname = urlObj.hostname
  const parts = urlObj.pathname.split('/')
  parts.shift()

  let href
  if (hostname === 'github.com') {
    href = 'https://' + parts[0] + '.github.io/' + parts[1]
  } else {
    href = 'https://github.com/' + hostname.split('.')[0] + '/' + parts[0]
  }
  return href
}
