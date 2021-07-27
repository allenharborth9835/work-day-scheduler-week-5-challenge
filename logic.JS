let currentDate = moment().format('MMMM Do YYYY, h:mm a');
let currentTime = moment().format('LT');
let startTime = 7;
let isMorning = true;
let taskArr = []

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

function auditTime(timeId, taskEl){
    pastHour=timeId;
    let time = moment(pastHour.toString(), "LT") ;
    if(moment().isAfter(time)){
        $(taskEl).addClass("col-10 past");
    }else if(Math.abs(moment().diff(time, "hours"))<1){
        $(taskEl).addClass("col-10 present");
    }else{
        $(taskEl).addClass("col-10 future");
    }
    return taskEl;
}

function saveTasks(timeId, task){
    let taskInfo = {
        date: moment(),
        time: timeId,
        taskDes: task
    }
    taskArr.push(taskInfo)
    localStorage.setItem("scheduledTask", JSON.stringify(taskArr))
}
function loadTask(timeBlock, taskEl){
    savedTasks = localStorage.getItem("scheduledTask");
    if(!(savedTasks==null)){
        savedTasks = JSON.parse(savedTasks);
        savedTasks.forEach(task=>{
            console.log(task.time)
            if((timeBlock === task.time)&(timeBlock.date === moment())){
                taskEl.append(task.taskDes);
            };
        
        });
    };
    return taskEl;
};

function createTimeblocks(){
    for(let block = 0; block<11;block++){
        timeId = startTime + block;
        let timeEl = document.createElement("div");
        $(timeEl).addClass("row");

        let titleEl = document.createElement("div");
        $(titleEl).addClass("col-1 hour");
        titleEl = createTimeId(timeId, titleEl);
        $(timeEl).append(titleEl);

        taskEl = document.createElement("textarea");
        taskEl = loadTask($(titleEl).text(), taskEl);
        $(taskEl).addClass("task")
        $(timeEl).append(taskEl);
        
        scheduleBtn = document.createElement("button");
        $(scheduleBtn).addClass("col-1 oi oi-hard-drive saveBtn");
        $(timeEl).append(scheduleBtn);

        taskEl = auditTime(timeId, taskEl);
        
        $("#timeBlocks").append(timeEl);
    }
    
}

createTimeblocks();

$(".saveBtn").on("click", function(){
    let timeId = $(this).siblings(".hour").text();
    let taskTime = parseInt($(this).siblings(".hour").text().substring(0,2));
    if($(this).siblings(".hour").text().charAt(2)==="p")
        taskTime+=12;
    
    let text = $(this).siblings("textarea")
        .val()
        .trim();
    let taskEl = $("<textarea>")
        .text(text);
        taskEl = auditTime(taskTime, taskEl);
    $(taskEl).addClass("task");
    $(this).siblings("textarea").replaceWith(taskEl);
    console.log("test");
    saveTasks(timeId, text);
});

