var baseURL = "http://localhost:8080/";
// var baseURL =  "https://www.gmhafiz.com/";

// DOM element where the Timeline will be attached
var container = document.getElementById('visualization');

// Create a DataSet (allows two way data-binding)
var items = new vis.DataSet(getAllEvents()
//     [
//     {id: 1, content: 'item 1', start: '2017-04-20'},
//     {id: 2, content: 'item 2', start: '2017-04-14'},
//     {id: 3, content: 'item 3', start: '2017-04-18'},
//     {id: 4, content: 'item 4', start: '2017-04-16', end: '2017-04-19'},
//     {id: 5, content: 'item 5', start: '2017-04-25'},
//     {id: 6, content: 'item 6', start: '2017-04-27'}
// ]

//     [{"id":4,"content":"t1","start":"2017-04-16","end":"2017-04-19","type":"","title":"","group":"","subgroup":"","style":"","createdAt":"2017-04-17T02:14:44.166869942+10:00","updatedAt":"2017-04-17T02:14:44.166869942+10:00"},{"id":5,"content":"t1","start":"2017-04-16","end":"2017-04-19","type":"","title":"","group":"","subgroup":"","style":"","createdAt":"2017-04-17T02:14:46.095823387+10:00","updatedAt":"2017-04-17T02:14:46.095823387+10:00"},{"id":6,"content":"t1sfaf","start":"2017-04-16","end":"2017-04-19","type":"","title":"","group":"","subgroup":"","style":"","createdAt":"2017-04-17T02:15:17.604591386+10:00","updatedAt":"2017-04-17T02:15:17.604591386+10:00"},{"id":7,"content":"t1","start":"2017-04-16","end":"2017-04-19","type":"","title":"","group":"","subgroup":"","style":"","createdAt":"2017-04-17T02:18:58.109212081+10:00","updatedAt":"2017-04-17T02:18:58.109212081+10:00"},{"id":8,"content":"t1","start":"2017-04-16","end":"2017-04-19","type":"","title":"","group":"","subgroup":"","style":"","createdAt":"2017-04-17T02:23:13.554703373+10:00","updatedAt":"2017-04-17T02:23:13.554703373+10:00"},{"id":9,"content":"t1","start":"2017-04-17","end":"2017-04-20","type":"","title":"","group":"","subgroup":"","style":"","createdAt":"2017-04-17T02:23:22.393150852+10:00","updatedAt":"2017-04-17T02:23:22.393150852+10:00"}]
);

// -100,000 years ago tp present
// Configuration for the Timeline
var options = {
    width: '100%',
    height: '40vh',
    selectable: true,
    autoResize: true,
    min: "-100000-01-01",
    editable: {
        add: true,
        updateTime: true,
        updateGroup: true,
        remove: true,
        overrideItems: false
    },
    onRemove: function (item, callback) {
        prettyConfirm('Remove item', 'Do you really want to remove item ' + item.content + '?', function (ok) {
            if (ok) {
                callback(item);
                console.log("removed item id: " + item.id);
                deleteItemDB(item.id);
            } else {
                callback(null);
            }
        });
    },

    onMove: function (item, callback) {
        console.log(item);
        // prettyConfirm('Move Item', 'Do you really want to move the item to\n' +
        // 'start: ' + item.start + '\n' +
        // 'end: ' + item.end + '?', function (ok) {
        //     if (ok) {
        callback(item);
        updateEvent(item);
        //     } else {
        //         callback(null);
        //     }
        // });
    },

    onAdd: function (item, callback) {
        prettyPrompt('Add item', 'Enter text content for new item:', item.content, function (value) {
            if (value) {
                item.content = value;
                // todo: add option for range of date
                // item.group = "\"" + item.group + "\"";
                // item.subgroup = "\"" + item.subgroup + "\"";
                item.type = 'point'; // all events added by this is a point
                addEvent(item);
                // callback(item); // send back adjusted new item
            }
            else {
                callback(null); // cancel item creation
            }
        });
    },

    onUpdate: function (item, callback) {
        // prettyPrompt('Update item', 'Edit items text:', item.content, function (value) {
        //     if (value) {
        //         item.content = value;
        //         callback(item); // send back adjusted item
        //     }
        //     else {
        //         callback(null); // cancel updating the item
        //     }
        // });
    }
};


