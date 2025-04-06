export function setDynamicFavicon(letter: string, bgColor = '#4f46e5', color = '#ffffff') {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64

    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.font = 'bold 40px sans-serif'
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(letter, canvas.width / 2, canvas.height / 2)

    const link: HTMLLinkElement =
        document.querySelector("link[rel*='icon']") || document.createElement('link')
    link.type = 'image/png'
    link.rel = 'icon'
    link.href = canvas.toDataURL('image/png')
    document.head.appendChild(link)
}
