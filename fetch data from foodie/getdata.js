var keys = []
$(".omo-purchase-event [data-toggle='collapse']").each((index, value) => {  var key = $(value).attr("data-target").slice(1);  if(keys.indexOf(key) === -1) keys.push(key); }) 


var session_key = "eyJjbGllbnRfaWQiOiJiYTMwNDBmOC1jMGRjLTQ2YjgtOWU5ZC0wN2YzOGYxMzEzMGMiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzX3Rva2VuIiwic2Vzc2lvbl9pbmRleCI6Il9lZDBhZWNjMTRiNTY0MWM2ZmRjNDRiYmY4ZWU2ZWM3MWI5M2U2YjE2Iiwic2NvcGUiOlsic29rLW5hdmkiLCJzb2stYXBpIiwib3BlbmlkIiwibWlvaW8xOGoxY2Q0Mm5seTFydDcycmNtbGg3MnZ2c3A0Ymo5Il0sImNsaWVudF9pZCI6ImJhMzA0MGY4LWMwZGMtNDZiOC05ZTlkLTA3ZjM4ZjEzMTMwYyIsImV4cCI6MTU0MDc1MDQyNTEwNH0.JyqUNEgkETQTEd4AuPZy5Fyz27JXjs9anFs9xaF_H8M"
var purchases = []

function getData(){
    keys.forEach(key => {
        jQuery.ajax({
            type: 'GET',
            url: "https://api.omo.s-cloud.fi/v1/purchase-event",  
            headers: {
                "Authorization": "Bearer "+session_key,
                "X-Language": "fi"
            },  
            data: {"key":key}, 
            success: function( data ){
                console.log(data)
                purchases.push(data);
            },
            error: function( jqXhr, textStatus, errorThrown ){
                console.log(jqXhr)
            }
        });
    });
}


