
import {setCountDown, timer_minute, timer_second} from './timer.js'
import {quote, getQuotes} from '../assets/quotes.js'


//Reading parameter from url---------------
var queryString = window.location.search
var urlParams = new URLSearchParams(queryString)
var test = parseInt(urlParams.get('test'))
var minParam

 

if (test && ( (typeof test !== 'number') || test < 1 ) ) test = 1
if (test && test > 10) test = 10

if(test) {
    minParam = test
    var minPad = String(minParam).padStart(2, 0)
    timer_minute.innerText = minPad
    timer_second.innerText = '00'
}else{
    minParam = 1
}

//---------------------------------------------


//Setting Coutndown variable-------------------------
var countDownStarted = false
//-----------------------------------------------------

var transform = 0
var first_line_y_client = 0
var typing = null


//dynamically generating html content--------------------------------------------
var basic_words_container =document.getElementsByClassName("basic-words-container")[0]
var quoteWords = getQuotes().trim().split(' ')

function generateWord(word) {
    var basic_word = document.createElement('div')
    basic_word.classList.add("basic-word")
    
    word.trim().split('').forEach(letter => {
        basic_word.append(generateLetter(letter))
    });

    basic_word.append(generateLetter("&nbsp;"))
    return basic_word
}

function generateLetter(letter) {
    var basic_letter = document.createElement('div')
    basic_letter.classList.add("basic-letter")
    basic_letter.innerHTML = letter
    return basic_letter
}

 

quoteWords.forEach(word => {
    basic_words_container.append(generateWord(word))
})

//-------------------------------------------------------------

//elements to show or hide-------------------------------------
var score_container = document.getElementById("score-container")
var basic_screen = document.getElementsByClassName("basic-screen")[0]
var timer_container = document.getElementsByClassName("timer-container")[0]
var score_board = document.getElementsByClassName("score-board")[0]
var focusMe = document.getElementById("focusMe")

//------------------------------------------

var basic_word = document.getElementsByClassName("basic-word")[0]
basic_word.children[0].classList.add("letter-next")

var basic_words_container = document.getElementsByClassName("basic-words-container")[0]
var basic_words_container_compStyles = window.getComputedStyle(basic_words_container)
 
setLetterActive_next()


function setNextLetter() {
    var letter_next = document.getElementsByClassName("letter-next")[0]

    if(letter_next.nextElementSibling) {
        letter_next.classList.remove("letter-next")
        letter_next = letter_next.nextElementSibling
        letter_next.classList.add("letter-next")
    }
    else if(letter_next.parentElement.nextElementSibling && letter_next.parentElement.nextElementSibling.classList.contains("basic-word")){
        letter_next.classList.remove("letter-next")
        var current_word = letter_next.parentElement
        current_word = current_word.nextElementSibling
        current_word.children[0].classList.add("letter-next")
    }
}


function setLetterActive_next() {
    var letter_active = document.getElementsByClassName("letter-active")[0]
    var letter_next = document.getElementsByClassName("letter-next")[0]

    if(letter_active) {
        letter_active.classList.remove("letter-active")
        letter_next.classList.add("letter-active")
        setNextLetter()
    }
    else{
        letter_next.classList.add("letter-active")
        setNextLetter()
    }
}


function setPrevLetter(callback) {
    var letter_active = document.getElementsByClassName("letter-active")[0]
    var letter_next = document.getElementsByClassName("letter-next")[0]

     
     

    if(letter_active.previousElementSibling) {
        
        if(letter_active.parentElement === letter_next.parentElement) {

            letter_active.previousElementSibling.classList.add("letter-active")
            
            letter_next.previousElementSibling.classList.add("letter-next")
            handleBackspaceClasses(letter_active, letter_next)
            var success = 1
            if(callback) callback(success)
        }
        else{
            letter_active.classList.add("letter-next")
            
            letter_active.previousElementSibling.classList.add("letter-active")

             

            handleBackspaceClasses(letter_active, letter_next)
            var success = 1
            if(callback) callback(success)
        }

    }
    else if(letter_active.parentElement.previousElementSibling && letter_active.parentElement.previousElementSibling.classList.contains("basic-word")) {

            letter_active.classList.add("letter-next")

            letter_active.parentElement.previousElementSibling.lastElementChild.classList.add("letter-active")

             

            handleBackspaceClasses(letter_active, letter_next)
            var success = 1
            if(callback) callback(success)
    }
    else {
         

        var success = 1
        if(callback) callback(success)
    }
}


//handle classes when going back-----------------------------
function handleBackspaceClasses(letter_active, letter_next) {
    letter_active.classList.remove("letter-active", "letter-active-animated", "is-wrong", "is-correct", "is-wrong-animated", "is-wrong-active-animated")
    letter_next.classList.remove("letter-next", "is-wrong", "is-correct", "is-wrong-animated", "is-wrong-active-animated")

    if(letter_active.previousElementSibling) {
        letter_active.previousElementSibling.classList.remove("is-wrong", "is-correct", "is-wrong-animated", "is-wrong-active-animated")
    }
    else if(letter_active.parentElement.previousElementSibling){
        letter_active.parentElement.previousElementSibling.lastElementChild.classList.remove("is-wrong", "is-correct", "is-wrong-animated", "is-wrong-active-animated")
    }
    
}
//-----------------------------------------------



