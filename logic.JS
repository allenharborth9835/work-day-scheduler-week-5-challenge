let currentDate = moment().format('MMMM Do YYYY, h:mm a');
let currentTime = moment().format('LT');
//create varibles for start time of task 
//and boolean to see if it is in the morning
let startTime = 7;
let isMorning = true;
let taskArr = []

$("#currentDay").append("<h1>"+moment().format('dddd') +"</h1>");
$("#currentDay").append(currentDate);

//create a time id for the block
function createTimeId(lastTimeID, titleEl){
    //change time from military time to standard
    if(isMorning){
        $(titleEl).append(lastTimeID + " am");
    }else{
        $(titleEl).append((lastTimeID-12)+" pm");
    };
    if(lastTimeID ===12){
        isMorning = false;
    };    
    return titleEl;
};

//audit time that colors the time blocks to hour
function auditTime(timeId, taskEl){
    //set the time 1 hour ahead
    pastHour=timeId+1;
    //turn time id into acual time
    let time = moment(pastHour.toString(), "LT");
    //create else if to shade timeblocks
    if(moment().isAfter(time)){
        $(taskEl).addClass("col-10 past");
    }else if(Math.abs(moment().diff(time, "hours"))<1){
        $(taskEl).addClass("col-10 present");
    }else{
        $(taskEl).addClass("col-10 future");
    };
    return taskEl;
};

//function to save the task
function saveTasks(timeId, task){
    //create object for task
    let taskInfo = {
        date: moment().format('l'),
        time: timeId,
        taskDes: task
    };
    //push into array and save to local storage
    taskArr.push(taskInfo);
    localStorage.setItem("scheduledTask", JSON.stringify(taskArr));
};

//function to load the task already saved
function loadTask(timeBlock, taskEl){
    //load saved tasks to array and load task to time blocks
    savedTasks = localStorage.getItem("scheduledTask");
    if(!(savedTasks==null)){
        savedTasks = JSON.parse(savedTasks);
        taskArr=savedTasks
        savedTasks.forEach(task=>{
            if((timeBlock === task.time)&(task.date === moment().format('l'))){
                $(taskEl).html(task.taskDes);
            };
        
        });
    };
    return taskEl;
};

//function to create individual task blocks
function createTimeblocks(){
    //create each timeblock
    for(let block = 0; block<11;block++){
        //create a time id
        timeId = startTime + block;

        //create row div to hold time block
        let timeEl = document.createElement("div");
        $(timeEl).addClass("row");

        //create title for time block
        let titleEl = document.createElement("div");
        $(titleEl).addClass("col-1 hour");
        titleEl = createTimeId(timeId, titleEl);
        $(timeEl).append(titleEl);

        //create task for time block
        taskEl = document.createElement("textarea");
        taskEl = loadTask($(titleEl).text(), taskEl);
        taskEl = auditTime(timeId, taskEl);
        $(taskEl).addClass("task");
        $(timeEl).append(taskEl);
        
        //create button for time block
        scheduleBtn = document.createElement("button");
        $(scheduleBtn).addClass("col-1 oi oi-hard-drive saveBtn");
        $(timeEl).append(scheduleBtn);

        //add time block to page
        $("#timeBlocks").append(timeEl);
    };
};

//call create time blocks element to create page
createTimeblocks();

//click action to save task
$(".saveBtn").on("click", function(){
    let timeId = $(this).siblings(".hour").text();
    let taskTime = parseInt($(this).siblings(".hour").text().substring(0,2));
    if($(this).siblings(".hour").text().charAt(2)==="p"){
        taskTime+=12;
    };
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

