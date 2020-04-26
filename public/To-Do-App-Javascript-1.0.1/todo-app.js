

var tasks_container = document.getElementsByClassName("tasks-container")[0]
var ITEMS_KEY = "TO-DO-APP-0.4226353638288256"
var TASKS = []
//var oldText
var oldTextArr = []
var container_tooltip = document.getElementsByClassName("container-tooltip")[0]

//Local storage functions----------------------------------------------------------
function save(){
    localStorage.setItem(ITEMS_KEY, JSON.stringify(TASKS))
}

function addTask(id , value){
    if (!TASKS) {
        TASKS = []
    }
    TASKS.unshift({id, value})
}

function getTasks(){
    return JSON.parse(localStorage.getItem(ITEMS_KEY))
}

function removeTask(id){
    TASKS = getTasks()
    if( (TASKS) && TASKS.length > 0) {
        TASKS.find((task, index) => {
            if(task.id == id) {
                TASKS.splice(index, 1)
                return task
            }
        })
        save()
    }
}


//Save new Text in localstorage------------------------------------------
function replaceTextLocalStorage(id, newText) {
    
    TASKS = getTasks()
    if( (TASKS) && TASKS.length > 0) {
        TASKS.find((task) => {
            if(task.id == id) {
                //TASKS.splice(index, 1)
                
                task.value = newText
                return task
            }
        })
        save()
    }
}
//------------------------------------------------------------

//-------------------------------------------------------------------------

//Load Tasks on document load----------------------------------------------------------
function loadTasks(){
    TASKS = getTasks()
    if( (TASKS) && TASKS.length > 0) {
        TASKS.forEach(task => {
            tasks_container.append(generateTaskContainer(task.id, task.value))
        })
    }
    else{
        tasks_container.innerHTML = null
        tasks_container.innerHTML = `<h1 id="00000">No Tasks Found.</h1>`
    }
}

document.addEventListener('DOMContentLoaded', loadTasks)
//-------------------------------------------------------------------------------------

