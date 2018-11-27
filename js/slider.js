var months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 
    'August', 'September', 'October', 'November', 'December'
];
var monthYearLabels = [];
 var timeline = [[2017,11],[2017,12],
    [2018,1],[2018,2],[2018,3],[2018,4],[2018,5],
    [2018,6],[2018,7],[2018,8],[2018,9],[2018,10]
];
var xPrev=0, startTime = 0, isPause=true, tick,percentTime=0;

for (i = 0; i < timeline.length; i++) {
    monthYearLabels[i] = months[timeline[i][1]-1] + ' ' + timeline[i][0];
}

/**
 * Manual timeline (activated from the header)
 */
$("#month-value-header").mousemove(function(e){
    if(e.buttons==1)
    {
        if(isPause){ //Autoplay is not active
            if(xPrev<e.pageX) {
                percentTime+=10;
            }
            else {
                percentTime-=10;
            }
            xPrev=e.pageX;

            fillText(percentTime/100);
            if (percentTime >= 100) {
                startTime++;
                if (startTime>=timeline.length){
                    startTime=0;
                }
                computeScatter(timeline[startTime][0],timeline[startTime][1]);
                percentTime=0;
                fillText(percentTime/100);
            }
            else if (percentTime <=0) {
                startTime--;
                if (startTime<0){
                    startTime=timeline.length-1;
                }
                computeScatter(timeline[startTime][0],timeline[startTime][1]);
                percentTime=100;
                fillText(percentTime/100);
            }
  
        }
    }
});

/**
 * Automatic timeline initialization
 */
function startTimeline() {
    clearTimeout(tick);
    percentTime = 0;
    fillText(0);
    computeScatter(timeline[startTime][0],timeline[startTime][1]);
    tick = setInterval(interval, 10);
}

/**
 * Autoplay and change scatter in the end of the play
 */
function interval() {
    if (isPause === false) {
        percentTime += 1;
        fillText(percentTime/100);
        if (percentTime >= 100) {
            startTime++;
            if (startTime>=timeline.length){
                startTime=0;
            }   
            startTimeline();
        }
    }
}

/*
 * Play/stop month timeline
 */
$("#month-action").click(function(e){
    if(isPause){
        $("#month-action").removeClass("fa-play");
        $("#month-action").addClass("fa-stop");
        isPause=false;
    }
    else{
        $("#month-action").removeClass("fa-stop");
        $("#month-action").addClass("fa-play");
        isPause=true;
    }

});
   
/**
 * Fill the color to header text
 * @param {real 0-1.0} progress 
 */
function fillText(progress=1.0){
    var c = document.getElementById("textCanvas");
    c.width = c.getBoundingClientRect().width;
    c.height = c.getBoundingClientRect().height;
    var ctx = c.getContext("2d");
    ctx.font = "bold 200% Arial, Helvetica, sans-serif";
    if(progress>1.0){progress=1.0;}
    else if(progress<0){progress=0;}
    // Create gradient
    var gradient = ctx.createLinearGradient(0, 0, c.width, 0);
    for(i=0; i<=progress;){
        gradient.addColorStop(String(i), "#bdbdbd");
        i += 0.01;
    }
    gradient.addColorStop(progress, "#2b8cbe");
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillText(monthYearLabels[startTime], 10, 50);
}

/**
 * Show scatter and its header
 */
setTimeout(function(){ startTimeline();}, 500)
