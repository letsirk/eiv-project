var purchases = [];
var purchases2 = []
var groups = {};
var storeCoordinates = {
    "Alepa Lintuvaara": {latitude: 60.234501, longitude: 24.81416},
    "Prisma Kaari Kannelmäki": {latitude: 60.236601, longitude: 24.892224},
    "Prisma Seinäjoki Hyllykallio": {latitude: 62.806265, longitude: 22.875738},
    "Prisma Sello": {latitude: 60.218755, longitude: 24.809848},
    "S-market Kivistö": {latitude: 62.776351, longitude: 22.850783},
    "S-market Parkano": {latitude: 62.007591, longitude: 23.009393},
    "S-market Pohjois-Tapiola": {latitude: 60.185724, longitude: 24.80707}
}
function makeBigData(){
    var rId=0;
    purchases.forEach(p => {
        var dateAsText = p.purchaseEvent.date;
        var date = new Date(p.purchaseEvent.date);
        var place = p.purchaseEvent.placeOfBusiness;
        var storeCode = p.purchaseEvent.storeCode;
        var coordinate = storeCoordinates[place];
        rId +=1;
        p.receipt.rows.forEach(r => {
            var cost = r.cost;
            var amount = r.pieces;
            var product = r.productName;
            
            if (product != undefined){
                var group = groups[product.toLowerCase().split(',').join('.')];
                if(group===undefined){group=groups[product.toLowerCase().split(',')[0]];}
                var group3 = group["group3"];
                var group4 = "";
                if (group["group3"] === undefined || (group["group3"]).length < 1){
                    group3 = product;
                } else {
                    group4 = product;
                }
                if ((group["group1"]).length>1){
                    purchases2.push({
                        dateAsText:dateAsText, 
                        year: date.getFullYear(),
                        month: date.getMonth()+1,
                        day: date.getDate(),
                        hours: date.getHours(),
                        minutes: date.getMinutes(),
                        seconds: date.getSeconds(),
                        placeOfBusiness:place, 
                        storeCode:storeCode,
                        cost:cost, 
                        pieces:Math.ceil(amount), //Full pieces
                        productName:product.toLowerCase(),
                        receiptId:rId,
                        latitude: coordinate.latitude,
                        longitude: coordinate.longitude,
                        group1: group["group1"],
                        group2: group["group2"],
                        group3: group3,
                        group4: group4,
                        group5: "",
                        group6: ""
                    });
                }
            }
        });
    });
};

function readGroupsFromFile(){
    groups = {};
    $.ajax ({ 
        url: 'data\\groups.txt', 
        method: "GET",
        success: function( data ){ 
            console.log("Reading groups.txt")
            var rows = data.split("\n");
            rows.forEach(r => {
                var col = r.split(",");
                var g = {"group1":"", "group2":"","group3":"","group4":"","group5":"","group6":""};
                for (var i = 1; i < col.length; i++) {  g["group"+i] = col[i];}
                groups[col[0]]=g;
            }); 
            makeBigData();
        }
    });
};
function readDataFromJSON(){
    $.ajax ({ 
        url: 'data\\data.json', 
        method: "GET",
        success: function( data ){ 
            console.log("Reading data.json")
            purchases = data;
            readGroupsFromFile();
            //makeBigData();
        }
    });
};

function getDistinctStores(){
    return _.groupBy(purchases2,"placeOfBusiness");
}

function getDistinctIngredients(){
    return _.groupBy(purchases2,"productName");
}

function getGroupPurchasesPerMonth(year,month,euro=false){
    var result = purchases2.filter(function (d) {
        return d.year === year && d.month === month;
    });
    var aggregateByColumn = 'pieces';
    if(euro){aggregateByColumn='cost';}
    
    return _(result).groupBy(function(d) { return d["month"]; }).map((v, k) => ( 
        _.sumBy(v, aggregateByColumn))).value()[0];
}

function getGroup1PurchasesPerMonth(year,month,euro=false){
    var result = purchases2.filter(function (d) {
        return d.year === year && d.month === month;
    });
    var aggregateByColumn = 'pieces';
    if(euro){aggregateByColumn='cost';}
    return _(result).groupBy(function(d) { return d["group1"]; }).map((v, k) => ({
        group1: k,
        pieces: _.sumBy(v, aggregateByColumn)}
    )).value().filter(function (d){return d.group1.length > 1});

}

function getGroup2PurchasesPerMonth(year,month,euro=false){
    var result = purchases2.filter(function (d) {
        return d.year === year && d.month === month;
    });
    var aggregateByColumn = 'pieces';
    if(euro){aggregateByColumn='cost';}
    return _(result).groupBy(function(d) { return d["group1"]+"-"+d["group2"]; }).map((v, k) => ({
        group1: k.split("-")[0],
        group2: k.split("-")[1],
        pieces: _.sumBy(v, aggregateByColumn)}
    )).value().filter(function (d){return d.group2.length > 1});
}
function getGroup3PurchasesPerMonth(year,month,euro=false){
    var result = purchases2.filter(function (d) {
        return d.year === year && d.month === month;
    });
    var aggregateByColumn = 'pieces';
    if(euro){aggregateByColumn='cost';}
    return _(result).groupBy(function(d) { return d["group1"]+"-"+d["group2"]+"-"+d["group3"]; }).map((v, k) => ({
        group1: k.split("-")[0],
        group2: k.split("-")[1],
        group3: k.split("-")[2],
        pieces: _.sumBy(v, aggregateByColumn)}
    )).value().filter(function (d){return d.group3.length > 1});
}
function getGroup4PurchasesPerMonth(year,month,euro=false){
    var result = purchases2.filter(function (d) {
        return d.year === year && d.month === month;
    });
    var aggregateByColumn = 'pieces';
    if(euro){aggregateByColumn='cost';}
    return _(result).groupBy(function(d) { return d["group1"]+"-"+d["group2"]+"-"+d["group3"]
                +"-"+d["group4"]; }).map((v, k) => ({
        group1: k.split("-")[0],
        group2: k.split("-")[1],
        group3: k.split("-")[2],
        group4: k.split("-")[3],
        pieces: _.sumBy(v, aggregateByColumn)}
    )).value().filter(function (d){return d.group4.length > 1});
}

readDataFromJSON();

function computeScatter(year=2018, month=3, euro=false,chartCanvas="#scatterChart"){
    drawCircos(getGroupPurchasesPerMonth(year,month,euro), 
    [   getGroup1PurchasesPerMonth(year,month,euro), 
        getGroup2PurchasesPerMonth(year,month,euro), 
        getGroup3PurchasesPerMonth(year,month,euro), 
        getGroup4PurchasesPerMonth(year,month,euro)
    ],chartCanvas)
}

