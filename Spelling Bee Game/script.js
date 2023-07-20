const lettersButtons = document.getElementById("lettersButtons")
const inputTextDiv = document.getElementById("input")
const gameStartButton = document.getElementById("gameStartButton")
const textAreaDiv = document.getElementById("textAreaDiv")
const erorMessagesDiv = document.getElementById("erorMessages")

const beforeStartDiv = document.getElementById("beforeStart")

const totalScoreDiv = document.getElementById("totalScore")

const threeButtonsDiv = document.getElementById("threeButtonsDiv")

const quitButtonDiv = document.getElementById("quitButtonDiv")

const loadingAnimation = document.getElementById('loading-animation');
loadingAnimation.style.display = 'none';



let inputText
let textArea
let userWordsFound = []

let pangramWords = []

let words = []

let pangramLetters = []

let wordFound = false
let wordCheck = false

let trueAnswers = []

let buttons = []

let middleLetterButton

let errorMessageText

let midLetter

let totalScore = 0

let deleteButton
let shuffleButton
let enterButton
let quitButton








let letters = ["a", "b", "c", "ç", "d", "e", "f", "g", "ğ", "h", "ı", "i", "j", "k", "l", "m", "n", "o", "ö", "p", "r", "s", "ş", "t", "u", "ü", "v", "y", "z",]

async function readFile() {
    return fetch('Kelimeler.txt')
        .then(response => response.text())
        .then(text => {
            const wordArray = text.split('\n')
            words.push(...wordArray);
        })
}

let shuffledLetters = shuffle(letters)

let choosedLetters = shuffledLetters.slice(0, 7)

gameStartButton.addEventListener("click", function () {
    loadingAnimation.style.display = '';
    gameStartButton.style.display = "none"


    readFile().then(() => {
        gameStart()
        wordCountCheck(pangramLetters, words)

    })

})






function gameStart() {
    while (wordFound == false) {
        console.log(choosedLetters)
        findPangramWords(words, choosedLetters)
        shuffledLetters = shuffle(letters)
        choosedLetters = shuffledLetters.slice(0, 7)

    }

}


function gameFinish(wordFoundNumber, wordNumber) {
    if (wordFoundNumber == wordNumber) {
        alert("Tebrikler Oyunu Bitirdiniz!!!")
        deleteButton.disabled = true
        shuffleButton.disabled = true
        enterButton.disabled = true
        for (let i = 0; i < 6; i++) {
            buttons[i].disabled = true
        }
        middleLetterButton.disabled = true
        inputText.disabled = true
    }
}




function shuffle(array) {
    let currentIndex = array.length, randomIndex


    while (currentIndex != 0) {


        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--


        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]]
    }

    return array
}







function deleteRepeatingLetter(word) {
    let simplifiedWord = ""
    for (let i = 0; i < word.length; i++) {
        if (simplifiedWord.indexOf(word[i]) === -1) {
            simplifiedWord += word[i]
        }
    }
    return simplifiedWord
}

function findPangramWords(words, letters) {
    let counter = 0
    pangramWords = []
    let simplifiedWord = ""
    for (let i = 0; i < words.length; i++) {
        for (let j = 0; j < words[i].length; j++) {
            simplifiedWord = deleteRepeatingLetter(words[i])
            if (letters.includes(simplifiedWord[j])) {
                counter++
            }
        }
        if (counter == simplifiedWord.length && counter >= 7) {
            pangramWords.push(words[i])
            pangramLetters = letters
            console.log(pangramLetters)
            console.log(pangramWords)
            wordFound = true
        }
        if (wordFound) {
            break
        }
        counter = 0
        simplifiedWord = ""
    }

}




let a = ["acefght", "abatfraa", "aaaaaaa", "acefghto", "aaaahaaaa"]
let b = ["t", "f", "g", "h", "e", "a", "c"]

// 20 - 80 arası kelime kontrolu
function wordCountCheck(letters, words) {
    let counter = 0
    midLetter = letters[3]
    let found = []
    for (let i = 0; i < words.length; i++) {
        for (let j = 0; j < words[i].length; j++) {
            for (let k = 0; k < letters.length; k++) {
                if (words[i][j].includes(letters[k])) {
                    counter++
                }
            }
        }
        if (counter == words[i].length && words[i].includes(midLetter) && words[i].length >= 4) {
            found.push(words[i])
        }
        counter = 0
    }
    if (found.length >= 20 && found.length <= 80) {
        loadingAnimation.style.display = 'none'
        wordCheck = true
        trueAnswers = found
        console.log(found)
        createButtons()
        createInputText()
        arrangeButtonsAroundCircle(buttons, 200, 200, 100, 200, 200)
        createTextArea()
        let errorMessage = ""
        createErrorMessageText(errorMessage)
        threeButtonsDiv.style.display = ""
        createThreeButtons()
        createQuitButton()
        totalScoreDiv.textContent = `Score : ${totalScore}`
        lettersButtons.style.backgroundColor = "#f0f0f0"
        beforeStartDiv.remove()


    }
    else {
        console.log("sağlamadı")
        console.log(found.length)
        wordFound = false
        gameStart()
        wordCountCheck(pangramLetters, words)
    }
}






