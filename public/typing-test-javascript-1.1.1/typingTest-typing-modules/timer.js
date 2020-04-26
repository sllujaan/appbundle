


//Timer-----------------------------
export var timer_minute = document.getElementsByClassName("minute")[0]
export var timer_second = document.getElementsByClassName("second")[0]

export function setCountDown(min, sec, callback) {

    if( !min || (min && min <=0) || (typeof min != 'number') ) min = 1
    if( !sec || (sec && sec < 0) ) sec = 0

    var minPad = String(min).padStart(2, 0)
    var secPad = String(sec).padStart(2, 0)

    timer_minute.innerText = minPad
    timer_second.innerText = secPad


    

    var interval =  setInterval(() => {

        if(sec > 0) {
            sec -= 1
            secPad = String(sec).padStart(2, 0)
            timer_second.innerText = secPad
            
        }
        else{
            sec = 59
            var secPad = String(sec).padStart(2, 0)
            timer_second.innerText = secPad
            
            min -= 1
            minPad = String(min).padStart(2, 0)
            timer_minute.innerText = minPad
        }


        if( (min <= 0) && (sec <= 0) ) {
            if(callback) {
                callback("done")
                clearInterval(interval)
                
            }
            else{
                clearInterval(interval)
                
            }
            
        }

    }, 1000);

}
//------------------------------------
