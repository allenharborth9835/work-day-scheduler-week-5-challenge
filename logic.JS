let currentDate = moment().format('MMMM Do YYYY, h:mm a');
let currentTime = moment().format('LT');
let startTime = 7;
let isMorning = true;

$("#currentDay").append("<h1>"+moment().format('dddd') +"</h1>");
$("#currentDay").append(currentDate);

function createTimeId(lastTimeID, titleEl){
    if(isMorning){
        $(titleEl).append(lastTimeID + " am");
    }else{
        $(titleEl).append((lastTimeID-12)+" pm")
    }
    if(lastTimeID ===12)
        isMorning = false;
    
    return titleEl;
}

function auditTime(timeBlock, taskEl){
    pastHour=timeBlock+1;
    var time = moment(pastHour.toString(), "LT");
    if(moment().isAfter(time)){
        $(taskEl).addClass("col-10 past");
    }else if(Math.abs(moment().diff(time, "hours"))<1){
        $(taskEl).addClass("col-10 present");
    }else{
        $(taskEl).addClass("col-10 future");
    }
    return taskEl;
}
function editTask(){
    var text = $(this)
        .text()
        .trim();
    var textInput =$("<textarea>")
        .addClass("form-control")
        .val(text);
    $(this).replaceWith(textInput);
    textInput.trigger("focus");
}


function createTimeblocks(){
    for(var block = 0; block<11;block++){
        timeId = startTime + block;
        let timeEl = document.createElement("div");
        $(timeEl).addClass("row");

        let titleEl = document.createElement("div");
        $(titleEl).addClass("col-1 hour");
        titleEl = createTimeId(timeId, titleEl);
        $(timeEl).append(titleEl);

        let taskEl = document.createElement("div");
        let inputEl = document.createElement("p");
        $(taskEl).append(inputEl)
        $(timeEl).append(taskEl);

        $(taskEl).on("click", inputEl, function(){
            var text = $(this)
                .text()
                .trim();
            var textInput = $("<textarea>")
                .val(text);
            $(this).replaceWith(textInput);
            textInput.trigger("focus");
        });
        

        let scheduleBtn = document.createElement("button");
        $(scheduleBtn).addClass("col-1 oi oi-hard-drive saveBtn");
        $(timeEl).append(scheduleBtn);
        $(scheduleBtn).on("click", taskEl, function(){
            
        })
        taskEl = auditTime(timeId, taskEl);

        $("#timeBlocks").append(timeEl);
        timeId++;
    }
    
}

createTimeblocks();