// // Individual's Name
// var group = [
//     {
//         id: '0',
//         content: '<div class="media"><img class="d-flex mr-3" src="images/100x100.png" width=100 height=100 alt=""><div class="media-body"><h5>NEL, Pieter</h5>Position : Director SMO<br />Payroll ID: 110334<br />FTE: 1.00</div></div>'
//     },
//     {
//         id: '1',
//         content: '<div class="media"><img class="d-flex mr-3" src="images/100x100.png" width=100 height=100 alt=""><div class="media-body"><h5>BOES Sabine</h5>Position : FACEM<br />Payroll ID: 326684<br />FTE: 1.00</div></div>'
//     },
//     {
//         id: '2',
//         content: '<div class="media"><img class="d-flex mr-3" src="images/100x100.png" width=100 height=100 alt=""><div class="media-body"><h5>WEARNE, Jack</h5>Position : FACEM<br />Payroll ID: 10.04.17-14.04.17<br />FTE: 0.30</div></div>'
//     },
//     {
//         id: '3',
//         content: 'Giles, Andre'
//     },
//     {
//         id: '4',
//         content: 'NG, Lesley'
//     },
//     {
//         id: '5',
//         content: 'Mahani, Abbas'
//     },
//     {
//         id: '6',
//         content: 'Thornton, Neale'
//     }
//
// ];
//
//
// var subGroup = [
//     {
//         id: '100',
//         content: 'RL'
//     },
//     {
//         id: '101',
//         content: 'ADMIN'
//     },
//     {
//         id: '102',
//         content: 'MC'
//     },
//     {
//         id: '103',
//         content: 'PIT A'
//     },
//     {
//         id: '104',
//         content: 'PIT B'
//     },
//     {
//         id: '105',
//         content: 'Fast Track'
//     },
//     {
//         id: '106',
//         content: 'NC'
//     }
// ];

// Create a Timeline
var timeline = new vis.Timeline(container, items, options);

/**
 * Always listening to events
 */
jQuery(document).on('ready', function () {
    /**
     * Actions when submit button for the name 'addEvent' is clicked.
     */
    jQuery('form#addEvent').bind('submit', function (ev) {
        ev.preventDefault();
        var form = this;

        // Show / Hide range or point
        var eventType = document.getElementsByName("type");
        console.log(eventType[0].value); // range
        console.log(eventType[1].value); // point

        var endDate = document.getElementById("endDate");
        console.log(endDate.value);

        if (endDate.value === '') {
            this.type = 'point';
            eventType[1].checked = true;
        } else {
            this.type = 'range';
            eventType[0].checked = true;
        }


        // Modify item content to reflect style
        // var styleUsed = form.className.value.toUpperCase();
        // console.log(styleUsed);

        // Add item content to be the shift name
        // var shiftName = form.shiftName.value;
        // form.content.value = shiftName.toUpperCase();

        // todo: based on shift name, automatically select time range


        var jsonData = ConvertFormToJSON(form);
        // var jsonData = ConvertFormToJSON(array);


        $.ajax({
            type: "POST",
            url: baseURL + "api/event",
            data: jsonData,
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                console.log(data);
                console.log(jsonData);
                items.add(data);
            },
            error: function (data) {
                console.log(data);
                console.log(jsonData);
            }

        });
        $('form#addEvent')[0].reset();
        return true;
    });


    jQuery('form#getAllEvents').bind('submit', function (ev) {
        ev.preventDefault();
        var jsonData = {};
        var payloadTextArea = document.getElementById("payload");
        $.ajax({
            type: "GET",
            url: baseURL + "api/events",
            data: jsonData,
            dataType: "json",
            success: function (data) {
                var payload = JSON.stringify(data);
                console.log(payload);
                payloadTextArea.value = payload;

                items.clear();
                items.add(data);
                timeline.redraw();
                timelineA.redraw();
            },
            error: function (data) {
                console.log(data);
                console.log("error: " + jsonData);
            }
        })
    });

    jQuery('form#searchEvents').bind('submit', function (ev) {
        ev.preventDefault();
        var jsonData = {};
        var searchString = document.getElementById("searchString").value;
        var searchResult = [];
        // var patt = /w3schools/i;
        $.ajax({
            type: "GET",
            url: baseURL + "api/events",
            data: jsonData,
            dataType: "json",
            success: function (data) {
                var payload = JSON.stringify(data);
                console.log(payload);

                searchResult = searchContent(data, searchString);
                console.log(searchResult);
                for (var i = 0; i < searchResult.length; i++) {
                    displayResult(searchResult[i]);
                }

            },

            error: function (data) {
                console.log(data);
                console.log("error: " + jsonData);
            }
        })
    });


});