document.addEventListener('click', (event)=> {
    var id = event.target.getAttribute("id")
    

    //Edit task----------------------------------------------------------------------------
    if(event.target.classList.contains("fa-edit")) {
        
        
        var taskItem = document.getElementById(id).getElementsByClassName("itemTask")[0]
        var oldText = taskItem.innerText
        
        

        oldTextArr.push({id:id, text:oldText})




        var div_edited_task = document.createElement("div")
        div_edited_task.classList.add("edited-task")

        var content = `<input id="${id}" class="on-edit-input" type="text" value="${oldText}">
                            <div class="editCancelBtns">
                                <i id="${id}" class="fas fa-save fa-2x saveBtn"></i>
                                <i id="${id}" class="fas fa-ban fa-2x cancelBtn"></i>
                            </div>
                        `
        
        div_edited_task.innerHTML = content

        

        taskItem.replaceWith(div_edited_task)

        event.target.style.setProperty("pointer-events", "none")

        //focus input when user edits a taks------------------------
        var on_edit_container = document.getElementById(id)
        var on_edit_input = on_edit_container.getElementsByClassName("on-edit-input")[0]
        on_edit_input.focus()
        //------------------------------------------------------
    }
    //----------------------------------------------------------------------------------------



    //Save button task-----------------------------------------------------------------------
    if(event.target.classList.contains("saveBtn")){
        var task_container = document.getElementById(id)
        
        //var prevElement = event.target.previousElementSibling
        var inputElement = event.target.parentElement.parentElement.children[0]
        var newText = inputElement.value

        

        //check if length is not zero save text----------------------
        if(newText && newText.length > 0) {
            var div = document.createElement("div")
            div.setAttribute("id", id)
            div.classList.add("itemTask")
            div.innerText = newText

            

            var edited_task = event.target.parentElement.parentElement
            edited_task.replaceWith(div)

            
            var edit_task_btn = task_container.getElementsByClassName("fa-edit")[0]
            
            edit_task_btn.style.removeProperty("pointer-events")

            replaceTextLocalStorage(id, newText)
        }
        else{
            alert("The field is empty.")
        }


        
        
    }
    //---------------------------------------------------------------------------------------
    

    //Cancel task-----------------------------------------------------------------------
    if(event.target.classList.contains("cancelBtn")){
        var task_container = document.getElementById(id)
        
        
        
        //var prevElement = event.target.previousElementSibling
        //var inputElement = event.target.parentElement.parentElement.children[0]
        //var newText = inputElement.value

        

        var oldTextObj = getOldTextById(id)        


        var div = document.createElement("div")
        div.setAttribute("id", id)
        div.classList.add("itemTask")
        div.innerText = (oldTextObj) ? (oldTextObj.text) : ("")

        

        var edited_task = event.target.parentElement.parentElement
        edited_task.replaceWith(div)

        
        var edit_task_btn = task_container.getElementsByClassName("fa-edit")[0]
        
        edit_task_btn.style.removeProperty("pointer-events")
        
    }
    //---------------------------------------------------------------------------------------


    //Remove Task-------------------------------------------------------------
    if(event.target.classList.contains("fa-trash-alt")){
        var task_container = document.getElementById(id)
        
        removeTask(id)
        task_container.remove()

        TASKS = getTasks()
        if( (TASKS) && TASKS.length == 0) {
            showNoTasksfound()
        }
        
    }

    //-----------------------------------------------------------------------------


    //Add Task--------------------------------------------------------------------------
    if(event.target.classList.contains("addTaskBtn") || (event.target.parentElement && event.target.parentElement.classList.contains("addTaskBtn"))) {
        event.preventDefault()
        var input = document.getElementsByClassName("task-input")[0]
        var id = Math.random()
        
        if(input.value.length > 0){
            var generatedTaskContainer = generateTaskContainer(id, input.value)
            
            if(tasks_container.lastElementChild.id == '00000'){
                tasks_container.innerHTML = null
            }
            addTask(id, input.value)
            save()
            tasks_container.insertBefore(generateTaskContainer(id, input.value), tasks_container.children[0])
            input.value = ''
            tasks_container.children[0].classList.add("task-container-active")
        }
        else{
            alert("The field is empty.")
        }
    }
    //---------------------------------------------------------------------------------
    
    //Search Task--------------------------------------------------------------------------------
    if(event.target.classList.contains("searchBtn") || (event.target.parentElement && event.target.parentElement.classList.contains("searchBtn"))) {
        event.preventDefault()
        var input = document.getElementsByClassName("search-input")[0]

        if(input.value.length === 0) {alert("The field is empty.");return}

        var regEx = genRegEx(input.value)
        
        
        if(regEx) {
            TASKS = getTasks()
            if( (TASKS) && TASKS.length > 0) {
                tasks_container.innerHTML = null
                TASKS.forEach(task => {
                    if(regEx.test(task.value)){
                        var taskContainer = generateTaskContainer(task.id, task.value)
                        var itemTask = taskContainer.querySelector(".itemTask")
                        
                        itemTask.innerHTML = itemTask.innerText.replace(regEx, `<span class="highlighted">$1</span>`)

                        

                        tasks_container.append(taskContainer)
                    }
                })

                if(tasks_container.innerHTML.trim() == "") {
                    tasks_container.innerHTML = `<h1 id="00000">No Tasks Found.</h1>`
                }
            }
        }
        else{
            
            tasks_container.innerHTML = `<h1 id="00000">No Tasks Found.</h1>`
        }

        /*
        if(input.value.length > 0){
            TASKS = getTasks()
            if( (TASKS) && TASKS.length > 0) {
                tasks_container.innerHTML = null
                TASKS.forEach(task => {
                    if(task.value.includes(input.value)){
                        tasks_container.append(generateTaskContainer(task.id, task.value))
                    }
                })

                if(tasks_container.innerHTML.trim() == "") {
                    tasks_container.innerHTML = `<h1 id="00000">No Tasks Found.</h1>`
                }
            }
        }*/
    }
    //------------------------------------------------------------------------------------------

    //Generate Regular Expression----------------------------------------------------
    function genRegEx(words) {
        if(words) {
            var regEx = '('
            wordsArr = words.match(/[^\s\\]{1,}/g)
            
            if (wordsArr) {
                    wordsArr.forEach((word, index) => {
                    regEx += word + '|'
                })
                regEx.replace(/.$/, "\.")
                regEx = regEx.slice(0, regEx.length-1)
                regEx += ')'
                var newRegEx = new RegExp(regEx, 'gi')
                return newRegEx
            }
        }
    }
    //------------------------------------------------------------------------------

})

function generateTaskContainer(id, value) {
    
    var task_container = document.createElement("div")
    task_container.setAttribute("id", id)
    task_container.classList.add("task-container")
    
    var content = `
                <div id="${id}" class="itemTask">
                    ${value}
                </div>

                <div class="task-btns">
                    <div class="edit-Task">
                        <i id="${id}" class="fas fa-edit"></i>
                    </div>
                    <div class="remove-Task">
                        <i id="${id}" class="fas fa-trash-alt"></i>
                    </div>
                </div>
                `
    task_container.innerHTML = content
    return task_container
}


//on edit event listener----------------------------------------------
document.addEventListener('keyup', (event) => {
    if(event.target.classList.contains("on-edit-input")){
        
        if(event.key == "Enter") {
            
            event.target.nextElementSibling.children[0].click()
        }
        
        
    }
})
//----------------------------------------------------------------------

//--------------------
function showNoTasksfound() {
    tasks_container.innerHTML = null
    tasks_container.innerHTML = `<h1 id="00000">No Tasks Found.</h1>`
}

//------------------


//get old text by id --------------------------------
function getOldTextById(id) {
    return oldTextArr.find(obj => parseFloat(obj.id) === parseFloat(id))
}
//------------------------------------


document.addEventListener('mousemove', e => {
    
    

    if(window.innerWidth <= 600) return
    
    if(e.target.classList.contains("itemTask")) {
        showToolTip(e.target.innerText, e.clientX, e.clientY)
    }
    else{
        
        container_tooltip.style.setProperty("display", `none`)
    }


})



function showToolTip(text, x, y) {
    if(!text || !x || !y) return

    container_tooltip.innerText = text
    container_tooltip.style.setProperty("display", `block`)
    container_tooltip.style.setProperty("left", `${x}px`)
    container_tooltip.style.setProperty("top", `${y}px`)
    

}
