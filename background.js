/* global chrome URL */

'use strict'

chrome.tabs.onUpdated.addListener(function (tabId, changInfo, tab) {
  showIcon(tab)
})

chrome.pageAction.onClicked.addListener(function (tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.create({
      index: ++tabs[0].index,
      url: transform(tab.url)
    })
  })
})

function showIcon (tab) {
  var hostname = parseUrl(tab.url).hostname
  if (hostname === 'github.com' || hostname.endsWith('github.io')) {
    chrome.pageAction.show(tab.id)
  }
}

function parseUrl (urlStr) {
  return new URL(urlStr)
}

function transform (urlStr) {
  var urlObj = parseUrl(urlStr)
  var hostname = urlObj.hostname
  var parts = urlObj.pathname.split('/')
  parts.shift()
  var href
  if (hostname === 'github.com') {
    href = 'https://' + parts[0] + '.github.io/' + parts[1]
  } else {
    href = 'https://github.com/' + hostname.split('.')[0] + '/' + parts[0]
  }
  return href
}
