// Global variables
var baseURL = "http://localhost:8080/";
var optionMax;
var optionMin;
var optionZoomMin;
var visualizationId;
if (era === "cosmological") { // from -14,000,000,000 to -1,000,000
    optionMax = "-000001-01-01"; // 1 mya
    optionMin = "-014000-01-01"; // 14 bya
    optionZoomMin = 1000*60*60*24*365*10; // 1o years
    visualizationId = "visualizationC";
} else if (era === "ancient") {
    optionMax = "-000100-12-31"; // 100kya mya
    optionMin = "-001000-01-01"; // 1 mya
    optionZoomMin = 1000*60*60*24*365*100; // 100 year max zoom
    visualizationId = "visualizationA";
} else if (era === "now") {
    optionMax = "3000-01-01"; // 1 mya
    optionMin = "-100000-01-01"; // 100kya
    optionZoomMin = 1000*60*60*24*30*6; //220752000000; // 1 year max zoom //fixme
    visualizationId = "visualizationN";
}
var modifyThisEvent= document.getElementById("modifyThisEvent");
var addNewEventSection = document.getElementById("addNewEventSection");
var searchResultSection = document.getElementById("searchResultSection");
var searchResultDiv = document.getElementById("searchResultDiv");

var container;
var items;
var options;

modifyThisEvent.style.display = 'none';
searchResultSection.style.display = 'none';

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
    searchResultSection.style.display = 'block';
    var startDateIs = searchResult["start"];
    var startDateIsQuotes = "'"+startDateIs+"'"; // need to put single quote around this date for link to work
    startDateIs = moment(startDateIs).format('YYYY');

    // todo: format start date to a more human readable format
    // todo: check if string is longer than substring length ? put ... : don't put ...
    // https://stackoverflow.com/questions/1265887/call-javascript-function-on-hyperlink-click?rq=1
    //     searchResultDiv.insertAdjacentHTML('afterend',
    //     "<p>Event: <a href=javascript:moveWindow("+startDateIsQuotes+")>" + searchResult["content"].substring(0, 25) + "...</a><br />" +
    //     "Date: "+ startDateIs + " million years ago</p>");

    searchResultDiv.innerHTML += "<p>Event: <a href=javascript:moveWindow("+startDateIsQuotes+")>" + searchResult["content"].substring(0, 25) + "...</a><br />" +
        "<span class='small'>Date: "+ startDateIs + " million years ago</span> </p>";
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
    // todo: automatically zoom to appropriate level
}

/**
 * Triggers when an item is clicked
 *
 * @param properties: of an item on the timeline
 */
function onSelect (properties) {

    if (properties.items.length === 0) {
        addNewEventSection.style.display = 'block';
    }
    console.log(properties);
    var itemNum = parseInt(properties.items[0]); // only works with one item selected
    var jsonData = {};

    if (isNaN(itemNum)) {
        modifyThisEvent.style.display = 'none';
        return;
    }

    console.log('selected items: ' + itemNum);

    $.ajax({
        type: "GET",
        url: baseURL + "api/" + era + "Event/" + itemNum,
        data: jsonData,
        dataType: "json",
        beforeSend : function(xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader("Authorization", "Bearer " +  localStorage.token);
            } else {
                // Do not send request. Have to login.
            }
        },
        success: function (data) {
            var payload = JSON.stringify(data);
            modifyThisEvent.style.display = 'block';
            addNewEventSection.style.display = 'none';
            fillInData(data);
            console.log(payload);
        },
        error: function (data) {
            console.log(data);
        }
    })
}

/**
 * Fills in the form for editing clicked item
 *
 * @param payload: JSON object
 */