function createButtons() {
    for (let i = 0; i < 7; i++) {
        let letterButton = document.createElement("button")
        letterButton.textContent = pangramLetters[i]
        letterButton.addEventListener("click", function () {
            lettersButtonsClick(letterButton)
        })
        lettersButtons.appendChild(letterButton)
        buttons.push(letterButton)
    }
    middleLetterButton = buttons[3]
}

function createErrorMessageText(errorMessage) {
    errorMessageText = document.createElement("h3")
    errorMessageText.textContent = errorMessage
    erorMessagesDiv.appendChild(errorMessageText)
}


function createInputText() {
    inputText = document.createElement("input")
    inputTextDiv.appendChild(inputText)
    inputText.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            enterButtonFunction()
        }
    })
}


function lettersButtonsClick(button) {
    inputText.value += button.textContent
}


function createTextArea() {
    textArea = document.createElement("textarea")
    textAreaDiv.appendChild(textArea)
}


function clearText() {
    errorMessageText.textContent = ""
}





function checkValue(word) {
    if (trueAnswers.includes(word) && !userWordsFound.includes(word)) {
        textArea.value += word + "\n"
        userWordsFound.push(word)
        errorMessageText.text = "good!"
        calculateScore(word)
    }
    else {
        let text = getErrorMessage(word)
        errorMessageText.textContent = text
        setTimeout(clearText, 2500)
    }

}

function getErrorMessage(word) {
    let text = ""
    if (word == "") {
        text = "empty text"
    }
    else if (word.length < 4) {
        text = "too short"
    }
    else if (!word.includes(midLetter)) {
        text = "missing center letter"
    }
    else if (!trueAnswers.includes(word)) {
        text = "not in word list"
    }
    else if (userWordsFound.includes(word)) {
        text = "already found"
    }
    return text
}

function calculateScore(word) {
    if (pangramWords.includes(word)) {
        totalScore += word.length - 3
        totalScore += 7
    }
    else {
        totalScore += word.length - 3
    }
    totalScoreDiv.textContent = `Score : ${totalScore}`
}



function createThreeButtons() {
    deleteButton = document.createElement("button")
    deleteButton.textContent = "Delete"
    deleteButton.classList.add("deleteButton")
    threeButtonsDiv.appendChild(deleteButton)
    deleteButton.addEventListener("click", function () {
        deleteLastLetter()
    })
    shuffleButton = document.createElement("button")
    shuffleButton.textContent = "Shuffle"
    threeButtonsDiv.appendChild(shuffleButton)
    shuffleButton.addEventListener("click", function () {
        shuffleButtonsFunction()
    })
    enterButton = document.createElement("button")
    enterButton.textContent = "Enter"
    threeButtonsDiv.appendChild(enterButton)
    enterButton.addEventListener("click", function () {
        enterButtonFunction()
    })
}



function createQuitButton() {
    quitButton = document.createElement("button")
    quitButton.textContent = "Quit"
    quitButton.classList.add("quit")
    quitButtonDiv.appendChild(quitButton)
    quitButton.addEventListener("click", function () {
        quitGame()
    })
}

function quitGame() {
    location.reload()
}

function deleteLastLetter() {
    inputText.value = inputText.value.slice(0, -1)
}


function shuffleButtonsFunction() {

    let arr = []
    for (let i = 0; i < 6; i++) {
        arr.push(buttons[i].textContent)
    }
    let shuffledArray = shuffle(arr)
    for (let i = 0; i < 6; i++) {
        buttons[i].textContent = shuffledArray[i]
    }


}



function enterButtonFunction() {
    let enteredWord = inputText.value
    let lowerCaseEnteredWord = enteredWord.toLowerCase()
    checkValue(lowerCaseEnteredWord)
    inputText.value = ""
    gameFinish(userWordsFound.length, words.length)
}









function arrangeButtonsAroundCircle(buttons, centerX, centerY, radius, containerCenterX, containerCenterY) {
    let centerButton = buttons[3]
    buttons.splice(3, 1)
    const totalButtons = buttons.length;
    const angleBetweenButtons = (2 * Math.PI) / totalButtons;
    const centerButtonX = containerCenterX - buttons[3].offsetWidth / 2;
    const centerButtonY = containerCenterY - buttons[3].offsetHeight / 2;

    for (let i = 0; i < totalButtons; i++) {
        const button = buttons[i];
        const angle = i * angleBetweenButtons;
        const buttonX = centerX + radius * Math.cos(angle);
        const buttonY = centerY + radius * Math.sin(angle);
        button.style.position = "absolute";
        button.style.left = (buttonX - button.offsetWidth / 2) + "px";
        button.style.top = (buttonY - button.offsetHeight / 2) + "px";
    }

    centerButton.style.position = "absolute";
    centerButton.style.left = centerButtonX + "px";
    centerButton.style.top = centerButtonY + "px";
    centerButton.classList.add("centerButton")

}






