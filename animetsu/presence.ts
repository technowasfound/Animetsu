const presence = new Presence({
  clientId: 'YOUR_DISCORD_APPLICATION_CLIENT_ID',
}) as any

function getFirstEpisodeUrl(url: string): string {
  if (/episode-\d+/i.test(url)) {
    return url.replace(/episode-\d+/i, 'episode-1')
  }
  return url.replace(/-\d+(\/?)$/, '-1$1')
}

presence.on('update', () => {
  const data: any = {
    largeImageKey: 'animetsu_logo',
    largeImageText: 'Animetsu.net',
    buttons: [],
  }

  const currentUrl = window.location.href
  const pathname = window.location.pathname

  const titleElement = document.querySelector('h1.entry-title') || document.querySelector('.anime-title') || document.querySelector('.entry-title')
  const episodeElement = document.querySelector('.episode-number') || document.querySelector('.ep-active') || document.querySelector('.ep-num')

  if (pathname === '/' || pathname === '') {
    data.details = 'Browsing Homepage'
    data.state = 'Looking for something to watch'
    data.buttons = [
      { label: 'Visit Website', url: 'https://animetsu.net' },
    ]
  }
  else if (pathname.includes('/search') || window.location.search.includes('s=')) {
    data.details = 'Searching for Anime'
    data.state = 'Exploring the catalog'
    data.buttons = [
      { label: 'Visit Website', url: 'https://animetsu.net' },
    ]
  }
  else if (titleElement) {
    const animeTitle = titleElement.textContent.trim()
    data.details = animeTitle

    let currentEp = '1'
    if (episodeElement) {
      currentEp = episodeElement.textContent.trim().replace(/\D/g, '')
      data.state = `Watching Episode ${currentEp}`
    }
    else {
      data.state = 'Viewing Anime Details'
    }

    const firstEpisodeUrl = getFirstEpisodeUrl(currentUrl)

    data.buttons = [
      { label: `Watch Ep ${currentEp}`, url: currentUrl },
      { label: 'Watch Anime', url: firstEpisodeUrl },
    ]

    const video = document.querySelector('video')
    if (video) {
      if (!video.paused) {
        const currentTime = Math.floor(video.currentTime)
        const duration = Math.floor(video.duration)

        if (!Number.isNaN(currentTime) && !Number.isNaN(duration)) {
          data.startTimestamp = Math.floor((Date.now() - currentTime * 1000) / 1000)
          data.endTimestamp = Math.floor((Date.now() + (duration - currentTime) * 1000) / 1000)
        }
      }
      else {
        data.state = `Paused - ${data.state}`
      }
    }
  }
  else {
    data.details = 'Exploring the site'
    data.state = 'Browsing pages'
    data.buttons = [
      { label: 'Visit Website', url: 'https://animetsu.net' },
    ]
  }

  presence.setActivity(data)
})