document.addEventListener('keydown', (event) => {
    clearTimeout(typing)
    typing = setTimeout(() => {
        onTypingStop()
    }, 2000);

    //Set CountDown-------------------------------------
    if(!countDownStarted) {
        setCountDown(minParam, 0, (done) => {
            if(done) {
                var score = getNetWPM()
                handleResult(score)
                //window.location = `../typingTest-finish-modules/typingTest-finish.html?score=${score}`
            }
        })
        countDownStarted = true
    } 
    //------------------------------------


    var letter_active = document.getElementsByClassName("letter-active")[0]
    var letter_next = document.getElementsByClassName("letter-next")[0]

    var letter_active_prev_position_y = getLetterActiveYposition(letter_active)
   
     
     
    //Normal next functionality---------------
    if((event.key !== "Shift") && (event.key !== "Backspace")) {
        if(letter_active.innerText.trim() === event.key.trim()){
             
            setLetterActive_next()
            handleClassesOnCorrect(letter_active, letter_next, (success) => {
                if(success) {
                    handleLinesTransform_upwards(letter_active_prev_position_y)
                }
            })
            
        }
        else{
             
            if(letter_active.previousElementSibling && letter_active.previousElementSibling.classList.contains("is-correct")) {
                setLetterActive_next()
            }
            
            handleClassesOnWrong(letter_active, letter_next)
            
        }

    }
    //-------------------------------------------------


    //Backspace functionality---------------------------------------
    if(event.key === "Backspace") {
        setPrevLetter((success)=> {
            if (success) handleLinesTransform_downwards(letter_active_prev_position_y)
        })
    }
    //-----------------------------------

    

})




function handleClassesOnCorrect(letter_active, letter_next, callback) {
    letter_active.classList.remove("is-wrong", "letter-active", "letter-active-animated", "is-wrong-animated", "is-wrong-active-animated")

    letter_active.classList.add("is-correct")
    letter_next.classList.add("letter-active")

    setTimeout(() => {
        var success = 1
        if(callback) callback(success)
    }, 100);
}

function handleClassesOnWrong(letter_active, letter_next, callback) {
    letter_active.classList.remove("is-correct", "is-wrong", "is-wrong-animated", "is-wrong-active-animated")
    void letter_active.offsetWidth
    letter_active.classList.add("is-wrong", "is-wrong-animated")
    
    setTimeout(() => {
        var letter_active = document.getElementsByClassName("letter-active")[0]

        if (letter_active.classList.contains("is-wrong")) {
            letter_active.classList.remove("is-wrong", "is-wrong-animated")
        }

        var letter_wrong = document.getElementsByClassName("is-wrong")
         
        for(var i=0; i<letter_wrong.length; i++) {
            letter_wrong[i].classList.remove("is-wrong-animated", "letter-active-animated")
        }
        
    }, 500);
}


function handleLinesTransform_upwards() {
    var letter_active = document.getElementsByClassName("letter-active")[0]
    var letter_active_current_position_y = getLetterActiveYposition(letter_active)

    var diff = letter_active_current_position_y - first_line_y_client
    
    first_line_y_client = letter_active_current_position_y
  
    if(diff > 70) {
        if(basic_words_container_compStyles.getPropertyValue("transform") === "none") {
            var basic_screen = document.getElementsByClassName("basic-screen")[0]
            
            

            transform -= 100
            basic_words_container.style.setProperty("transform", `translateY(${transform}px)`)
            basic_screen.style.setProperty("height", "360px")
        }
        else{
            transform -= 77
            basic_words_container.style.setProperty("transform", `translateY(${transform}px)`)
        }
    }
    else{
         
    }  
}



function handleLinesTransform_downwards() {
    
    var letter_active = document.getElementsByClassName("letter-active")[0]
    var letter_active_current_position_y = getLetterActiveYposition(letter_active)
    
    var diff = letter_active_current_position_y - first_line_y_client
      
    first_line_y_client = letter_active_current_position_y

    if(diff < -70) {
        transform += 77
        basic_words_container.style.setProperty("transform", `translateY(${transform}px)`)
    }
    
}


function getNetWPM() {
    var letters_correct = document.getElementsByClassName("is-correct")
    var total = letters_correct.length
    var wpm = [ (total / 4) / minParam]
    return wpm
}



function getLetterActiveYposition(letter_next) {
    return letter_next.getBoundingClientRect().y;
}



//letters y client calculations--------------------------------------
var letter_active = document.getElementsByClassName("letter-active")[0]
first_line_y_client = getLetterActiveYposition(letter_active)
 
//---------------------------------------------------------------


function animateLetterAcitve() {
    var letter_active = document.getElementsByClassName("letter-active")[0]
    if (letter_active) letter_active.classList.add("letter-active-animated")
}
animateLetterAcitve()




function onTypingStop() {
     
    animateLetterAcitve()
}

function handleResult(score) {

    //hidding typing conainer and timer---------------------------
    timer_container.style.setProperty("display", "none")
    basic_screen.style.setProperty("display", "none")
    //-----------------------------------

    //setting score and displaying------------------
    var score_board_pad = String(score).padStart(2, 0)
    score_board_pad = Math.floor(score_board_pad)
    score_board.innerText = score_board_pad;
    score_container.style.setProperty("display", "block")
    //-------------------------------
}

console.log(score_container)


/*
var container_score = document.getElementsByClassName("container-score")[0]
var basic_screen = document.getElementsByClassName("basic-screen")[0]
var timer_container = document.getElementsByClassName("timer-container")[0]
var score_board = document.getElementsByClassName("score-board")[0]
*/

focusMe.focus()