
var userData;

var nanobar;

var totalRequests = 0;

$(document).ready(function() {

  $.ajax({
          type: "GET",
          url: "data.csv",
          dataType: "text",
          success: function(data) {parseCSV(data);}
       });

    function parseCSV(csvString) {
        var results = Papa.parse(csvString, {
            header: true,
            skipEmptyLines: true,
            complete: function(results, file) {
                // console.log("Parse Complete", results);
                userData = results;
                renderPreview(results);
                $('#send-block').show();
            }
        });
    }

    function renderPreview(results) {
        var table = $('.csvpreview');

        results.meta.fields.forEach(function (header) {
            // console.log(header);
            $('#headers').append('<th>' + header + '</th>'); //add a header for each column
        });

        var tempDate = new Date(0);
        var date = 0;
        results.data.forEach(function (row) {

            function rowString(values) {
                var s = '<tr>';
                var timestamp = new Date (0);

                //add a column for each column in the csv
                Object.keys(values).forEach(function (k) {
                  if (k == 'TimeStamp' || k == 'ScheduledTime') {
                    timestamp.setUTCSeconds(values[k]);
                    s += '<td>';
                    s += timestamp; //
                    s += '</td>';
                  } else {
                    s += '<td>' + values[k] + '</td>';
                  }

                });

                return s + '</tr>';
            };
            $('#values').append(rowString(row));
        });

        totalRequests = results.data.length;
    }

    $('#send').click(function() { sendRequests(); });


    function sendRequests() {

        $('#send').hide();

        nanobar = new Nanobar( {
            bg: '#000000',
            target: document.getElementById('progress_bar'),
            id: 'nano'
        });
        nanobar.go(5);


        var requests = [];
        userData.data.forEach(function (req) {
            requests.push(post(req));
        });
        Promise.all(requests).then(function () {
            $('<h2>Completed</h2>').hide().appendTo('.send').fadeIn();
        });
    }

    function post(req) {
        return new Promise(function(resolve, reject) {
            /* replace setTimeout with ajax post */
            setTimeout(function () {
                resolve("Success");
                tickProgress();
            }, Math.random() * 5000);
        });
    }

    var completedRequests = 0;
    function tickProgress() {
        completedRequests++;
        nanobar.go(completedRequests / totalRequests * 100);
    }

});
