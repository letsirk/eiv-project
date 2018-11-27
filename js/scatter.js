var width = document.getElementsByClassName('mdl-card__supporting-text')[0].offsetWidth-0.8

//Assign colors
var groupColors = {
  "herbal": '#084081', //'#008000',
  "household products": '#0868ac', //'#8DB600',
  "pets": '#2b8cbe',  //'#FDEE00',
  "sweets": '#4eb3d3', // '#ED872D',
  "animal origin": '#7bccc4', //'#88540B',
  "other": '#a8ddb5',  //'#1F75FE',
  "liquid": '#ccebc5' //'#0000FF'
}
var opacity=0.93;

/**
 * 
 * @param {*} error 
 * @param {integer} total 
 * @param {array of arrays} groups 
 */
function drawCircos(total, groups, chartCanvas="#scatterChart") {
  $(chartCanvas).empty();
  var circosScatter = new Circos({
    container: chartCanvas,
    width: width,
    height: width
  })
  

  var group1 = groups[0];
  var group2 = groups[1];
  var group3 = groups[2];
  var group4 = groups[3];

  function capitalize(text=''){
    var cText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    if(cText==="Household products"){cText="Household";}
    else if(cText==="Pets"){cText="Pet";}
    else if(cText==="Sweets"){cText="Sweet";}
    return cText;
  }
  function toolTip(d, i) {
    return `${capitalize(d.name)} <br> Qty: ${d.value}`
  }
  //Compute sectors in the same order as groupColors
  var sectors = [];
  var groupCenters = {};
  Object.keys(groupColors).forEach(v => {
    var gg = group1.filter((d)=>{ return d.group1===v;});
    gg.forEach(g => {
      var labelText = capitalize(g.group1);
      
      sectors.push({"id":g.group1,"label":labelText,"color":"#996600","len":Math.max(0.14,g.pieces/total)})
      groupCenters[g.group1] = Math.max(g.pieces/total/2,0.14/2);
    });
  });
  function sortGroup(group){
    var sortedGroup = _(group).orderBy(["group1","pieces"],["asc","desc"]).value();
    var left=0;
    var prevL=0;
    var prevR=0;
    var right=0;
    var i=-1;
    var currentGroup = "";
    return sortedGroup.map(function (d) {
      if (currentGroup!==d.group1){
        left=groupCenters[d.group1];
        right=left;
        prevL=Math.max(Math.min(d.pieces,3),1);
        prevR=prevL;
        i=-1;
        currentGroup=d.group1;
      }
      i++;
      var data = {block_id: d.group1, position:0, value:d.pieces, name:d.group2};
      if (d.hasOwnProperty("group4")){
        data.name=d.group4;
      } else if (d.hasOwnProperty("group3")){
        data.name=d.group3;
      }
      
      if (i > 0){
        if(i % 2 === 0) { //left
          var nextL = Math.max(Math.min(d.pieces,3),1);
          left = left-((prevL+nextL)/2/150);
          prevL=nextL;
          data.position=left;
        } else { //right
          var nextR = Math.max(Math.min(d.pieces,3),1);
          right = right+((prevR+nextR)/2/150);
          prevR=nextR;
          data.position=right;          
        }
      } else { //middle
        data.position= groupCenters[d.group1];
      }
      return data
    });
  }

  var _group1 = group1.map(function (d) {
    return {
      block_id: d.group1,
      position: groupCenters[d.group1],
      value: d.pieces,
      name: d.group1
    }});
  
  var _group2 = sortGroup(group2);
  var _group3 = sortGroup(group3);
  var _group4 = sortGroup(group4);

  circosScatter.layout( sectors,
    {
      innerRadius: width/2-50,
      outerRadius: width/2-50,
      ticks: {
        display: false,
        spacing: 1,
        labelSuffix: ''
      },
      labels: {
        position: 'center',
        display: true,
        size: 18,
        font:'Arial, Helvetica, sans-serif',
        color: '#000',
        radialOffset: 20
      }
    }
    )
    .scatter('group-1',_group1, {
      innerRadius: 0.3,
      outerRadius: 0.4,
      color: function (d) {
        return groupColors[d.block_id];
      },
      min:0,
      max:300,
      opacity: opacity,
      radialMargin: 2,
      margin: 2,
      strokeColor: 'grey',
      strokeWidth: 0,
      shape: 'circle',
      size: function(d){
        return d.value*90;
      },
      tooltipContent: toolTip
    })
    .scatter('group-2',_group2, {
      innerRadius: 0.65,
      outerRadius: 0.75,
      color: function (d) {
        return groupColors[d.block_id];
      },
      min:0,
      max:300,
      opacity: opacity,
      radialMargin: 2,
      margin: 2,
      strokeColor: 'grey',
      strokeWidth: 0,
      shape: 'circle',
      size: function(d){
        return d.value*90;
      },
      tooltipContent: toolTip
    })
    .scatter('group-3',_group3, {
      innerRadius: 0.8,
      outerRadius: 0.9,
      color: function (d) {
        return groupColors[d.block_id];
      },
      min:0,
      max:300,
      opacity: opacity,
      radialMargin: 2,
      margin: 2,
      strokeColor: 'grey',
      strokeWidth: 0,
      shape: 'circle',
      size: function(d){
        return d.value*90;
      },
      tooltipContent: toolTip
    })
    .scatter('group-4',_group4, {
      innerRadius: 0.9,
      outerRadius: 1.0,
      color: function (d) {
        return groupColors[d.block_id];
      },
      min:0,
      max:300,
      opacity: opacity,
      radialMargin: 2,
      margin: 2,
      strokeColor: 'grey',
      strokeWidth: 0,
      shape: 'circle',
      size: function(d){
        return d.value*90;
      },
      tooltipContent: toolTip
    })
    .render()
}