function fillInData(payload) {
    var itemIdS = document.getElementById("itemIdS");
    var contentS = document.getElementById("contentS");
    var typeRangedS = document.getElementById("typeRangedS");
    var typePointS = document.getElementById("typePointS");
    var startDateS = document.getElementById("startDateS");
    var endDateS = document.getElementById("endDateS");

    contentS.value = payload.content;
    if (payload.type === 'range') {
        typeRangedS.checked = true;
    } else {
        typePointS.checked = true;
    }
    startDateS.value = payload.start;
    endDateS.value = payload.end;
    itemIdS.value = payload.id;

    // submitEdittedItem(payload.id);
}

function hideEndDateDiv() {
    var endDateDiv = document.getElementById("endDateDiv");
    var endDateDivS = document.getElementById("endDateDivS");
    var startDateLabel = document.getElementById("startDateLabel");
    var startDateLabelS = document.getElementById("startDateLabelS");
    endDateDiv.style.display = 'none';
    endDateDivS.style.display = 'none';
    startDateLabel.innerHTML = 'Date';
}
function showEndDateDiv() {
    var endDateDiv = document.getElementById("endDateDiv");
    var endDateDivS = document.getElementById("endDateDivS");
    var startDateLabel = document.getElementById("startDateLabel");
    var startDateLabelS = document.getElementById("startDateLabelS");
    endDateDiv.style.display = '';
    endDateDivS.style.display = '';
    startDateLabel.innerHTML = 'Start Date';
}
function checkPoint() {
    var endDateDiv = document.getElementById("endDateDiv");
    var endDateDivS = document.getElementById("endDateDivS");
    var endDate = document.getElementById("endDate");
    var endDateS = document.getElementById("endDateS");
    if (endDate.value === '' || endDateS.value === '') {
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
// jQuery('#startDate').datetimepicker(dateTimePickerOptions);
// jQuery('#endDate').datetimepicker(dateTimePickerOptions);


/**
 * Log all visjs events

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
 */


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
    html2canvas(document.getElementById("visualizationA"), {
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


function closeSearch() {
    searchResultSection.style.display = 'none';
}

/**
 * Always listening to events
 */
jQuery(document).on('ready', function () {
    /**
     * Binds login form function.
     * Saves JWT token from backend to localStorage
     */
    jQuery('form#loginForm').bind('submit', function (ev) {
        ev.preventDefault();
        var form = this;
        var jsonData = ConvertFormToJSON(form);

        $.ajax({
            type: "POST",
            url: baseURL + "api/login",
            data: jsonData,
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                console.log(data);
                var JWTToken = data.token;
                JWTToken = JSON.stringify(JWTToken);
                JWTToken = JWTToken.replace(/"([^"]+(?="))"/g, '$1'); // removes double quotes around JWT
                localStorage.setItem('token', JWTToken); // write
                console.log(localStorage.getItem('token')); // read
                location.reload();
            },
            error: function (data) {
                console.log(data);
            }
        });
        return true;
    });

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

        var jsonData = ConvertFormToJSON(form);

        $.ajax({
            type: "POST",
            url: baseURL + "api/" + era + "Event",
            data: jsonData,
            dataType: "json",
            contentType: "application/json",
            beforeSend : function(xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader("Authorization", "Bearer " +  localStorage.token);
                } else {
                    // Do not send request. Have to login.
                }
            },
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
            url: baseURL + "api/" + era + "Events",
            data: jsonData,
            dataType: "json",
            beforeSend : function(xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader("Authorization", "Bearer " +  localStorage.token);
                } else {
                    // Do not send request. Have to login.
                }
            },
            success: function (data) {
                var payload = JSON.stringify(data);
                console.log(payload);
                payloadTextArea.value = payload;

                items.clear();
                items.add(data);
                timeline.redraw();
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
        var searchResultArray = [];
        $.ajax({
            type: "GET",
            url: baseURL + "api/" + era + "Events",
            data: jsonData,
            dataType: "json",
            beforeSend : function(xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader("Authorization", "Bearer " +  localStorage.token);
                } else {
                    // Do not send request. Have to login.
                }
            },
            success: function (data) {
                var payload = JSON.stringify(data);
                console.log(payload);

                searchResultArray = searchContent(data, searchString);
                console.log(searchResultArray);
                // Clear up existing  search result if present
                searchResultDiv.innerHTML = '';
                for (var i = 0; i < searchResultArray.length; i++) {
                    displayResult(searchResultArray[i]);
                }

            },
            error: function (data) {
                console.log(data);
                console.log("error: " + jsonData);
            }
        })
    });

    jQuery('form#modifyEvent').bind('submit', function (ev) {
        ev.preventDefault();
        var form = this;
        // var itemId = form[5].value;
        var itemId = document.getElementById("itemIdS").value;

        // del form[5];
        var jsonData = ConvertFormToJSON(form);

        console.log(jsonData);
        console.log(itemId);

        $.ajax({
            type: "PUT",
            url: baseURL + "api/" + era + "Event/" + itemId,
            data: jsonData,
            dataType: "json",
            contentType: "application/json",
            beforeSend : function(xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader("Authorization", "Bearer " +  localStorage.token);
                } else {
                    // Do not send request. Have to login.
                }
            },
            success: function (data) {
                console.log(data);
                console.log(jsonData);
                // items.clear();
                items.add(data);
                timeline.redraw();
            },
            error: function (data) {
                console.log(data);
                console.log(jsonData);
            }

        });
    });

    var authDiv = document.getElementById("authDiv");
    if (localStorage.getItem('token') === null) {
        authDiv.innerHTML = "<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#loginModal'>Login</button>";
    } else {
        authDiv.innerHTML = "<button type='button' class='btn btn-primary' data-toggle='modal' onclick='return logout();'>Logout</button>";
    }

});

