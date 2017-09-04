import { getIdFromURL, getTimeFromURL } from './utils'
import container from './container'
import YouTubePlayer from './player'

export { YouTubePlayer, getIdFromURL, getTimeFromURL }

export default function install (Vue, options = { global: true }) {
  container.Vue = Vue
  YouTubePlayer.ready = YouTubePlayer.mounted
  if (options.global) {
    Vue.component('youtube', YouTubePlayer)
  }
  Vue.prototype.$youtube = { getIdFromURL, getTimeFromURL }

  const firstScriptTag = document.getElementsByTagName('script')[0]
  const existingTag = document.querySelector("[src='https://www.youtube.com/player_api']")
  if (!firstScriptTag.parentNode.contains(existingTag)) {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/player_api'
    tag.async = true
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
  } else if (window.YT) {
    container.YT = window.YT
    const { PlayerState } = window.YT

    container.events[PlayerState.ENDED] = 'ended'
    container.events[PlayerState.PLAYING] = 'playing'
    container.events[PlayerState.PAUSED] = 'paused'
    container.events[PlayerState.BUFFERING] = 'buffering'
    container.events[PlayerState.CUED] = 'cued'

    Vue.nextTick(() => {
      container.run()
    })
  }

  window.onYouTubeIframeAPIReady = function () {
    container.YT = YT
    const { PlayerState } = YT

    container.events[PlayerState.ENDED] = 'ended'
    container.events[PlayerState.PLAYING] = 'playing'
    container.events[PlayerState.PAUSED] = 'paused'
    container.events[PlayerState.BUFFERING] = 'buffering'
    container.events[PlayerState.CUED] = 'cued'

    Vue.nextTick(() => {
      container.run()
    })
  }
}
