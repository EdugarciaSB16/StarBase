const game = new Game('canvas')

window.onload = () => {
    document.addEventListener('keypress', () => {
        game.start()
    })

    document.addEventListener('keydown', (event) => {
        game.onKeyEvent(event)
    })

    document.addEventListener('keyup', (event) => {
        game.onKeyEvent(event)
    })

};