/**
 * Search JSON objects for a string inside content field
 *
 * @param data: JSON object
 * @param searchString: string
 * @returns Array: of object(s)
 */
function searchContent (data, searchString) {
    var escaped = escapeRegex(searchString);
    var regexString = new RegExp(escaped, "gi");
    var result = [];

    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        var arr = obj["content"];
        // for (var j = 0; j < arr.length; j++) {
        //     if (arr === searchString) {
            if (regexString.test(arr)) {
                console.log(obj);
                result.push(obj);
                // return obj;
            }
            // if (arr[j] === searchString) {
            //     console.log(obj);
            //     return obj;
            // }
        // }
    }
    return result;
}

/**
 * Prints out html for one JSON object result
 *
 * @param searchResult One JSON object
 */
function displayResult(searchResult) {
    var searchResultDiv = document.getElementById("searchResult");
    var startDateIs = searchResult["start"];
    var startDateIsQuotes = "'"+startDateIs+"'"; // need to put single quote around this date for link to work

    // todo: format start date to a more human readable format
    // todo: check if string is longer than substring length ? put ... : don't put ...
    // https://stackoverflow.com/questions/1265887/call-javascript-function-on-hyperlink-click?rq=1
    searchResultDiv.insertAdjacentHTML('afterend', "<p>Date: "+ startDateIs +"<br />Event: <a href=javascript:moveWindow("+startDateIsQuotes+")>" + searchResult["content"].substring(0, 25) + "...</a></p>");
}

/**
 * Move vis window according to date
 *
 * @param startDate: a string surrounded by single quotes
 */
function moveWindow(startDate) {
    var moveToOptions = {
        animation: {
            duration: 500,
            easingFunction: "easeInOutQuad"
        }
    };
    timeline.moveTo(startDate, moveToOptions);
    timelineA.moveTo(startDate, moveToOptions);
}

/**
 * Timeline  Navigation
 *
 * @param when: date to move which can be absolute or relative
 */
function gotoWhen(when) {
    var moveToOptions = {
        animation: {
            duration: 500,
            easingFunction: "easeInOutQuad"
        }
    };
    var currentWindowTime = timeline.getWindow();
    var start = currentWindowTime.start;
    var date = moment(start);
    var toAdd;
    var toSubtract;
    console.log(timeline.getWindow());
    if (when === 'today') {
        date = new Date();
    } else if (when === 'tenYearsB') {
        toSubtract = moment.duration(10, 'years');
        date.subtract(toSubtract);
    } else if (when === 'tenYearsF') {
        toAdd = moment.duration(10, 'years');
        date.add(toAdd);
    } else if (when === 'hundredYearsB') {
        toSubtract = moment.duration(100, 'years');
        date.subtract(toSubtract);
    } else if (when === 'hundredYearsF') {
        toAdd = moment.duration(100, 'years');
        date.add(toAdd);
    } else if (when === 'thousandYearsB') {
        toSubtract = moment.duration(1000, 'years');
        date.subtract(toSubtract);
    } else if (when === 'thousandYearsF') {
        toAdd = moment.duration(1000, 'years');
        date.add(toAdd);
    } else if (when === 'tenThousandYearsB') {
        toSubtract = moment.duration(10000, 'years');
        date.subtract(toSubtract);
    } else if (when === 'tenThousandYearsF') {
        toAdd = moment.duration(10000, 'years');
        date.add(toAdd);
    } else if (when === 'hundredThousandYearsB') {
        toSubtract = moment.duration(100000, 'years');
        date.subtract(toSubtract);
    } else if (when === 'hundredThousandYearsF') {
        toAdd = moment.duration(100000, 'years');
        date.add(toAdd);
    } else if (when === 'millionYearsB') {
        // fixme: million years not supported in momentjs/javascript/visjs?
        // https://stackoverflow.com/questions/8860297/can-you-create-dates-that-are-lower-than-271800-bc-like-dinosaur-time
        toSubtract = moment.duration(1000000, 'years');
        date.subtract(toSubtract);
        console.log(toSubtract);
    } else if (when === 'millionYearsF') {
        toAdd = moment.duration(1000000, 'years');
        date.add(toAdd);
        console.log(toAdd);
    }
    timeline.moveTo(date, moveToOptions);
}

/**
 * Serialize form data to JSON object and stringify
 *
 * @param form
 * @constructor
 */
