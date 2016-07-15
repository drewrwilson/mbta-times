
var userData;

var nanobar = new Nanobar( {
    bg: '#000000',
    target: document.getElementById('progress_bar'),
    id: 'nano'
});

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


        nanobar.go(5);


        var tempDate = new Date(0);
        var date = 0;
        var currentRow = 0;
        var totalRows = results.data.length;

        console.log('totalRows', totalRows);

        results.data.forEach(function (row) {
          currentRow++;

          nanobar.go((currentRow / totalRows) * 100);

            function rowString(values) {
                var s = '<tr>';
                var timestamp;

                //add a column for each column in the csv
                Object.keys(values).forEach(function (k) {
                  if (k == 'TimeStamp' || k == 'ScheduledTime') {
                    // timestamp = moment(values[k]).format('MMMM Do YYYY, h:mm:ss a');

                    moment(values[k]); //use momentjs to make a pretty date

                    s += '<td>';
                    s += moment().format('h:mm:ss a'); //display the timestamp in a more readable format
                    s += '</td>';
                  } else {
                    s += '<td>' + values[k] + '</td>';
                  }

                });

                return s + '</tr>';
            };
            $('#values').append(rowString(row));
        });

    }

});
