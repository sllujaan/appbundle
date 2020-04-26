


document.addEventListener('click', (event) => {
    if(event.target.classList.contains("btn")) {
        var id = event.target.id
        window.location = `../typingTest-typing-modules/typingTest-typing.html?test=${id}`
    }
})