function ConvertFormToJSON(form) {
    var array = jQuery(form).serializeArray();
    var json = {};

    jQuery.each(array, function () {
        json[this.name] = this.value || '';
    });

    return JSON.stringify(json);
}

function addEvent(itemObject) {
    delete itemObject.id;
    var jsonData = JSON.stringify(itemObject);

    $.ajax({
        type: "POST",
        url: baseURL + "api/event",
        data: jsonData,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            console.log(jsonData);
            items.add(data);
            timeline.redraw();
        },
        error: function (data) {
            console.log(data);
            console.log(jsonData);
        }
    });
}

function updateEvent(itemObject) {
    var itemID = itemObject.id;
    var jsonData = JSON.stringify(itemObject);
    $.ajax({
        type: "PUT",
        url: baseURL + "api/event/" + itemID,
        data: jsonData,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            console.log(jsonData);
            timeline.redraw();
        },
        error: function (data) {
            console.log(data);
            console.log(jsonData);
        }
    });
}

function getAllEvents() {
    var jsonData = {};
    $.ajax({
        type: "GET",
        url: baseURL + "api/events",
        data: jsonData,
        dataType: "json",
        success: function (data) {

            items.clear();
            items.add(data);
            timeline.redraw();
        },
        error: function (data) {
            console.log(data);
            console.log("error: " + jsonData);
        }
    });

    return jsonData;
}

function deleteItemDB(id) {
    $.ajax({
        type: "DELETE",
        url: baseURL + "api/event/" + id,
        data: null,
        dataType: "json",
        contentType: "application/json",
        success: function () {
            console.log("Removed item :" + id);
            timeline.redraw();
        },
        error: function (data) {
            if (data.status !== 200) {
                // the api returns nothing after deletion. So we check if the return status is OK
                console.log("Unsuccessful removal of item " + id);
                console.log(data);
            }
        }
    })
}

function hideEndDateDiv() {
    var endDateDiv = document.getElementById("endDateDiv");
    var startDateLabel = document.getElementById("startDateLabel");
    endDateDiv.style.display = 'none';
    startDateLabel.innerHTML = 'Date';
}
function showEndDateDiv() {
    var endDateDiv = document.getElementById("endDateDiv");
    var startDateLabel = document.getElementById("startDateLabel");
    endDateDiv.style.display = '';
    startDateLabel.innerHTML = 'Start Date';
}
function checkPoint() {
    var endDateDiv = document.getElementById("endDateDiv");
    var endDate = document.getElementById("endDate");
    if (endDate.value === '') {
        var eventType = document.getElementsByName("type");
        eventType[1].checked = true;
        hideEndDateDiv();
    }
}

/**
 * jQuery Date Time Picker
 *
 * http://xdsoft.net/jqplugins/datetimepicker/
 */
var dateTimePickerOptions = {
        format: 'Y-m-d',
        timepicker: false,
        allowBlack: false
};
jQuery('#startDate').datetimepicker(dateTimePickerOptions);
jQuery('#endDate').datetimepicker(dateTimePickerOptions);


/**
 * Log all visjs events
 */
items.on('*', function (event, properties) {
    logEvent(event, properties);
});
function logEvent(event, properties) {
    var log = document.getElementById('log');
    var msg = document.createElement('div');
    msg.innerHTML = 'event=' + JSON.stringify(event) + ', ' +
        'properties=' + JSON.stringify(properties);
    log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
}


/**
 * Pretty Prompts
 *
 * @param title
 * @param text
 * @param callback
 */
function prettyConfirm(title, text, callback) {
    swal({
        title: title,
        text: text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#DD6B55"
    }, callback);
}
function prettyPrompt(title, text, inputValue, callback) {
    swal({
        title: title,
        text: text,
        type: 'input',
        showCancelButton: true,
        inputValue: inputValue
    }, callback);
}

/**
 * Generate png file for the current visjs window
 */
function generateImage() {
    html2canvas(document.getElementById("visualization"), {
        background: '#fff',
        onrendered: function (canvas) {
            // var img = canvas.toDataURL('image/jpeg');
            // $('#saveImage').attr('href', img);

            // document.body.appendChild(canvas);

            var a = document.createElement('a');
            a.href = canvas.toDataURL("image/png");
            a.download = 'timetable.png'; // todo: generate filename with week/date
            a.click(); // todo: preview first before another button to download
        }
    });

}

/**
 * Escape string for use in dynamically generated regex
 *
 * @param s
 *
 * https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
 */
function escapeRegex (s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