function addEvent(itemObject) {
    delete itemObject.id;
    var jsonData = JSON.stringify(itemObject);

    $.ajax({
        type: "POST",
        url: baseURL + "api/" + era + "Event",
        data: jsonData,
        dataType: "json",
        contentType: "application/json",
        beforeSend : function(xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader("Authorization", "Bearer " +  localStorage.token);
            } else {
                // Do not send request. Have to login.
            }
        },
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
        url: baseURL + "api/" + era + "Event/" + itemID,
        data: jsonData,
        dataType: "json",
        contentType: "application/json",
        beforeSend : function(xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader("Authorization", "Bearer " +  localStorage.token);
            } else {
                // Do not send request. Have to login.
            }
        },
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

    console.log(localStorage.getItem('token')); // read

    $.ajax({
        type: "GET",
        url: baseURL + "api/" + era + "Events",
        data: jsonData,
        dataType: "json",
        beforeSend : function(xhr) {
            // set header if JWT is set
            if (localStorage.token) {
                xhr.setRequestHeader("Authorization", "Bearer " +  localStorage.token);
            } else {
                // refuse to send
                console.log("No token in localStorage");
            }
        },
        success: function (data) {
            items.clear();
            items.add(data);
            timeline.redraw();
            console.log(data);
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
        url: baseURL + "api/" + era + "Event/" + id,
        data: null,
        dataType: "json",
        contentType: "application/json",
        beforeSend : function(xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader("Authorization", "Bearer " +  localStorage.token);
            } else {
                // Do not send request. Have to login.
            }
        },
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

function searchEvents () {
    var jsonData = {};
    var searchString = document.getElementById("searchString").value;
    var searchResult = [];
    $.ajax({
        type: "GET",
        url: baseURL + "api/" + era + "Events",
        data: jsonData,
        dataType: "json",
        beforeSend : function(xhr) {
            if (localStorage.token) {
                xhr.setRequestHeader("Authorization", "Bearer " +  localStorage.token);
            } else {
                // Do not send request. Have to login.
            }
        },
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
}

// Instantiate Bootstrap 4 tooltip
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

function logout() {
    localStorage.clear('token');
    location.reload();
}