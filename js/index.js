/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function() {
        phonegapReady();
    }
};

//line created to force gitshell to notice update after encoding change

//this function is called once the 'deviceready' event has been fired
function phonegapReady() {

$(document).ready(function(){
    
    //the #mCont dom element is saved here in runOnLoad
    var menu;
    //the #bCont dom element is saved here in runOnLoad
    var body;
    //the #modalCont dom element is saved here in runOnLoad
    var modalW;
    //keeps track of whether an myShifts has been updated in this session
    var myShiftsFirstUpdate = true;
    //keeps track of whether an possibleShifts has been updated in this session
    var possibleShiftsFirstUpdate = true;
    //a listener for ajax queries is saved here in runOnLoad
    var ajaxWatch;
    
    //this must be the first function, so that the JS instantiates properly
    $(function runOnLoad(){
        
        //needed to show the NemVagt logo on top of all screens
        showLogo();
        //instantiates var menu, that will need to be on every page.
        menu = $("#mCont");
        //instantiates var body, that will be used on every page.
        body = $("#bCont");
        //instantiates var modalW, that will be used on most pages.
        modalW = $("#modalCont");
        //creates listeners for ajaxStart/ajaxStop
        ajaxWatch = ajaxWatch();
        
        //next two lines were added here to test the changeCollapseIcon function...
        //colBtn = document.getElementById("collapseBtn");
        //colBtn.addEventListener("click", changeCollapseIcon);
        
        //added to immediately give us a menu on all pages; We don't want to show the menu before the login has been accepted.
        //showMenu();
        
        //added here for testing purposes... this might be the right place for it after all...
        hasSavedLogin();
        checkConnection();
        
//        //added here for testing purposes...
//        showMyShifts();
        
//        //added to open the login screen first, might be deprecated because of "hasSavedLogin()"...
//        showLogin();
        
        //added here for testing purposes...
        //showUserProfile();
        
    });
    
    //for testing purposes...
//    $("#testAJAXBtn").on("click", hasSavedLogin);
//    $("#testCleanMem").on("click", cleanStorage);
//    $("#testCleanBody").on("click", cleanBody);
//    function cleanBody() {
//        body.empty();
//    };
    
    //object to save the autoupdate of the myShifts to, autoupdateMyShifts is added to the variable at the end of the populateMyShifts method if it is still undefined
    var jsonUpdateMyShiftsObj;
    function autoupdateMyShifts() {
        setInterval(function() {
            if(checkConnection()) {
                var url = "https://"+ getFromStorage("domain") +".nemvagt.dk/ajax/app_myshifts";
                //also needs to post a pswHash?
                var infoArr = {userid:getFromStorage("userId")}; //what to post, once I I need to POST a pswHash, do it here.
                var ajaxReq = postAJAXCall(url, infoArr, false); //false sets the global option to false, meaning the request will be invisible to the ajaxStart/ajaxStop.
                ajaxReq.done(saveToStorange("savedBookedShifts", JSON.stringify(this)));
            };
        }, 150000);
    };
    //object to save the autoupdate of the possibleShifts to, autoupdatepossibleShifts is added to the variable at the end of the populateMyShifts method if it is still undefined
    var jsonUpdatePossibleShiftsObj;
    function autoupdatePossibleShifts() {
        setInterval(function() {
            if(checkConnection()) {
                var url = "https://"+ getFromStorage("domain") +".nemvagt.dk/ajax/app_myshiftplan";
                //also needs to post a pswHash?
                var infoArr = {userid:getFromStorage("userId")}; //what to post, isn't really needed except that we need to pass Something into parameter placement of infoArr, since we need to set global to false...
                var ajaxReq = postAJAXCall(url, infoArr, false); //false sets the global option to false, meaning the request will be invisible to the ajaxStart/ajaxStop.
                ajaxReq.done(saveToStorange("savedPossibleShifts", JSON.stringify(this)));
            };
        }, 150000);
    };
    
    //finds out if we already have a login stored, if so it logs in, if not, we're sent to login...
    function hasSavedLogin() {
        if(getFromStorage("pswHash") !== null) {
            
            //this is needed to retrieve saved info from 
            var loginInfo = {usr:getFromStorage("email"), pswhash:getFromStorage("pswHash"), remember:1};
            var domain = getFromStorage("domain");
            //for testing purposes...
//            body.append("<p>saved email: "+ loginInfo.usr +"</p>");
//            body.append("<p>saved pswhash: "+ loginInfo.pswhash +"</p>");
//            body.append("<p>saved psw: "+ loginInfo.psw +"</p>");
            if(checkConnection()) { //if online, this will evaluate true, making the app attempt to log on
                //needed to attempt an automatic AJAX login.
                $.ajax({ //this function has it's own AJAX call because it wasn't worth the time to standardize it and loginEvaluator expects dataType: "text" instead of JSON...
                    type: "POST",
                    url: "https://"+ domain +".nemvagt.dk/ajax/login",
                    dataType: "text",
                    data: loginInfo//,
    //                success: function(data) {
    //                    //each is only here for testing purposes
    ////                    $(body).append("<p>JSON output from hasSavedLogin:</p>");
    ////                    $.each($.parseJSON(userInfoHash), function(index, value) {
    ////                        $(body).append("<p>"+ index +": "+ value +"</p>");
    ////                    });
    //                },
    //                error: function() {
    //                    //$(body).append("<p>Something went wrong in hasSavedLogin() AJAX call</p>");
    //                }
                }).done(function(data) {
                    //
    //                $(body).append("<p>Done was reached in hasSavedLogin()</p>");
    //                $(body).append("<p>usr - returned JSON VS saved: "+ $.parseJSON(userInfoHash).email +" : "+ loginInfo.usr +"</p>");
                    loginEvaluater(data, loginInfo.usr, domain);
                });
            }else {
                showMenu();
                showMyShifts();
            };
            
        }else {
//            $(body).append("<p>Else was reached in hasSavedLogin()</p>");
            //cleans localStorage, when no pswHash was found, to make sure there is no "old dirt"...
            localStorage.clear();
            showLogin();
        };
    };
    
    //shows the login screen
    function showLogin() {
        $(body).empty();
        
        $(body).append('<h1 class="page-header">NemVagt Login</h1>');
        //the submit btn should be set to .disabled, unless all required fields are filled with data.
        $(body).append('<form id=loginForm role="form" method="post" action="" >\
    <label for="domain">Forenings Domæne</label>\
<div class="input-group form-group">\
    <span class="input-group-addon">'+ 'https://' +'</span>\
    <input value="mobiludvikling" type="url" name="domain" class="form-control" placeholder="festival">\
    <span class="input-group-addon">'+ '.nemvagt.dk' +'</span>\
</div>\
<div class="form-group">\
    <label for="email">Din E-mail</label>\
    <input value="rasmus@nemvagt.dk" type="email" class="form-control" id="email" name="usr" placeholder="navn@dinEmail.com">\
</div>\
<div class="form-group">\
    <label for="password">Password</label>\
    <input value="FedPraktik5440" type="password" id="password" name="psw" class="form-control" placeholder="Dit password">\
</div>\
<input type="submit" id="loginBtn" value="Login" class="btn btn-success btn-lg" >\
</form>');
        
        //we need this to override and handle the onclick event for the login form
        $("#loginBtn").on("click", function(event) {
            //localStorage.removeItem("pswHash"); //removes the given key from localStorage...
            event.preventDefault();
            
            //only try to login if we have an internet connection, notify user if there is no connection
            if(checkConnection()) {
                var form = $("#loginForm");
                var email = $('input[name=usr]').val();
                var domain = $('input[name=domain]').val();
                var returnedData;
                if(domain !== "") {
                    $.ajax({ //this function has it's own AJAX call because it wasn't worth the time to standardize it and loginEvaluator expects dataType: "text" instead of JSON...
                    type: form.attr("method"),
                    url: "https://"+ domain + ".nemvagt.dk/ajax/login",
                    dataType: "text",
                    data: form.serialize() + "&remember=1",
                    success: function(data) {
                        returnedData = data;
                        //only here for testing purposes
    //                    $.each($.parseJSON(data), function(index, value) {
    //                        $(body).append("<p>"+ index +": "+ value +"</p>");
    //                    });
                    },
                    error: function() {
                        $(body).append("<p>Something went wrong in AjaxCall from showLogin()</p> <br>"+"<p>status: "+ error.status + "; readyState: " + error.readyState +"; statusText: "+ error.statusText +"; responseText:"+ error.responseText +";</p>");
                    }
                    }).done(function() {
                        loginEvaluater(returnedData, email, domain);
                    });
                }else {
                    //$(body).empty();
                    //$(body).append("<h3>Husk at udfylde \"Forenings domæne\"</h3>");
                    //setTimeout(showLogin, 4000);
                    notificationModal("Manglende udfyldning", "<p>Husk at udfylde \"Forenings domæne\"</p>");
                };
            }else {
                notificationModal("Ingen internet forbindelse", "<p>Der er ingen forbindelse til internettet og du har ikke et gemt login på telefonen,<br>opret forbindelse til internettet for at logge ind.</p>");
            };
        });
    };
    
    //this method evaluates/handles login attempts
    //it requires userInfo(JSON in string format), email(an emails address in string format), domain(the name of the domain, fx mobiludvikling)
    function loginEvaluater(userInfo, email, domain) {
        //simply eval whether the server accepted the login data, then either have the user remain on the login screen (but append a message that tells them their input was wrong)
        //OR send them to "Mine vagter".
        if(email === $.parseJSON(userInfo).email && email !== undefined && $.parseJSON(userInfo).email !== undefined) {
            saveToStorage("pswHash" ,$.parseJSON(userInfo).pswhash);
            saveToStorage("email", $.parseJSON(userInfo).email);
            saveToStorage("userId", $.parseJSON(userInfo).id);
            saveToStorage("domain", domain);
            
            showMenu();
            showMyShifts();
        }else {
            localStorage.clear();
            notificationModal("Forkert udfyldning", "<p>Noget var udfyldt forkert!</p>");
        };
    };
    
    //shows the "Mine vagter" page
    function showMyShifts() {
        $(body).empty();
        if(checkConnection()) {
            //actually show shifts here, we need to get the shifts from the server and then create a method that finds out how many shifts are there, what data they contain, then populate.
            //when creating shifts, dynamically add an event listener to every shift here... this is already done further down in the code...
            if(myShiftsFirstUpdate === true) { //checks to see if this is the first time we've opened "myShifts" this time we're using the program, if it is, we'll get JSON from the server
                //sets myShiftsFirstUpdate to false, so that we will no longer update from internet whenever we navigate to page...
                myShiftsFirstUpdate = false;
                //tells us what to POST
                var toPost = {userid:getFromStorage("userId")};
                //tells us where to POST to
                var url = "https://"+ getFromStorage("domain") +".nemvagt.dk/ajax/app_myshifts";
                //get the shifts that the person has already voluntered for
                var ajaxCall = postAJAXCall(url, toPost);
                ajaxCall.done(function(data) {
    //                if(data!==undefined){ //if succcess was reached in the postAJAXCall function, "data" is returned...
    //                    //save the shifts to local storage, so they can be reused w/o having to make the AJAX call again
    //                    saveToStorage("savedBookedShifts", JSON.stringify(data));
    //                    populateMyShifts(data);
    //                }else { //on error
    //                    //if we fail to get JSON, get it locally
    //                    //$(body).append("<p>Something went wrong with myShift first AJAX call</p>");
    //                    notificationModal("OBS, kunne ikke hente fra nettet", "Henter \"Vagter\" fra telefonens hukommelse, data kan være forældet.");
    //                    var myBookedShifts = $.parseJSON(getFromStorage("savedBookedShifts"));
    //                    setTimeout(modalW.empty(),3000);
    //                    setTimeout(populateMyShifts(myBookedShifts),3100);
    //                }
                    populateMyShifts(ajaxSuccesEvaluator("savedBookedShifts", "Mine vagter", data));
                });
            }else { //we already have a pretty recent version of the JSON, so get JSON from localStorage, as this is much faster than the internet.
                //retrieves the booked shifts
                populateMyShifts(JSON.parse(getFromStorage("savedBookedShifts")));
                //we used to use this, but the ajaxSuccesEvaluator will notify that the data is being collected from memory, which it shouldn't...
                //populateMyShifts(ajaxSuccesEvaluator("savedBookedShifts", "Mine vagter"));
            };
        }else { //this is reached if the device is offline
            populateMyShifts(ajaxSuccesEvaluator("savedBookedShifts", "Mine vagter"));
        };

//        THE REST OF THIS METHOD IS DEPRECATED, BUT KEPT AROUND FOR NOW AS REFERENCE, TO MAKE SURE I STILL HAVE IT IF I WAS TO RUN INTO AN UNEXPECTED ERROR
//        
//        var toPost = {userid:getFromStorage("userId")};
//        var domain = getFromStorage("domain");
//        //get the shifts that the person has already voluntered for
//        $.ajax({
//            type: "POST",
//            url: "https://"+ domain +".nemvagt.dk/ajax/app_myshifts",
//            dataType: "JSON",
//            data: toPost,
//            success: function(data) {
//               //save the shifts to local storage, so they can be reused w/o having to make the AJAX call again
//               saveToStorage("savedBookedShifts", JSON.stringify(data));
//            },
//            error: function() {
//                $(body).append("<p>Something went wrong with myShift AJAX call</p>");
//            }
//        }).done(function(data) {
//            
//            //a title, so that people know where they are
//            $(body).append('<h1 class="page-header">Mine vagter fra '+/* indæƒÂ¦t organisations navn +*/'</h1>');
//            
//            //we need this to iterate through the array of JSON objects
//            for (var i = 0; i < data.length; i++) {
//                //assign the current object containing JSON to the object var, so that I only need to write it once
//                var object = data[i];
//                
////                //a string that will contain all the details to be added
////                var details = '';
////                //iterate through the object and get all properties that aren't null, then add them to the details string above, so we can add them all in the "$(body).append" below
////                for (var property in object) {
////                    if(object[property] !== null){
////                        details += "<p>"+ property +": "+ object[property] +"</p>";
////                    };
////                };
////                $(body).append(details);
//                
//                //checks to see if there is a role, then adds them to the var roller, which is added to the $(body).append() below.
//                var roller = '';
//                if(object["roles"]!== undefined) { //right now, roles isn't passed to me at all. Speak to Mark about this...
//                    roller = '"<p>Roller: '+ object["roles"] +'</p>"';
//                }
//                
//                //adds a title to the shift, if one is provided
//                var title = '';
//                if(object["title"] !== "") {
//                    title = '<h4 class="pull-left">'+ object.title +'</h4>';
//                };
//                
//                //adds a button to unbook the shift to the shift, if the option is provided
//                var unbookBtn = '';
//                if(object["allowdelete"] === true) {
//                    unbookBtn = '<button class="btn pull-right margBotBtn unbookBtn">Afmeld vagt</button>'; //kendte/havde Mark måske et wastebasket/trashcan icon?
//                    //a listener is added after it has been appended to body (if object[allowdelete] is true)
//                };
//                
//                $(body).append('<div class="container shift" style="border: solid black 1px; margin-bottom: 5vmin;">\
//                    <div>\
//                        '+ title +'\
//                        <button id="'+ object["id"] +'" style="margin-bottom: 1vmin; margin-right: -1vmin; margin-top: 3vmin;" type="button" class="btn readMoreBtn pull-right">Vis mere</button>\
//                        <h4 style="clear:left;" class="pull-left">'+ getWeekday(object["startdate"]) +' '+ getDate(object["startdate"]) +' <!--'+
//                            'Kl: '+ object["starttime"].substring(0,5) +' til '+ object["endtime"].substring(0,5)  +'--></h4>\
//                    </div>\
//                    <div style="clear: both;">\
//                        <p>Kl: '+ object["starttime"].substring(0,5) +' til '+ object["endtime"].substring(0,5) +'</p>\
//                        '+ unbookBtn +'\
//                        '+ roller +'\
//                    </div>\
//                </div>');
//                
//                //code for collapsible shifts...
//                /*$(body).append('<div class="container" style="border: solid black 1px; margin-bottom: 5vmin;">\
//                    <div>\
//                        <h4 style="float: left;">'+ object["startdate"].substring(8,10) +'/'+ object["startdate"].substring(5,7) +' - '+ object["startdate"].substring(0,4) +'</h4>\
//                        <button id="collapseShiftBtn'+ i +'" style="float: right; margin-bottom: 1vmin; margin-top: 1vmin;" type="button" class="btn collapseBtn" data-toggle="collapse" data-target="#collapseShift'+ i +'">+</button>\
//                    </div>\
//                    <div id="collapseShift'+ i +'" class="collapse" style="clear: both;">\
//                        '+ details +'\
//                    </div>\
//                </div>');*/
//            };
            
//        $(".readMoreBtn").on("click", showDetails);
//
//        //adds a listener to the unbookShift buttons
//        $(".container").closest(".container").find(".unbookBtn").on("click", showModalView);
//
//        //testing, related to jumping to a specific shift after pressing return from details...
////            $(body).append('<a href="#mCont">Link til mCont</a>'); //virker
////            $("scrollToTest").on("click", function() {
////               window.scrollTo(0, 0); //scrollTo doesn't seem to work in phonegap...
////                
////            });
//
//        //code for collapsible shifts...
//        /*//can show all the returned JSON, for testing purposes...
//        $(body).append("<p>JSON output from myShifts:</p>");
//        for (var i = 0; i < data.length; i++) {
//            var object = data[i];
//            for (var property in object) {
//                $(body).append("<p>"+ property +" : "+ object[property] +"</p>");
//            }
//        };
//
//        //allows the collapseBtn to see if its collapse if shown/hidden and change its own html accordingly
//        $('div.collapse').on('shown.bs.collapse', function () {
//            //we need this to change the html of the btn
//            $(this).closest("div.container").find("button").html("&minus;");
//        }).on('hidden.bs.collapse', function () {
//            //we need this to change the html of the btn
//            $(this).closest("div.container").find("button").html("+");
//        })".collapse({toggle: true})" this function is needed, ONLY if they should be .collapse-in initially, w/o this function, it will always collapse-in first time it's clicked,
//          since it seems the class's collapsible functionaluty isn't applied until needed, so the button wont change to reflect that it's open either, unless this method is called...;
//        });*/
//        if(jsonUpdateMyShiftsObj === undefined) { //starts an autoupdate timer for the myShifts JSON.
//            jsonUpdateMyShiftsObj = autoupdateMyShifts();
//        };
//    });
    };
    //is used twice by showMyShifts to actually populate the DOM, the parameter is a JSON array with shifts...
    function populateMyShifts(myBookedShifts) {
        
        //a title, so that people know where they are
        $(body).append('<h1 class="page-header">Mine vagter</h1>');
        
        //we need this to iterate through the array of JSON objects
        for (var i = 0; i < myBookedShifts.length; i++) {
            //assign the current object containing JSON to the object var, so that I only need to write it once
            var object = myBookedShifts[i];
            
            //checks to see if there is a role, then adds them to the var roller, which is added to the $(body).append() below.
            var roller = '';
            if(object["roles"]!== undefined) { //right now, roles isn't passed to me at all. Speak to Mark about this...
                roller = '"<p>Roller: '+ object["roles"] +'</p>"';
            }

            //adds a title to the shift, if one is provided
            var title = '';
            if(object["title"] !== "") {
                title = '<h4 class="pull-left">'+ object.title +'</h4>';
            };

            //adds a button to unbook the shift to the shift, if the option is provided
            var unbookBtn = '';
            if(object["allowdelete"] === true) {
                unbookBtn = '<button class="btn btn-danger pull-right margBotBtn unbookBtn" style="margin-right: -1vmin;">Afmeld vagt</button>'; //kendte/havde Mark måske et wastebasket/trashcan icon?
                //a listener is added after it has been appended to body
            };

            $(body).append('<div class="container shift" style="border: solid black 1px; margin-bottom: 5vmin;">\
                <div>\
                    '+ title +'\
                    <button id="'+ object["id"] +'" style="margin-bottom: 1vmin; margin-right: -1vmin; margin-top: 3vmin;" type="button" class="btn bookedDetailsBtn btn-default readMoreBtn pull-right">Vis mere</button>\
                    <h4 style="clear:left;" class="pull-left">'+ getWeekday(object["startdate"]) +' '+ getDate(object["startdate"]) +' <!--'+
                        'Kl: '+ object["starttime"].substring(0,5) +' til '+ object["endtime"].substring(0,5)  +'--></h4>\
                </div>\
                <div style="clear: both;">\
                    <p>Kl: '+ object["starttime"].substring(0,5) +' til '+ object["endtime"].substring(0,5) +'</p>\
                    '+ unbookBtn +'\
                    '+ roller +'\
                </div>\
            </div>');
            
        };
        //adds a listener to the readMore button, so that people can open details
        $(".readMoreBtn").on("click", showMyShiftDetails);
        //adds a listener to the readMore button, so that it updates all the JSON while people are busy reading about a shifts details... THIS MEANS SEVERAL AJAX CALLS MAY BE MADE IN A VERY SHORT TIME, ONCE AFTER THE OTHER, IT MIGHT BE PRUDENT TO FIND A SOLUTION FOR THIS
        $(".readMoreBtn").on("click", updateAllListsReadMoreBtnHandler);
        //adds a listener to the unbookShift buttons, so what they can open the modal dialog window, allowing them to unbook the shift
        $(".container").closest(".container").find(".unbookBtn").on("click", showModalView);
        
        //starts an autoupdate timer for the myShifts JSON.
        if(jsonUpdateMyShiftsObj === undefined) {
            jsonUpdateMyShiftsObj = autoupdateMyShifts();
        };
    };

    //shows showPossibleShifts
    function showPossibleShifts() {
        $(body).empty();
        if(checkConnection()) {
            //actually show possible shifts here shifts here, we need to get the shifts from the server and then create a method that finds out how many shifts are there, what data they contain, then populate.
            //when creating shifts, dynamically add an event listener to every shift here... this is already done further down in the code...
            if(possibleShiftsFirstUpdate === true) { //checks to see if this is the first time we've opened "myShifts" this time we're using the program, if it is, we'll get JSON from the server
                //sets possibleShiftsFirstUpdate to false, so that we will no longer update from internet whenever we navigate to page...
                possibleShiftsFirstUpdate = false;
                //tells us what to POST, strictly speaking not needed, as postAJAXCall automatically adds userid and pswhash...
                var toPost = {userid:getFromStorage("userId")};
                //tells us where to POST to
                var url = "https://"+ getFromStorage("domain") +".nemvagt.dk/ajax/app_myshiftplan";
                //get the shifts that the person can volunteer for
                var ajaxCall = postAJAXCall(url, toPost);
                ajaxCall.done(function(data) {
                    populatePossibleShifts(ajaxSuccesEvaluator("savedPossibleShifts", "Ledige vagter", data));
                });
            }else { //we already have a pretty recent version of the JSON, so get JSON from localStorage, as this is much faster than the internet.
                //retrieves the possible shifts
                populatePossibleShifts(JSON.parse(getFromStorage("savedPossibleShifts")));
                //we used to use this, but the ajaxSuccesEvaluator will notify that the data is being collected from memory, which it shouldn't...
                //populateMyShifts(ajaxSuccesEvaluator("savedPossibleShifts", "Ledige vagter"));
            };
        }else { //this is reached if the device is offline
            populatePossibleShifts(ajaxSuccesEvaluator("savedPossibleShifts", "Ledige vagter"));
        };
    };
    //is used by showPossibleShifts to actually populate the DOM
    function populatePossibleShifts(possibleShifts) {
        //it may be that I can make "populateMyShifts" more general and leave out this method completely, simply calling populateMyShifts instead(if so, rename it to populateShifts)...
        //I've decided against rewriting populateMyShifts, as it wouldn't save many lines of code and would consume slightly more resources.
        //(quite a few conditional statements, taking up lines of code saved and it means the phone will have to perform more evaluations)
        
        //a title, so that people know where they are
        $(body).append('<h1 class="page-header">Ledige vagter</h1>');
        
        //we need this to iterate through the array of JSON objects
        for (var i = 0; i < possibleShifts.length; i++) {
            //assign the current object containing JSON to the object var, so that I only need to write it once
            var object = possibleShifts[i];
            
//            // TEST
//            $("#UI_ELEMENT_TEST").append("<p>"+ possibleShifts.length +"</p>");
//            for(var prop in object) {
//                $("#UI_ELEMENT_TEST").append("<p>"+ prop +": "+ object[prop] +"</p>");
//            };
            
            //if visible, go ahead and show the shift (it shouldn't be necessary to do this, but Mark wanted to make sure no shift would be shown if visible isn't true, I shouldn't receive such a shift, but better safe than sorry, so he asked for this conditional...
            if(object["visible"]) {
                //checks to see if there is a role, then adds them to the var roller, which is added to the $(body).append() below.
                var roller = '';
                if(object["roles"]!== undefined) { //right now, roles isn't passed to me at all. Speak to Mark about this... Also, maybe it should be a radial input when dealing with possible shifts
                    roller = '"<p>Roller: '+ object["roles"] +'</p>"';
                };
                
                //adds a title to the shift, if one is provided
                var title = '';
                if(object["appshifttitle"] !== undefined && object["appshifttitle"] !== null && object["appshifttitle"] !== "") {
                    title = '<h4 class="pull-left">'+ object["appshifttitle"] +'</h4>';
                };
                
                //breaks up the "start" attribute of the object, as this contains both the start date AND the start time
                var startArr = object["start"].split("T");
                var startDate = startArr[0];
                var startTime = startArr[1].substring(0,5);
                //breaks up the "end" attribute of the object, as this contains both the end date AND the end time
                var endArr = object["end"].split("T");
                //var endDate = endArr[0]; //currently, we don't output the endDate, so this var isn't currently needed...
                var endTime = endArr[1].substring(0,5);
                
                //calculates how many freeSpaces we have in the shift
                var freeSpaces = parseInt(object["maxmembers"])-parseInt(object["taken"]);
                
                //adds a button to book the shift, to the shift
                var bookBtn = '';
                if(freeSpaces > 0) {
                    bookBtn = '<button class="btn btn-success pull-right margBotBtn bookBtn" style="margin-right: -1vmin;">Tag vagt</button>';
                };
                //a listener is added after it has been appended to body
                
                //adds a button to show details for the shift, only do so if there is any notes...
                var readMoreBtn = '';
                if(object["shiftnotes"] !== '' && object["shiftnotes"] !== null && object["shiftnotes"] !== undefined) {
                    readMoreBtn = '<button id="'+ object["id"] +'" style="margin-bottom: 1vmin; margin-right: -1vmin; margin-top: 3vmin;" type="button" class="btn btn-default readMoreBtn pull-right">Vis mere</button>';
                };
                //a listener is added after it has been appended to body
                
                //gives the shift a color type, if it has one
                var shiftColor = '';
                if(object["color"] !== null && object["color"] !== undefined) {
                    shiftColor = '<div style="clear: both; margin-left: -4.1vmin; heigth: 5px; width: 110%; border-top-right-radius: 4px; border-top-left-radius: 4px; background-color:'+ object["color"] +';"><br></div>';
                };
                
                $(body).append('<div class="container shift" style="overflow: hidden; border: solid black 1px; margin-bottom: 5vmin;">\
                '+ shiftColor +'\
                    <div>\
                        '+ title +'\
                        '+ readMoreBtn +'\
                        <h4 style="clear:left;" class="pull-left">'+ getWeekday(startDate) +' '+ getDate(startDate) +'</h4>\
                    </div>\
                    <div style="clear: both;">\
                        <p>Kl: '+ startTime +' til '+ endTime +'</p>\
                        <p>Ledige pladser: '+ freeSpaces +'</p>\
                        '+ roller +'\
                        '+ bookBtn +'\
                    </div>\
                </div>');
            };
        };
        
        //adds a listener to the readMore button, so that people can open details
        $(".readMoreBtn").on("click", showPossibleShiftDetails);
        //adds a listener to the readMore button, so that it updates all the JSON while people are busy reading about a shifts details... This is on a X(30) second timer
        $(".readMoreBtn").on("click", updateAllListsReadMoreBtnHandler);
        //adds a listener to the unbookShift buttons, so what they can open the modal dialog window, allowing them to unbook the shift
        $(".container").closest(".container").find(".bookBtn").on("click", showModalView);
        
        //starts an autoupdate timer for the possibleShifts JSON.
        if(jsonUpdatePossibleShiftsObj === undefined) {
            jsonUpdatePossibleShiftsObj = autoupdatePossibleShifts();
        };
    };
    
    //iterates through a collection of shifts, evaluates which one we want and populates a detail window
    function showMyShiftDetails() {
        
        //gets the id from the button, the button's id is equal to the id of the shift in the JSON...
        var theShift = $(this).attr("id");
        
        //the type of shift, booked or possible, true === a booked shift; false === a possibleShift
        //var shiftType = $(this).hasClass("bookedDetailsBtn");
        
        //has the admin allowed the user to delete the booked shift? if not, the button option to do so wont be shown...
        var allowDelete;
        
        //is set to true if the shift is already booked, false if the shift hasn't been booked by the user yet...
        //this var is also used by the back button, to evaluate if it should return you to showMyShifts or showPossibleShifts.
        //var isBooked; may not need this anymore
        
        $(body).empty();
        
        //if the shiftType is true, it's a bookedShift
        //if(shiftType) {
            //retrieves the booked shifts
            var theShifts = $.parseJSON(getFromStorage("savedBookedShifts"));
        //}else {
            //retrieves the possibleshifts shifts
            //var theShifts = $.parseJSON(getFromStorage("savedPossibleShifts"));
        //};
        //iterates through shifts already booked by the user
        for (var i = 0; i < theShifts.length; i++) {
            //assign the current object containing JSON to "var object", so that I only need to write it once
            var object = theShifts[i];

            //strings that will contain some of the values retrieved from the shift's JSON, making it easy to arrange them when appending them to the body later on
            var date = '';
            var notes = '';
            var title = '';
            var startTime = '';
            var endTime = '';
            var roles = '';
            var city = '';
            var address = '';

            //Checks to see if the id of the shift, from the JSON is equal to the id of the shift we want
            if(object["id"] === theShift) {
                //evaluates if the admin has allowed deletion, is needed to know whether it's okay to delete outside the scope of this for loop
                allowDelete = object["allowdelete"];

                /*//iterate through the object and get all properties that we want, then add them to the details string above, so we can add them all in the "$(body).append" below
                for (var property in object) {
                    //the properties we want is: title, day, date, starttime, endtime, roles(form/dropdown/radio), address, city, notes
                    if(property === "title" && object[property] !== "" && object[property] !== null) { //if title isn't === "" or null, var title = title from the JSON
                        title += "<p>"+ "Titel" +": "+ object[property] +"</p>";
                    }else if(property === "notes" && object[property] !== "" && object[property] !== null) { //if notes aren't null or "", var notes = notes from JSON
                        notes += "<label for=\"notesField\">"+ "Noter fra administrator" +":</label> <div id=\"notesField\" class=\"shift\" style=\"padding:2vmin; margin-bottom:3vmin; border:solid black 1px\"><p>"+ object[property] +"</p></div>";
                    }else if(property === "startdate" && object[property] !== null) { //if startdate is not null, var date = a formatted startdate
                        date += "<p>"+ "Dato" +": "+ getWeekday(object[property]) +" "+ getDate(object[property] +"</p>");
                    }else if(property === "starttime" && object[property] !== null) { //if starttime is not null, var startTime = a formatted startime
                        startTime += "<p>"+ "Starttid" +": "+ object[property].substring(0,5) +"</p>";
                    }else if(property === "endtime" && object[property] !== null) { //if endtime is not null, var endTime = a formatted endtime
                        endTime += "<p>"+ "Sluttid" +": "+ object[property].substring(0,5) +"</p>";
                    }else if(property === "roles" && object[property] !== null) { //if roles is not null, var roles = roles from JSON //right now, I apparently don't receive roles...
                        roles += "<p>"+ "Rolle" +": "+ object[property] +"</p>";
                    }else if(property === "address" && object[property] !== null) { //if address is not null, var address = adress from JSON
                        address += "<p>"+ "Adresse" +": "+ object[property] +"</p>";
                    }else if(property === "city" && object[property] !== null) { //if city is not null, var city = city from JSON
                        city += "<p>"+ "By" +": "+ object[property] +"</p>";
                    };
                };*/
                
                //the properties we want is: title, day, date, starttime, endtime, roles(form/dropdown/radio), address, city, notes
                if(object["title"] !== undefined && object["title"] !== "" && object["title"] !== null) { //if there is a title and itisn't === "" or null, var title = title from the JSON
                    title = "<p>"+ "Titel" +": "+ object["title"] +"</p>";
                };
                if(object["notes"] !== undefined && object["notes"] !== "" && object["notes"] !== null) { //if notes exist and aren't null or "", var notes = notes from JSON
                    notes = "<label for=\"notesField\">"+ "Noter fra administrator" +":</label> <div id=\"notesField\" class=\"shift\" style=\"padding:2vmin; margin-bottom:3vmin; border:solid black 1px\"><p>"+ object["notes"] +"</p></div>";
                };
                if(object["startdate"] !== undefined && object["startdate"] !== "" && object["startdate"] !== null) { //if startdate exists, is not null or "", var date = a formatted startdate
                    date = "<p>"+ "Dato" +": "+ getWeekday(object["startdate"]) +" "+ getDate(object["startdate"]) +"</p>";
                };
                if(object["starttime"] !== undefined && object["starttime"] !== "" && object["starttime"] !== null) { //if starttime exists, is not null or "", var startTime = a formatted startime
                    startTime = "<p>"+ "Starttid" +": "+ object["starttime"].substring(0,5) +"</p>";
                };
                if(object["endtime"] !== undefined && object["endtime"] !== "" && object["endtime"] !== null) { //if endtime exists, is not null or "", var endTime = a formatted endtime
                    endTime = "<p>"+ "Sluttid" +": "+ object["endtime"].substring(0,5) +"</p>";
                };
                if(object["roles"] !== undefined && object["endtime"] !== "" && object["endtime"] !== null) { //if roles exists, is not null or "", var roles = roles from JSON //right now, I apparently don't receive roles...
                    roles = "<p>"+ "Rolle" +": "+ object["endtime"] +"</p>";
                };
                if(object["address"] !== undefined && object["address"] !== "" && object["address"] !== null) { //if address exists, is not null or "", var address = adress from JSON
                    address = "<p>"+ "Adresse" +": "+ object["address"] +"</p>";
                };
                if(object["city"] !== undefined && object["city"] !== "" && object["city"] !== null) { //if city exists, is not null or "", var city = city from JSON
                    city = "<p>"+ "By" +": "+ object["city"] +"</p>";
                };
                
                //appends the title of the shift to the body, that way, the user knows where they are... if the title is ==="" it outputs "vagten" instead...
                if(object["title"] !== "") {
                    $(body).append('<h1 class="page-header">Detaljer for '+ object["title"] +':</h1>');
                }else {
                    $(body).append('<h1 class="page-header">Detaljer for vagten:</h1>');
                };

                //add the individual parts of the JSON to the append body, so that it can be viewed. Done this way to be easily modifiable...
                $(body).append(title+date+startTime+endTime+city+address+roles+notes);
                //sets isBooked to true, letting the function know that it's dealing with a bookedShift as opposed to a possibleShift
                //isBooked = true; may not need this anymore
            };
        };
        
        //adds a back button to the page, so that people can easily get back. OBS would be nice to navigate to the shift they were just viewing, but I'm not sure how to do this...
        $(body).append('<button class="btn btn-default backBtn pull-left margBotBtn">Tilbage</button>');
        //adds a listener/function to the back button
//        $(".backBtn").on("click", backBtnFunc(isBooked, theShift));
        $(".backBtn").on("click", function() {
            //if(shiftType) {
//                backBtnHandler().done(function() {
//                        $(body).append('<a href="#"'+ theShift +'>Link til Vagten</a>');
//                    });
//                showMyShifts().done(function() { //I WAS TRYING TO MAKE IT NAVIGATE TO THE TARGET SHIFT, BUT IT PROVED ORNERY, IT MIGHT BE A PHONEGAP ISSUE ACCORDING TO SOME ON THE WEB
//                    //$(body).scrollTop($("#"+ theShift).scrollTop());
//                    //window.scroll(0, 500);
//                $(body).append('<a href="#"'+ theShift +'>Link til Vagten</a>');
//                $("#"+ theShift).trigger("click"); //once the link above is added, make this work...
//                    //http://www.javascriptmvc.com/docs/jQuery.event.pause.html - trouble with using hreft/anchor onclick/pause is that the element on which the anchor would be located is removed before resume() would be called...
//                });
                //window.location='#'+theShift; //virker IKKE
//                var evt = document.createEvent("Event");
//                evt.initEvent("click", true, true);
//                $('#'+theShift).get(0).dispatchEvent(evt);
                showMyShifts();
            //}else {
                //showPossibleShifts();
            //};
        });
        
        if(/*shiftType === true &&*/ allowDelete === true) {
            $(body).append('<button id="bookBtn" class="btn btn-danger pull-right margBotBtn" type="button">Afmeld vagt</button>');
            $("#bookBtn").on("click", showModalView);
            
        };//else if(shiftType === false) { //button should also submit info from your choice of roles, if present...
            //$(body).append('<button class="btn btn-success pull-right margBotBtn" type="button">Tag vagt</button>');
            //$("#bookBtn").on("click", showModalView);
        //};
    };
    //evaluates what kind of detail to show, then iterates through a collection of shifts and populates a requested detail
    function showPossibleShiftDetails() {
        
        //gets the id from the button, the button's id is equal to the id of the shift in the JSON...
        var theShift = $(this).attr("id");
        
        $(body).empty();
        
        //retrieves the JSON from localStorage
        var theShifts = $.parseJSON(getFromStorage("savedPossibleShifts"));
        
        //iterates through shifts already booked by the user
        for (var i = 0; i < theShifts.length; i++) {
            //assign the current object containing JSON to "var object", so that I only need to write it once
            var object = theShifts[i];
            
//            // TEST
//            for(var prop in object) {
//                $("#UI_ELEMENT_TEST").append("<p>"+ prop +": "+ object[prop] +"</p>");
//            };
            
            //breaks up the "start" attribute of the object, as this contains both the start date AND the start time
            var startArr = object["start"].split("T");
            var startDate = startArr[0];
            var startTime = startArr[1].substring(0,5);
            //breaks up the "end" attribute of the object, as this contains both the end date AND the end time
            var endArr = object["end"].split("T");
            //var endDate = endArr[0]; //currently, we don't output the endDate, so this var isn't currently needed...
            var endTime = endArr[1].substring(0,5);
            
            //calculation of how many freeSpaces we have in the shift is saved here, calc is done below.
            var freeSpaces;
            
            //strings that will contain some of the values retrieved from the shift's JSON formatted for html, making it easy to arrange them when appending them to the body later on
            var date = '';
            var notes = '';
            var title = '';
            var shiftColor = '';
            var shiftStartTime = '';
            var shiftEndTime = "";
            var freeSpacesFormatted = '';
            
            // OBS, WE MAY WANT THESE THREE PIECES OF INFORMATION, BUT WE AREN'T RECEIVING THEM PT
            //var roles = '';
            //var city = '';
            //var address = '';

            //Checks to see if the id of the shift, from the JSON is equal to the id of the shift we want
            if(object.id === theShift) {
                
                //calculate the number of free spaces in the shift
                freeSpaces = parseInt(object["maxmembers"])-parseInt(object["taken"]);
                //if there are any free spaces, show how many there are
                if(freeSpaces > 0) {
                    freeSpacesFormatted = "<p>Der er "+ freeSpaces +" ledige pladser på vagten</p>";
                };
                //if notes aren't null or "", var notes = notes from JSON
                if(object["shiftnotes"] !== undefined && object["shiftnotes"] !== "" && object["shiftnotes"] !== null) {
                    notes = "<label for=\"notesField\">"+ "Noter fra administrator" +":</label> <div id=\"notesField\" class=\"shift\" style=\"padding:2vmin; margin-bottom:3vmin; border:solid black 1px\"><p>"+ object["shiftnotes"] +"</p></div>";
                };
                //gives the shift a color type, if it has one
                if(object["color"] !== undefined && object["color"] !== null && object["label"] !== undefined && object["label"] !== null) {
                    shiftColor = '<p>Vagt type: '+ object["label"] +'</p><div style="clear: both; margin-top: -2vmin; heigth: 5px; width: 100%; border-radius: 5px; background-color:'+ object["color"] +';"><p><br></p></div>';
                };
                //gives the shift a day/date
                //if startDate is not null or undefined, var date = a formatted startdate
                if(startDate !== undefined && startDate !== null) {
                    date = "<p>"+ "Dato" +": "+ getWeekday(startDate) +" "+ getDate(startDate) +"</p>";
                };
                //gives the shift a start time and an end time
                if(startTime !== undefined && startTime !== null && endTime !== undefined && endTime !== null) {
                    shiftStartTime = '<p>Starttid: '+ startTime +'</p>';
                    shiftEndTime = '<p>Sluttid: '+ endTime +'</p>';
                };
                //if title isn't === "" or null, var title = title from the JSON
                if(object["appshifttitle"] !== undefined && object["appshifttitle"] !== "" && object["appshifttitle"] !== null) {
                    title = "<p>"+ "Titel" +": "+ object["appshifttitle"] +"</p>";
                };
                
                //page-header
                //appends the title of the shift to the body, that way, the user knows where they are... if the title is ==="" it outputs "vagten" instead...
                if(object["appshifttitle"] !== "" && object["appshifttitle"] !== undefined && object["appshifttitle"] !== null) {
                    $(body).append('<h1 class="page-header">Detaljer for '+ object["appshifttitle"] +':</h1>');
                }else {
                    $(body).append('<h1 class="page-header">Detaljer for vagten:</h1>');
                };
                
                //add the individual parts of the JSON to the append body, so that it can be viewed. Done this way to be easily modifiable...
                $(body).append(shiftColor+title+date+shiftStartTime+shiftEndTime+freeSpacesFormatted+notes);
            };
        };
        
        //adds a back button to the page, so that people can easily get back. OBS would be nice to navigate to the shift they were just viewing, but I'm not sure how to do this...
        $(body).append('<button class="btn backBtn btn-default pull-left margBotBtn">Tilbage</button>');
        //adds a listener/function to the back button
        $(".backBtn").on("click", function() {
                showPossibleShifts();
        });
        
        //makes sure whether or not you can take the shift, if you can, show a bookBtn
        if(freeSpaces > 0) { //button should also submit info from your choice of roles, if present...
            $(body).append('<button class="btn bookBtn btn-success pull-right margBotBtn" type="button">Tag vagt</button>');
            $(".bookBtn").on("click", showModalView);
        };
    };
    
//    function backBtnFunc(isBooked, theShift) {
//        if(isBooked) {
//            showMyShifts().done(function() { //I WAS TRYING TO MAKE IT NAVIGATE TO THE TARGET SHIFT, BUT IT PROVED ORNERY, IT MIGHT BE A PHONEGAP ISSUE ACCORDING TO SOME ON THE WEB
//                //$(body).scrollTop($("#"+ theShift).scrollTop());
//                //window.scroll(0, 500);
//                $(body).append('<a href="#"'+ theShift +'>Link til Vagten</a>');
//                $("#"+ theShift).trigger("click"); //once the link above is added, make this work...
//                //http://www.javascriptmvc.com/docs/jQuery.event.pause.html - trouble with using hreft/anchor onclick/pause is that the element on which the anchor would be located is removed before resume() would be called...
//            });
//        }else {
//            showPossibleShifts();
//        };
//    };
    
    //shows the "Brugerprofil" page
    function showUserProfile() {
        $(body).empty();
        if(checkConnection()) {
            //the url to POST to, so we can get our UserProfile JSON
            var url = "https://"+ getFromStorage("domain") +".nemvagt.dk/ajax/app_userprofile";
            //the object containing the data/authenticator to POST, so we are allowed to retrieve the JSON
            var toPost = {userid:getFromStorage("userId")};
            //make the AJAX call and save it to the var, so we can call .done on it
            var userProfileObj = postAJAXCall(url, toPost);

            userProfileObj.done(function(data) {
                populateUserProfile(ajaxSuccesEvaluator("savedUserProfile", "Bruger Profilen", data));
            });
        }else { //this is reached if the device is offline
            populateUserProfile(ajaxSuccesEvaluator("savedUserProfile", "Bruger Profilen"));
        };
        
        
    };
    function populateUserProfile(data) {
        //a title so people know where they are
        $(body).append('<h1 class="page-header">Mine oplysninger</h1>');
        
        //the var where we will be adding the data to be printed, from the profile JSON. We need the initial value to start of the group that will contain the profile.
        var profileFields = '<form id="userProfileForm" class="form-group" role="form" method="post" action="">';
        
        //iterate through the JSON and create the needed fields
        for(var i = 0; i < data.length; i++) {
            var object = data[i];
            for(var property in object) {
                //makes sure we're only looking at field "type" properties
                if(property==="ftype") {
                    //statement that can identify something that needs a select statement (/radio buttons)
                    if(object[property]=== "SELECT" || object[property]=== "GENDER") {
                        profileFields += createSelectList(object);

                        //statement that can identify something that needs checkbox buttons
                    }else if(object[property] === "CHECKBOX" || object[property] === "CAMPING") {
                        profileFields += createCheckBoxes(object);

                        //statement that can identify something that needs an actual text area, like notes...
                    }else if(object[property] === "TEXTAREA") {
                        profileFields += createTextArea(object);

                        //grabs quite a few different things, that all need to be showed in a textField
                    }else if(object[property] === "TEXT" || object[property] === "DATE" || object[property] === "EMAIL" || object[property] === "PHONE" || object[property] === "SIZE") {
                        profileFields += createTextField(object);

                    };
                }
                //$("#UI_ELEMENT_TEST").append(property +" : "+ object[property] +";<br>"); // TEST
            };
        };
        //adds a submit button to the UserProfile form, done outside the "for loop" it will always be at the end of the form
        profileFields += '<button type="submit" class="btn btn-success btn-lg" id="saveUserProfileBtn">Gem ændringer</button>';
        //closes the UserProfile form, done here outside the "for loop", since we don't know how long the form will be
        profileFields += '</form>';
        //appends the UserProfile form to the body, so it can be viewed
        $(body).append(profileFields);
        
        //adds a listener to the togglebuttons added in createCheckBoxes()
        toggleButtonHandler();
//        var form = $("#userProfileForm").serialize(); // TEST
//        $(body).append("FORM-START: "+ form +"; FORM-END"); // TEST
        
//        // TEST
//        var form = $("#userProfileForm").serializeArray();
//        for(var i = 0; i < form.length; i++) {
//            $(menu).append("<p>"+ form[i]["name"] +"</p>"); //pure test
//            //if the element has the class "isRequired", it isn't allowed to be empty/not filled out/null
//            if($("#userProfileForm").find("#"+ form[i]["name"]).hasClass("isRequired")) {
//                //$(menu).append("<p>it is required</p>"); //pure test
//                $(menu).append("<p>the value: "+ $("#userProfileForm").find("#"+ form[i]["name"]).attr("value") +"</p>"); //pure test
//            };
//        };
//        // END OF TEST
        
        
        $("#saveUserProfileBtn").on("click", function(event) {
            //call an evaluator to check that no required fields are left empty, if they are filled return true, else return false and notify the user
            var canSubmit = isRequiredFieldEmpty(event);
            //makes the ajax submission of the UserProfile data, IF canSubmit===true
            submitUserProfile(canSubmit);
        });
    };
    //used to format data for textfield in populateUserProfile, returns a html formatted string, requires the JSON object
    function createTextField(object) {
        //sets the standard type for textfields in this function
        var type = 'text';
        //sets the field type to "email" for fields containing data with type "EMAIL"
        if(object["ftype"] === "EMAIL") {
            type = 'email';
        } //sets the field type to "tel"(telephone) for fields containing data with type "PHONE"
        else if (object["ftype"] === "PHONE") {
            type = 'tel';
        }else if(object["ftype"] === "DATE") {
            type = 'date';
        }else if(object["fieldname"] === "zipcode") {
            type = 'number';
        };
        
        //returns the formatted form.
        return '<div class="userProfileElement"><label for="'+ object["fieldname"] +'">'+ object["showname"] +':</label><input id="'+ object["fieldname"] +'" type="'+ type +'" name="'+ object["fieldname"] +'" class="form-control" value="'+ object["value"] +'"></div>';
        //return '<div class="input-group userProfileElement input-group-md"><label for="'+ object["fieldname"] +'">'+ object["showname"] +':</label><input id="'+ object["fieldname"] +'" type="'+ type +'" name="'+ object["fieldname"] +'" class="form-control" value="'+ object["value"] +'"></div>';
    };
    //used to format data for textareas in populateUserProfile, returns a html formatted string, requires the JSON object
    function createTextArea(object) {
        var value = object["value"];
        //for some reason a textarea can be null, instead of empty, but isn't necessarily, so we use this to make sure it doesn't show the user the text "null"
        if(object["value"]===null) {
            value = "";
        }
        //returns the formatted form.
        return '<div class="userProfileElement"><label for="'+ object["fieldname"] +'">'+ object["showname"] +':</label><textarea id="'+ object["fieldname"] +'" name="'+ object["fieldname"] +'" class="form-control" rows="5" >'+ value +'</textarea></div>';
    };
    //used to format data for checkboxes in populateUserProfile, returns a html formatted string, requires the JSON object
    function createCheckBoxes(object) {
        var checked = '';
        //evaluates if a box shoud be checked
        if(object["value"] === "1") {
            checked = 'checked="checked"';
        };
        //makes a toggle button, to replace the visual representation of the checkbox
        var toggleBtn = createToggleButton(checked);
        //menu.append(toggleBtn+"<br><br><br>");
        //returns the formatted form.
        return '<div class="checkbox userProfileElement"><label hidden><input hidden type="checkbox" '+ checked +' id="'+ object["fieldname"] +'" name="'+ object["fieldname"] +'" value="1">'+ object["showname"] +'</label> '+ toggleBtn +' <label>'+ object["showname"] +'</label></div>';
    };
    //used by createCheckBoxes to make toggleButtons, to show instead of checkboxes
    function createToggleButton(checked) {
        var yes = 'btn-default';
        var no = 'btn-primary active';
        //evaluates which button should be active
        if(checked === 'checked="checked"') {
             yes = 'btn-primary active';
             no = 'btn-default';
        };
        return '<div class="btn-group btn-toggle"><button class="btn '+ yes +'">Ja</button><button class="btn '+ no +'">Nej</button></div>';
    };
    //used to format data for select lists in populateUserProfile, returns a html formatted string, requires the JSON object
    function createSelectList(object) {
        //a var to store the html of the options, we get in the loop, in.
        var optionString = "";
        
        if(object["ftype"] === "SELECT") {
            //the possible select values are a string, but will always be seperated by a semicolon, so we split the string into an array, so we can work with it
            var options = object["selectvalues"].split(";");
            //iterate through the array, and iteratively create the options
            for(var i = 0; i < options.length; i++) {
                var selected = "";
                if(object["value"] === options[i]) {
                    selected = "selected=\"selected\"";
                };
                if(i > 0) {
                    optionString += "<option "+ selected +" value="+ options[i] +">"+ options[i] +"</option>";
                }else {
                    optionString += "<option value=\"\">"+ options[i] +"</option>";
                };
            };
        }else if(object["ftype"] === "GENDER") {
            var male = "selected=\"selected\"";
            var female = "";
            //if the initial value is K, set male to "" and female to selected, making the gender evaluate as female instead of male
            if(object["value"] === "K") {
                male = "";
                female = "selected=\"selected\"";
            };
            optionString += "<option "+ male +" value=\"M\">Mand</option> <option "+ female +" value=\"K\">Kvinde</option>";
        }//else if(object["ftype"] === "SIZE") {
//            //iterate through the options
//            for(var property in object["selectvalues"]) {
//                var selected = "";
//                //if the key(property) corresponds to the value of the value attribute (f.eks. 2991), this is the option that should be selected
//                if(object["value"] === property) {
//                    selected = "selected=\"selected\"";
//                };
//                //add the option to the optionString, the key/property will be the value of the option and the value(from the key/value pair; f.eks. "medium") will be shown to the user
//                optionString += "<option "+ selected +" value=\""+ property +"\">"+ object["selectvalues"][property] +"</option>";
//            };
//        };
        
        //returns the formatted form.
        return '<label for="'+ object["fieldname"] +'">'+ object["showname"] +':</label><select class="form-control userProfileElement" id="'+ object["fieldname"] +'" name="'+ object["fieldname"] +'">'+ optionString +'</select>';
    };
    
    //a method to evaluate and if necessary notify users if a required fields are left empty
    function isRequiredFieldEmpty(event) {
        //prevent the default(synchronous) POST
        event.preventDefault();
        
        //what we will return, will be true unless an element is incorrectly filled in...
        var toBeReturned = true;
        //retrieves the saved user profile, so we can check if any required fields are empty...
        var data = JSON.parse(getFromStorage("savedUserProfile"));
        for(var i = 0; i < data.length; i++) {
            var object = data[i];
            if(object["required"] === "1") {
                var valueOfObject = $("#"+ object["fieldname"]).val();
                if(valueOfObject === "" || valueOfObject === null || valueOfObject === undefined) {
                    //if something that should be filled out isn't, notify user and display helptext (only tells of/displays help for, the first instance of incorrectly filled form element)
                    showModalViewAccept("Manglende udfyldning", "Feltet \""+ object["showname"] +"\" skal være udfyldt.<br>Hjælp til udfyldning:<br>"+ object["helptext"] +"<br><br>Felter der skal være udfyldt og ikke er det, er nu highlighted");
                    //highlights all incorrectly filled form elements, making it easy for the user to find them...
                    $("#"+ object["fieldname"]).addClass("myHighlight");
                    //removes the highlight once the user manipulates the form element
                    $(".myHighlight").on("focus", function() {
                        $(this).removeClass("myHighlight");
                    });
                    toBeReturned = false;
                };
            };
        };
        //after we're done going through the elements, if everything was filled out correctly, handle the checkboxes
        if(toBeReturned) {
            for(var i = 0; i < data.length; i++) {
                var object = data[i];
                //done to post an unchecked checkbox's value as 0, problem is that this means that the value of the field is now 0 and the checkbox is checked,
                //which means FURTHER unchecking/checking is irrelevant (which could be an issue since it's an ajax post, to avoid this, refresh the page after posting,
                //something we'd most likely want to do anyway...)
                if(object["ftype"] === "CHECKBOX" || object["ftype"] === "CAMPING") {
                    var theElement = $("#"+ object["fieldname"]);
                    //if the checkbox isn't checked, this checks it and the value is set to 0
                    if(theElement.prop("checked")!==true) {
                        theElement.prop("checked", true);
                        theElement.attr("value", "0");
                    }else{
                        //makes sure the value is 1, if the checkbox is checked
                        theElement.attr("value", "1");
                    };
                };
            };
        };
        return toBeReturned;
    };
    //if can submit===true, make an ajax submission, else, notify user
    function submitUserProfile(canSubmit) {
        //prevent the default(synchronous) POST, is already done in isRequiredFieldEmpty
        //$(this).preventDefault();
        
        //if all required fields are filled and we have an internet connection
        if(canSubmit) {
            if(checkConnection()) {
                //retrieve the domain from localStorage
                var domain = getFromStorage("domain");

                //make the form into a string, so I can POST is as such, in accordance with my agreement with Mark
                var form = $("#userProfileForm").serialize();

                var formattedPswHash = getFromStorage("pswHash");

                var userid = getFromStorage("userId");

                var ajaxQuery = $.ajax({
                    type: "POST",
                    url: "https://"+ domain + ".nemvagt.dk/ajax/app_saveuserprofile",
                    dataType: "text",
                    data: form +"&pswhash="+ formattedPswHash +"&userid="+ userid
                });
                //after the submit, refesh the page, it's needed because of how we handle checkbox submission (see: isRequiredFieldEmpty)
                ajaxQuery.done(function(data) {
                    //receives an answer from the server a json formatted string with succes:true/false
                    var json = JSON.parse(data);
                    if(json["succes"]) { //if succes===true
                        //refresh
                        showUserProfile();
                    }else { //if succes was anything but true
                        //clean up
                        modalW.empty();
                        body.empty();

                        //refresh from storage
                        populateUserProfile(JSON.parse(getFromStorage("savedUserProfile")));

                        //timeout is there to make sure the previous modal, from ajaxWatch has time to "un-animate", as it seems that if I dont do that, the "remove this modal view when a modal view becomes hidden" triggers from the other window being removed...
                        setTimeout(function() {
                            showModalViewAccept("Fejl", "Bruger Profilen blev ikke opdateret");
                        }, 100);
                    };
                });
            }else {
                //timeout is there to make sure the previous modal, from ajaxWatch has time to "un-animate", as it seems that if I dont do that, the "remove this modal view when a modal view becomes hidden" triggers from the other window being removed...
                setTimeout(function() {
                    showModalViewAccept("Manglende netværksforbindelse", "Der er ingen netværksforbindelse og det er derfor ikke muligt at opdatere din profil.");
                }, 100);
            };
        };
    };
    
    /*//we need to show the Organisations a User is affiliated with.
    function showMyOrganisations() {
        $(body).empty();
        
        //a title, so people know where they are
        $(body).append('<h1 class="page-header">Mine Organisationer</h1>');
        
    };
    
    //we need to show a list of possible Domains/Organisations that have allowed themselves to be placed on NemtVagt App
    function showPossibleOrganisations() {
        $(body).empty();
        
        //a title, so people know where they are
        $(body).append('<h1 class="page-header">Organisationer jeg kan tilmelde mig:</h1>');
    };*/
    
    //we need a menu, so that you can swap between profiles and navigate the page in general
    function showMenu() {
        $(menu).empty();
        var styling = 'style="margin-left: 7px; padding: 5px; font-size:16px;"';
        //creates a menu we can see in all pages. Add .navbar-fixed-top if menu should stick to top of screen.
        $(menu).append('<div class="dropdown" id="menu">\
        <button class="btn btn-default btn-lg dropdown-toggle" type="button" id="menu" data-toggle="dropdown">Menu\
        <span class="caret"></span></button>\
        <ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="menu">\
          <li role="presentation"><a id="myShiftsMenu" '+ styling +' role="menuitem" tabindex="-1" href="#">Mine vagter</a></li>\
          <li role="presentation"><a id="possibleShiftsMenu" '+ styling +' role="menuitem" tabindex="-1" href="#">Ledige vagter</a></li>\
          <li role="presentation" class="divider"></li>\
          <li role="presentation"><a id="userProfileMenu" '+ styling +' role="menuitem" tabindex="-1" href="#">Mine oplysninger</a></li>\
          <li role="presentation" class="divider"></li>\
          <li role="presentation"><a id="updateJSONMenu" '+ styling +' role="menuitem" tabindex="-1" href="#">Opdater alt</a></li>\
          <li role="presentation" class="divider"></li>\
          <li role="presentation"><a id="logOutMenu" '+ styling +' role="menuitem" tabindex="-1" href="#" >Log ud</a></li>\
          <!--<li role="presentation"><a id="myOrganisationsMenu" '+ styling +' role="menuitem" tabindex="-1" href="#" >Vis de steder jeg er frivillig</a></li>\
          <li role="presentation"><a id="possibleOrganisationsMenu" '+ styling +' role="menuitem" tabindex="-1" href="#" >Vis de steder jeg kan blive frivillig</a></li>\
          <li role="presentation"><a id="testingResetMenu" '+ styling +' role="menuitem" tabindex="-1" href="#" >TESTING RESET</a></li>-->\
        </ul>\
      </div>');
        
        //each of the methods called should probably call $(body).empty(); as the first thing they do... to clean the page
        //these methods are needed to assign "click" events to the menu buttons...
        $("#myShiftsMenu").on("click", showMyShifts);
        $("#possibleShiftsMenu").on("click", showPossibleShifts);
        $("#userProfileMenu").on("click", showUserProfile);
        $("#updateJSONMenu").on("click", updateAllListsMenuHandler);
        $("#logOutMenu").on("click", logOut);
        //the next two might not get to be in the first release, if not included, remember to remove them from the menu above too...
        //$("#myOrganisationsMenu").on("click", showMyOrganisations);
        //$("#possibleOrganisationsMenu").on("click", showPossibleOrganisations);
        //for testing puroposes...
        $("#testingResetMenu").on("click", testReset);
    };
    //for testing purposes...
    function testReset() {
        $(body).empty();
        //showMyShifts();
        //showLogin();
        hasSavedLogin();
        //showUserProfile();
    };
    //handles/evaluates success/error from ajax calls, if we get the data from the internet it is returned after being saved, if we can't get it, we get it locally and return it
    //if we get the data locally, we notify the user.
    //Requires a string location where we want to save the data, a string telling us where we are and the data from the ajax call.
    function ajaxSuccesEvaluator(saveLocation, whereAreWe, data) {
        if(data !== undefined){ //if succcess was reached in the postAJAXCall function, "data" is returned...
            //save the data to local storage, so it can be reused w/o having to make the AJAX call again
            saveToStorage(saveLocation , JSON.stringify(data));
            return data;
        }else { //if no connection/data === undefined
            //if we fail to get JSON, get it locally
            
            //retrieves the UserProfile from localStorage
            var saved = $.parseJSON(getFromStorage(saveLocation));
            
            //if there's something to retrive notify user, if there's nothing to retrieve, tell the user that...
            if(saved !== undefined && saved !== "" && saved !== null) {
                notificationModal("OBS, kunne ikke hente fra nettet", "<p>Henter \""+ whereAreWe +"\" fra telefonens hukommelse, data kan være forældet.</p>");
            }else {
                notificationModal("OBS, kunne ikke hente fra nettet", "<p>Der er ingen data for \""+ whereAreWe +"\" gemt på din telefon, hvis du har brug for at få det vist skal der bruges et netværk.</p>");
            };
            //removes the modal window after X 1/1000 of a second has passed.
            setTimeout(function() {
                modalW.empty();
            }, 3000);
            
            return saved;
        };
    };
    
    //updates "savedBookedShifts" & "savedPossibleShifts" in localStorage, when "opdater alt" in menu is pressed, then updates the page you were on
    function updateAllListsMenuHandler() {
        //tells us what to POST
        var toPost = {userid:getFromStorage("userId")};
        //tells us the domain to post to
        var domain = getFromStorage("domain");
        //keeps track of whether or not the AJAX call is done
        var myShiftsDone = false;
        //keeps track of whether or not the AJAX call is done
        var possibleShiftsDone = true; //should be changed to false once the possible shifts part has been implemented
        //keeps track of whether or not the AJAX call is done
        var userProfileDone = false;
        
        //looks at the pageHeader, which allows the conditional statement below to know where we are...
        var whereAmI = $(body).find(".page-header").html();
        if(whereAmI.substring(0,11) === "Mine vagter") {
            whereAmI = 1;
        }else if(whereAmI.substring(0,13) === "Ledige vagter") {
            whereAmI = 2;
        }else if(whereAmI === "Mine oplysninger") {
            whereAmI = 3;
        };
        
        //tells myShiftsAJAXObj where to POST to
        var urlMyShifts = "https://"+ domain +".nemvagt.dk/ajax/app_myshifts";
        //update myShifts
        var myShiftsAJAXObj = postAJAXCall(urlMyShifts, toPost);
        myShiftsAJAXObj.done(function(data) {
            saveToStorage("savedBookedShifts", JSON.stringify(data));
            //$("#UI_ELEMENT_TEST").append("saved myShifts from updateAllBtn"); //TEST
        }).done(function() {
            //$("#UI_ELEMENT_TEST").append("myShiftsDone === true"); //TEST
            //Looks at the status of the other ajax queries, if they're done or if we were on this page when we started the update, evaluate what to update, then do so.
            if(possibleShiftsDone && userProfileDone || whereAmI === 1) {
                //$("#UI_ELEMENT_TEST").append("Updated JSON by-way of \"opdater alt\" button, in the menu"); //TEST
                //evaluates what to update, then does so.
                updateAllListsMenuHandlerUpdateEvaluator(whereAmI);
            }else {
                //tells the method that myShifts are done updating
                myShiftsDone = true;
            };
        });
        
        //tells possibleShiftsAJAXObj where to POST to
//        var urlPossibleShifts = "https://"+ domain +".nemvagt.dk/ajax/app_XXX"; //change XXX to the address needed for POST'ing to possibleShifts
//        //update possibleShifts
//        var possibleShiftsAJAXObj = postAJAXCall(urlPossibleShifts, toPost);
//        possibleShiftsAJAXObj.done(function(data) {
//            saveToStorage("savedPossibleShifts", JSON.stringify(data));
//        }).done(function() {
//            myShiftsDone = true;
//            if(possibleShiftsDone && userProfileDone || whereAmI === 2) {
//                showPossibleShifts;
//                $("#UI_ELEMENT_TEST").append("Updated JSON by-way of \"opdater alt\" button, in the menu");
//            }
//        });
        
        //tells myShiftsAJAXObj where to POST to
        var urlUserProfile = "https://"+ domain +".nemvagt.dk/ajax/app_myshifts";
        //update myShifts
        var userProfileAJAXObj = postAJAXCall(urlUserProfile, toPost);
        userProfileAJAXObj.done(function(data) {
            //saveToStorage("savedBookedShifts", JSON.stringify(data)); //NOT IMPLEMENTED YET
            //$("#UI_ELEMENT_TEST").append("saved myShifts from updateAllBtn"); //TEST
        }).done(function() {
            //$("#UI_ELEMENT_TEST").append("myShiftsDone === true"); //TEST
            //Looks at the status of the other ajax queries, if they're done or if we were on this page when we started the update, evaluate what to update, then do so.
            if(possibleShiftsDone && myShiftsDone || whereAmI === 3) {
                //$("#UI_ELEMENT_TEST").append("Updated JSON by-way of \"opdater alt\" button, in the menu"); //TEST
                //evaluates what to update, then does so.
                updateAllListsMenuHandlerUpdateEvaluator(whereAmI);
            }else {
                //tells the method that myShifts are done updating
                userProfileDone = true;
            };
        });
        
    };
    //evaluates what to update in the "updateAllListsMenuHandler" function, then updates it.
    function updateAllListsMenuHandlerUpdateEvaluator(whereAmI) {
        switch (whereAmI) {
                    case 1:
                        showMyShifts;
                        break;
                    case 2:
                        //update possibleShifts
                        break;
                    case 3:
                        showUserProfile();
                        break;
                    default:
                        //do nothing, we're probably on a details page, and want to stay there, for now.
                        break;
                };
    };
    
    var updater = false; //these are used to administrate the AJAX updates called from the readMore button, so that only 1 instance will be called at once...
    function updateAllListsReadMoreBtnHandler() {
        if(updater === false) {
            updateAllLists(false);
            updater = true;
            setTimeout(function() {
                updater = false;
            }, 30000);
        };
    };
    //var derp = 0; // TEST
    //updates "savedBookedShifts" & "savedPossibleShifts" in localStorage, global is optional, but defines if the AJAX request will notify the user (will notify unless false)
    function updateAllLists(global) {
        //for testing
        //$("#UI_ELEMENT_TEST").append("running JSON update from \"vis mere\""+ derp); // TEST
        //derp++; // TEST
        //tells us what to POST
        var toPost = {userid:getFromStorage("userId")};
        //tells us the domain to post to
        var domain = getFromStorage("domain");
        //keeps track of whether or not the AJAX call is done
        
        //tells myShiftsAJAXObj where to POST to
        var urlMyShifts = "https://"+ domain +".nemvagt.dk/ajax/app_myshifts";
        //update myShifts
        var myShiftsAJAXObj = postAJAXCall(urlMyShifts, toPost, global);
        myShiftsAJAXObj.done(function(data) {
            saveToStorage("savedBookedShifts", JSON.stringify(data));
            //$("#UI_ELEMENT_TEST").append("Updated JSON by-way of \"vis mere\" button"); // TEST
        });
        
        //tells possibleShiftsAJAXObj where to POST to
//        var urlPossibleShifts = "https://"+ domain +".nemvagt.dk/ajax/app_XXX"; //change XXX to the address needed for POST'ing to possibleShifts
//        //update possibleShifts
//        var possibleShiftsAJAXObj = postAJAXCall(urlPossibleShifts, toPost, global);
//        possibleShiftsAJAXObj.done(function(data) {
//            saveToStorage("savedPossibleShifts", JSON.stringify(data));
//        });
    };
    
    //needed so show the NemVagt logo
    function showLogo() {
        //inserts the "NemVagt" logo in top of all pages.
        $("#lCont").append('<img src="img/NemVagt-Logo.png" class="img-responsive" style="margin-top:1vh; width:32vmin;" alt="NemVagt" >');
    };
    
    //is passed a date in the YYYY-MM-DD format and returns the weekdays name in danish, is needed to show the name of days when displaying shifts
    function getWeekday(date) {
        var aDay = new Date(date).getDay();
        var weekdays = {
            0: "Søndag",
            1: "Mandag",
            2: "Tirsdag",
            3: "Onsdag",
            4: "Torsdag",
            5: "Fredag",
            6: "Lørdag"
        };
        return weekdays[aDay];
    };
    //is passed a date in the YYYY-MM-DD format and returns it in format more easily readable by a most people, ie. DD/MM - YYYY
    function getDate(date) {
      return date.substring(8,10) +'-'+ date.substring(5,7) +'-'+ date.substring(0,4);
    };
    
    //an "all purpose" AJAX call, that needs the url(ie. where to POST), the data to POST as a string array(infoArr), [optionally a boolean (isGlobal)], and returns some JSON
    //it will override any userid & pswhash put in the data you POST, as it adds these automatically, from localStorage...
    function postAJAXCall(url, infoArr, isGlobal) {
        if(isGlobal !== false) {
            isGlobal = true;
        };
        
        if(infoArr === undefined || infoArr === null) {
            infoArr = {};
        };
        
        infoArr.pswhash = getFromStorage("pswHash");
        
        infoArr.userid = getFromStorage("userId");
        
        return $.ajax({
            type: "POST",
            global: isGlobal,
            url: url,
            dataType: "JSON",
            data: infoArr,
            success: function(data) {
                return data;
            },
            error: function() {
                $(body).append("<p>Something went wrong in postAJAXCall</p>"+"<p>status: "+ error.status + "; readyState: " + error.readyState +"; statusText: "+ error.statusText +"; responseText:"+ error.responseText +";</p>");
            }
        });
    };
    
    //is used to check the connection state/type, plugs into the browser
    function checkConnection() {
        //$(body).append('Checker:');
        var networkState = navigator.connection.type;
        
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';
        
        if(states[networkState] === 'No network connection') {
            //$(body).append('Connection type: failed: ' + states[networkState]);
            return false;
        }else {
            //$(body).append('Connection type: succeded: ' + states[networkState]);
            return true;
        };
    }
    
    //we need this to make sure html5 storage is available, it's essentially a formality in this app
    function supportsLocalStorage() {
        try {
            //$(body).append('<p>localStorage available</p>');
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            //$(body).append('<p>localStorage uavailable</p>'+ e.toString());
            return false;
        }
    };
    //we need this to save to local storage, it needs a key/value pair. Both key and value must be stored as strings
    //if a key is saved that is already present, it is silently overwritten...
    function saveToStorage(key, value) {
        if(supportsLocalStorage()!==false) {
            localStorage.setItem(key, value);
        }else {
            //do nothing or maybe tell user that local storage is unavailable...
        };
    };
    //we need this to retrieve items from storage, it needs a key to return its corresponding value, needs and returns strings
    function getFromStorage(key) {
        if(supportsLocalStorage()!==false) {
            return localStorage.getItem(key);
        }else {
            //do nothing or maybe tell user that local storage is unavailable...
        };
    };
    function cleanStorage() {
        if(supportsLocalStorage()!==false) {
            localStorage.clear();
            //reset variable to true, so the system will correctly update the list of shifts
            myShiftsFirstUpdate = true;
            //reset variable to true, so the system will correctly update the list of shifts
            possibleShiftsFirstUpdate = true;
        }else {
            //do nothing or maybe tell user that local storage is unavailable...
        };
    };
    //when testing is done, this method might replace "cleanStorage()", but make sure "cleanStorage" isn't used then...
    //This method is needed to log out, so that people can log in with a different account...
    function logOut() {
        cleanStorage();
        $(menu).empty();
        $(body).empty();
        showLogin();
    };
    
    //is used to show the modal window when trying to book/unbook
    function showModalView() {
        $(modalW).append('<div class="modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
          <div class="modal-dialog">\
            <div class="modal-content">\
              <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                <h4 class="modal-title" id="myModalLabel">Modal title</h4>\
              </div>\
              <div class="modal-body">\
                Er du sikker?\
              </div>\
              <div class="modal-footer">\
                <button type="button" class="btn btn-default btn-lg" data-dismiss="modal">Nej</button>\
                <button id="modalYesBtn" type="button" class="btn btn-default btn-lg">Ja</button>\
              </div>\
            </div>\
          </div>\
        </div>');
        
        var title = $(this).html(); //if we want to use icons instead of text on the buttons, simply use an "if" to check what is written and assign "title" a value based on that...
        var options = {show: true};
        $("#myModal").modal(options);
        $(".modal-title").html(title);
        if(title==="Afmeld vagt") { //this derives from the text on the button, could maybe be done better?
            $("#modalYesBtn").on("click", unbookShift);
        }else if(title==="Tilmeld Vagt") { //this derives from the text on the button, could maybe be done better?
            $("#modalYesBtn").on("click", bookShift);
        };
        //makes the "yes" button close the modal window
        $("#modalYesBtn").on("click", function() {
            $("#myModal").modal("hide");
        });
        
        //adds listener that cleans up after the modal when the window is closed, this is needed to not have several windows at once
        /*$("#myModal").on("hidden.bs.modal", function() {
            $("#modalYesBtn").off();
        });
        $("#myModal").on("hidden.bs.modal", function() {
            $("#myModal").off();
        });*/
        $("#myModal").on("hidden.bs.modal", function() {
            modalW.empty();
        });
    };
    
    function showModalViewAccept(title, content) {
        $(modalW).append('<div class="modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
          <div class="modal-dialog">\
            <div class="modal-content">\
              <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                <h4 class="modal-title" id="myModalLabel">'+ title +'</h4>\
              </div>\
              <div class="modal-body">\
                '+ content +'\
              </div>\
              <div class="modal-footer">\
                <button id="modalOkayBtn" type="button" class="btn btn-default btn-lg">Okay</button>\
              </div>\
            </div>\
          </div>\
        </div>');
        
        //configures the modal, to be visible
        var options = {show: true};
        $("#myModal").modal(options);
        
        //makes the "yes" button close the modal window
        $("#modalOkayBtn").on("click", function() {
            $("#myModal").modal("hide");
        });
        //cleans up after the modal when it closes
        $("#myModal").on("hidden.bs.modal", function() {
            modalW.empty();
        });
    };
    
//    //a method that books/unbooks a shift, it evaluates which itself, may be called from the modal windows opened through both Details, showPossibleShifts and showMyShifts
//    function shiftBookingHandler() { //unfinished?
//        var title = $(this).html();
//        if(title==="Afmeld vagt") {
//            $("body").append("<p>unbookShift was called</p>");
//            //unbook the shift
//        }else if(title==="Tilmeld Vagt") {
//            $("body").append("<p>bookShift was called</p>");
//            //book the shift
//        };
//    };
    //unbooks a shift, may be called from the modal windows opened through both Details and showMyShifts
    function unbookShift() {
        //$("body").append("<p>unbookShift was called</p>");
    };
    //books a shift, may be called from the modal windows opened through both Details and showPossibleShifts
    function bookShift() {
        //$("body").append("<p>bookShift was called</p>");
    };
    
    //keeps track of whether or not there is an active ajax request, and notifies the user if there is one...
    function ajaxWatch() {
        $(document).on({
            ajaxStart: function(){ notificationModal("Opdatering igang, vent venligst",
                '<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">Loading...</div></div>');
            },
            
            ajaxStop: function() { modalW.empty(); }
        });
    };
    
    //modal used by ajaxWatch, to notify user fx. of update while ongoing, it takes two strings, a title and some content, which it inputs into the html
    function notificationModal(title, content) {
        $(modalW).append('<div class="modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
          <div class="modal-dialog">\
            <div class="modal-content">\
              <div class="modal-header">\
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                <h4 class="modal-title" id="myModalLabel">'+ title +'</h4>\
              </div>\
              <div class="modal-body">\
                '+ content +'\
              </div>\
            </div>\
          </div>\
        </div>');

        //configures the modal, to be visible and not dismiss upon "click" of background
        var options = {show: true, backdrop: 'static'};
        $("#myModal").modal(options);

        //adds listener that cleans up after the modal when the window is closed, this is needed to not have several windows at once
        $("#myModal").on("hidden.bs.modal", function() {
            modalW.empty();
        });
    };
    
    //handles the toggle button, used instead of standard checkboxes
    function toggleButtonHandler() {
        $('.btn-toggle').on("click", function(event) {
            event.preventDefault();
            
            //this doesn't work, but I'm trying to grab the nearest checkbox and add/remove the checked prop...
            var checkbox = $(this).closest(".checkbox").find("input");
            checkbox.prop("checked", !checkbox.prop("checked"));
            
            $(this).find('.btn').toggleClass('active');

            if ($(this).find('.btn-primary').size() > 0) {
                $(this).find('.btn').toggleClass('btn-primary');
            }
            if ($(this).find('.btn-danger').size() > 0) {
                $(this).find('.btn').toggleClass('btn-danger');
            }
            if ($(this).find('.btn-success').size() > 0) {
                $(this).find('.btn').toggleClass('btn-success');
            }
            if ($(this).find('.btn-info').size() > 0) {
                $(this).find('.btn').toggleClass('btn-info');
            }

            $(this).find('.btn').toggleClass('btn-default');
        });
    };
    
});

};