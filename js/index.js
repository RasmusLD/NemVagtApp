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
        //timeout set to allow users to see the splash screen
        setTimeout(function() {
            phonegapReady();
        }, 3000);
    }
};

//this function is called once the 'deviceready' event has been fired
function phonegapReady() {

$(document).ready(function(){
    
    //used above to know if we need to handle a backBtn, but also to determine how to style certain elements... this is done because certain older windows and apple phone will have trouble with styling compatability...
    function isiPhone() {
        if(device.platform === "iPhone") {
            return true;
        };
        return false;
    };
    
    //gives us the size of the display, used on non-iPhone devices for some relative styling
    var sizeHelper = 0;
    function getSize() {
        if($(window).width() < $(window).height()) {
            sizeHelper = $(window).width()/100;
            //$("#UI_ELEMENT_TEST").append("<p>window.width"+ sizeHelper +"</p>");
        }else {
            sizeHelper = $(window).height()/100;
            //$("#UI_ELEMENT_TEST").append("<p>window.height"+ sizeHelper +"</p>");
        };
    };
    
    //
    function relativeSize(defaultStyling, calcSize) {
        if(isiPhone()) {
            //$("#UI_ELEMENT_TEST").append("<p>isiPhone: "+ isiPhone().toString() +"</p>");
            return defaultStyling;
        }else {
            var calc = sizeHelper*calcSize;
            //$("#UI_ELEMENT_TEST").append("<p>isiPhone: "+ isiPhone().toString() +"</p>");
            //$("#UI_ELEMENT_TEST").append("<p>calc: "+ calc +"</p>");
            return calc+"px";
        };
    };
    
    function onBackKeyDown() {
        
        modalW.empty();
        
        setTimeout(function() {
            $(modalW).append('<div class="modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
              <div class="modal-dialog">\
                <div class="modal-content">\
                  <div class="modal-header">\
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                    <h4 class="modal-title" id="myModalLabel">Luk NemVagt?</h4>\
                  </div>\
                  <div class="modal-body">\
                    Er du sikker på at du ønsker at lukke NemVagt app\'en?\
                  </div>\
                  <div class="modal-footer">\
                    <button type="button" class="btn btn-default btn-lg pull-left" data-dismiss="modal">Nej</button>\
                    <button type="button" class="btn modalYesBtn btn-default btn-lg pull-right">Ja</button>\
                  </div>\
                </div>\
              </div>\
            </div>');
        
        //defines the setup changes of the modal, show===true so the modal is shown
        var options = {show: true};
        //applies the changes defined in var options
        $("#myModal").modal(options);
        //sets the title of the modal, so people know where they are
        //$(".modal-title").html(title); is done directly in the html
        
        $(".modalYesBtn").on("click", function() {
            navigator.app.exitApp();
        });
        
        $(".modalYesBtn").on("click", function() {
            $("#myModal").modal("hide");
        });
        
        $("#myModal").on("hidden.bs.modal", function() {
            modalW.empty();
        });
        
        }, 10);
        
        //navigator.app.backHistory(); //should work, if there was actually any entries in the app's backHistory, but there never will be, because we only have one page...
        
        //doesn't work...
//        if(device.app.canGoBack()) {
//            device.app.goBack();
//            return;
//        };
//        
//        return device.app.onBackPressed();
        
    };
    
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
//    //picture source
//    var pictureSource;
//    //sets the format of returned value
//    var destinationType;
    
    //this must be the first function to run, so that the JS instantiates properly
    $(function runOnLoad(){
        
        //we need this for some relative styling on non iPhones...
        getSize();
        
        //needed to show the NemVagt logo on top of all screens
        showLogo();
        
        //is used to listen for the "pause" event...
        document.addEventListener("pause", onPause, false);
        
        //we're listening for iPhone because windows phones have a backBtn but don't support device.platform...
        if(!isiPhone) {
            document.addEventListener("backbutton", onBackKeyDown, false);
        };
        
        //instantiates var menu, that will need to be on every page.
        menu = $("#mCont");
        //instantiates var body, that will be used on every page.
        body = $("#bCont");
        //instantiates var modalW, that will be used on most pages.
        modalW = $("#modalCont");
        //creates listeners for ajaxStart/ajaxStop
        ajaxWatch = ajaxWatch();
        
//        //instantiates the variables we need to handle pictures
//        pictureSource=navigator.camera.PictureSourceType;
//        destinationType=navigator.camera.DestinationType;
        
        
        //removes the large logo, shown on app startup
        $("#sCont").empty();
        
        //instantiates the UI
        hasSavedLogin();
        
    });
    
    //closes the app on pause, is used to circumvent our state problem
    function onPause() {
        navigator.app.exitApp();
    };
    
    //camera & photo functionality
    /*//Called when a photo is successfully retrieved
    
    //we may want to open a modal view that prompts people to accept the use of the camera or retrievel of pictures from the phone...
    //pictureFunctions();
    function pictureFunctions() {
        //appends buttons to the test UI_Element
        $("#UI_ELEMENT_TEST").append('<button class="btn btn-default" id="capPhotoD">Capture Photo With Image Data</button> <br>\
            <button class="btn btn-default" id="capPhotoFU">Capture Photo With Image File URI</button> <br>\
            <button class="btn btn-default" id="getPhotoL">From Photo Library</button> <br>\
            <button class="btn btn-default" id="getPhotoPA">From Photo Album</button> <br>');
        
        //appends listeners for the buttons
        $("#capPhotoD").on("click", capturePhotoWithData);
        $("#capPhotoFU").on("click", capturePhotoWithFile);
        $("#getPhotoL").on("click", function() {
            getPhoto(pictureSource.PHOTOLIBRARY);
        });
        $("#getPhotoPA").on("click", function() {
            getPhoto(pictureSource.SAVEDPHOTOALBUM);
        });
    };
    
    function onPhotoDataSuccess(imageData) {
        $("#UI_ELEMENT_TEST").append('<img style="display:block;width:60px;height:60px;" id="smallImage" src="'+ imageData +'" />');
        //Get image handle
        //var smallImage = $('#smallImage');
        //Unhide image elements
        //smallImage.style.display = 'block';
        //Show the captured photo
        //The inline CSS rules are used to resize the image
        //smallImage.src = "data:image/jpeg;base64," + imageData;
    };
    // Called when a photo is successfully retrieved
    function onPhotoFileSuccess(imageData) {
        //Get image handle
        $("#UI_ELEMENT_TEST").append('<img style="display:block;width:60px;height:60px;" id="smallImage" src="'+ imageData +'" />');
        
        //var smallImage = $('#smallImage');
        
        //Unhide image elements
        //smallImage.style.display = 'block';
        
        //Show the captured photo
        //The inline CSS rules are used to resize the image
        //smallImage.src = imageData;
    };
    //Called when a photo is successfully retrieved
    function onPhotoURISuccess(imageURI) {
        //Get image handle
        $("#UI_ELEMENT_TEST").append('<img style="display:block;" id="largeImage" src="'+ imageURI +'" />');
        //var largeImage = $('#largeImage');
        
        //Unhide image elements
        //largeImage.style.display = 'block';
        
        //Show the captured photo
        //The inline CSS rules are used to resize the image
        //largeImage.src = imageURI;
    };
    
    //A button will call this function
    function capturePhotoWithData() {
    //Take picture using device camera and retrieve image as base64-encoded string
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50 });
    };
    function capturePhotoWithFile() {
        navigator.camera.getPicture(onPhotoFileSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
    };
    //A button will call this function
    function getPhoto(source) {
        //Retrieve image file location from specified source
        navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    };
    
    //Called on error and cancel
    function onFail(message) {
        //the onFail function is also called on cancelling the use of the camera/photoBrowser...
        
        //var that lets us know if it's a real error or not, true is a real error, false is probably, a cancellation by user
        var trueError = true;
        //look for the word "cancelled." in the error message if we find it, set trueError to false, we don't know for sure that it will only show up when the user cancels, but let's hope...
        var msgArr = message.split(" ");
        for(var i = 0; i < msgArr.length; i++) {
            if(msgArr[i] === "cancelled.") { //the dot is there because that's the format I've seen on expected fails, so far...
                trueError = false;
            };
        };
        //if the word "cancelled." wasn't found, notify user of the error
        if(trueError) {
            showModalViewAccept("Fejl", "Problem ved hentning af billede: "+ message);
        };
    };
    
    //url til prfil billede, er /avatar/md5(userid)/size(int size i want)
    function derp() {
        
        var infoArr = {};
        
        var userId = getFromStorage("userId");
        
        var hashedUserId = md5(userId);
        
        var url = "https://"+ getFromStorage("domain") +"/avatar/"+ hashedUserId +"150";
        
        infoArr.pswhash = getFromStorage("pswHash");
        
        infoArr.userid = userId;
        
        var herp = $.ajax({
            type: "POST",
            url: url,
            dataType: "text",
            data: infoArr
        });
        herp.done(function(data) {
            $("#UI_ELEMENT_TEST").append('<p>done reached</p>');
            $("#UI_ELEMENT_TEST").append('<p>'+ data +'</p>');
            $("#UI_ELEMENT_TEST").append('<p>parsed Pdata, reached IMGdata</p>');
            $("#UI_ELEMENT_TEST").append('<img style="display:block;" id="largeImage" src="'+ data +'" />');
            $("#UI_ELEMENT_TEST").append('<p>data.length: '+ data.length +'</p>');
//            for(var prop in data) {
//                $("#UI_ELEMENT_TEST").append('<p>'+ prop +': '+ data[prop] +'</p>');
//                $("#UI_ELEMENT_TEST").append('<img style="display:block;" id="largeImage" src="'+ data[prop] +'" />');
//            };
            $("#UI_ELEMENT_TEST").append('<p>end of function reached</p>');
        });
        herp.fail(function(data) {
            $("#UI_ELEMENT_TEST").append('<p>fail reached</p>');
            $("#UI_ELEMENT_TEST").append('<p>msg: '+ data.toString() +'</p>');
//            for(var prop in data) {
//                $("#UI_ELEMENT_TEST").append('<p>'+ prop +': '+ data[prop] +'</p>');
//            };
        });
    };
        
    */
    
    
    //object to save the autoupdate of the myShifts to, autoupdateMyShifts is added to the variable at the end of the populateMyShifts method if it is still undefined
    var jsonUpdateMyShiftsObj = false;
    function autoupdateMyShifts() {
        setInterval(function() {
            if(checkConnection()) {
                var url = "https://"+ getFromStorage("domain") +"/ajax/app_myshifts";
                var infoArr = {userid:getFromStorage("userId")}; //what to post, isn't really needed except that we need to pass something into parameter placement of infoArr, since we need to set global to false...
                var ajaxReq = postAJAXCall(url, infoArr, false); //false sets the global option to false, meaning the request will be invisible to the ajaxStart/ajaxStop.
                ajaxReq.done(function(data) {
                    //$("#UI_ELEMENT_TEST").append("<p>data to save: "+ JSON.stringify(data) +"</p>");
                    saveToStorage("savedBookedShifts", JSON.stringify(data));
                });
            };
        }, 150000);
    };
    //object to save the autoupdate of the possibleShifts to, autoupdatepossibleShifts is added to the variable at the end of the populateMyShifts method if it is still undefined
    var jsonUpdatePossibleShiftsObj = false;
    function autoupdatePossibleShifts() {
        setInterval(function() {
            if(checkConnection()) {
                var url = "https://"+ getFromStorage("domain") +"/ajax/app_myshiftplan";
                var infoArr = {userid:getFromStorage("userId")}; //what to post, isn't really needed except that we need to pass something into parameter placement of infoArr, since we need to set global to false...
                var ajaxReq = postAJAXCall(url, infoArr, false); //false sets the global option to false, meaning the request will be invisible to the ajaxStart/ajaxStop.
                ajaxReq.done(function(data) {
                    //$("#UI_ELEMENT_TEST").append("<p>data to save: "+ JSON.stringify(data) +"</p>");
                    saveToStorage("savedPossibleShifts", JSON.stringify(data));
                });
            };
        }, 150000);
    };
    
    //finds out if we already have a login stored, if so it logs in, if not, we're sent to login...
    function hasSavedLogin() {
        if(getFromStorage("pswHash") !== null) {
            
            //this is needed to retrieve saved info from 
            var loginInfo = {usr:getFromStorage("email"), pswhash:getFromStorage("pswHash"), remember:1};
            var domain = getFromStorage("domain");
            if(checkConnection()) { //if online, this will evaluate true, making the app attempt to log on
                //is needed to attempt an automatic AJAX login.
                $.ajax({ //this function has it's own AJAX call because it wasn't worth the time to standardize it and loginEvaluator expects dataType: "text" instead of JSON...
                    type: "POST",
                    url: "https://"+ domain +"/ajax/login",
                    dataType: "text",
                    data: loginInfo
                }).done(function(data) {
                    loginEvaluater(data, loginInfo.usr, domain);
                });
            }else {
                showMenu();
                showMyShifts();
            };
            
        }else {
            //cleans localStorage, when no pswHash was found, to make sure there is no "old dirt"...
            cleanStorage();
            showLogin();
        };
    };
    
    //shows the login screen
    function showLogin() {
        $(body).empty();
        
        setTimeout(function() {
            $(body).append('<h1 class="page-header">NemVagt Login</h1>');
            //the submit btn could be set to .disabled, unless all required fields are filled with data.
            $(body).append('<form id=loginForm role="form" method="post" action="" >\
        <label for="domain">Forenings Domæne</label>\
    <div class="input-group form-group">\
        <span class="input-group-addon">'+ 'https://' +'</span>\
        <input value="" type="url" name="domain" class="form-control" placeholder="adresse">\
        <span class="input-group-addon">'+ '.nemvagt.dk' +'</span>\
    </div>\
    <div class="form-group">\
        <label for="email">Din E-mail</label>\
        <input value="" type="email" class="form-control" id="email" name="usr" placeholder="navn@dinEmail.com">\
    </div>\
    <div class="form-group">\
        <label for="password">Password</label>\
        <input value="" type="password" id="password" name="psw" class="form-control" placeholder="Dit password">\
    </div>\
    <input type="submit" id="loginBtn" value="Login" class="btn btn-success btn-lg" >\
    </form>');

            //we need this to override and handle the onclick event for the login form
            $("#loginBtn").on("click", function(event) {
                event.preventDefault();

                //only try to login if we have an internet connection, notify user if there is no connection
                if(checkConnection()) {
                    var form = $("#loginForm");
                    var email = $('input[name=usr]').val();
                    var domain = $('input[name=domain]').val() +".nemvagt.dk"; //this will be changed when we find a solution for differing domains
                    if($('input[name=domain]').val() !== "") {
                        var ajaxObj = $.ajax({ //this function has it's own AJAX call because it wasn't worth the time to standardize it and loginEvaluator expects dataType: "text" instead of JSON...
                        type: form.attr("method"),
                        url: "https://"+ domain + "/ajax/login",
                        dataType: "text",
                        data: form.serialize() + "&remember=1"
                        });
                        ajaxObj.done(function(data) {
                            setTimeout(function() {
                                loginEvaluater(data, email, domain);
                            }, 10);
                        });
                        ajaxObj.fail(function(data) {
                            setTimeout(function() {
                                showModalViewAccept("Fejl", "<p>Der opstod en fejl i forbindelse med kommunikation med server:<br>+ status: "+ data.status + "; readyState: " + data.readyState +"; statusText: "+ data.statusText +"; responseText:"+ data.responseText +" +</p>");
                            }, 10);
                        });
                    }else {
                        showModalViewAccept("Manglende udfyldning", "<p>Husk at udfylde \"Forenings domæne\"</p>");
                    };
                }else {
                    showModalViewAccept("Ingen internet forbindelse", "<p>Der er ingen forbindelse til internettet og du har ikke et gemt login på telefonen,<br>Opret forbindelse til internettet for at logge ind.</p>");
                };
            });
        }, 10);
    };
    
    //this method evaluates/handles login attempts
    //it requires userInfo(JSON in string format), email(an emails address in string format), domain(the name of the domain, fx mobiludvikling)
    function loginEvaluater(userInfo, email, domain) {
        //simply eval whether the server accepted the login data, then either have the user remain on the login screen (but append a message that tells them their input was wrong)
        //OR send them to "Mine vagter".
        if($.parseJSON(userInfo).hasOwnProperty("email")) {
            if(email === $.parseJSON(userInfo).email && email !== undefined && $.parseJSON(userInfo).email !== undefined) {
                saveToStorage("pswHash" ,$.parseJSON(userInfo).pswhash);
                saveToStorage("email", $.parseJSON(userInfo).email);
                saveToStorage("userId", $.parseJSON(userInfo).id);
                saveToStorage("domain", domain);

                showMenu();
                showMyShifts();
            }else {
                cleanStorage();
                showModalViewAccept("Forkert udfyldning", "<p>Noget var udfyldt forkert!</p>");
            };
        }else {
            cleanStorage();
            showModalViewAccept("Forkert udfyldning", "<p>Noget var udfyldt forkert!</p>");
        };
    };
    
    //shows the "Mine vagter" page
    function showMyShifts() {
        $(body).empty();
        
        setTimeout(function() {
            if(checkConnection()) {
                //actually show shifts here, we need to get the shifts from the server and then create a method that finds out how many shifts are there, what data they contain, then populate.
                //when creating shifts, dynamically add an event listener to every shift here... this is already done further down in the code...
                if(myShiftsFirstUpdate === true) { //checks to see if this is the first time we've opened "myShifts" this time we're using the program, if it is, we'll get JSON from the server
                    //sets myShiftsFirstUpdate to false, so that we will no longer update from internet whenever we navigate to page...
                    myShiftsFirstUpdate = false;
                    //tells us what to POST
                    var toPost = {userid:getFromStorage("userId")};
                    //tells us where to POST to
                    var url = "https://"+ getFromStorage("domain") +"/ajax/app_myshifts";
                    //get the shifts that the person has already voluntered for
                    var ajaxCall = postAJAXCall(url, toPost);
                    ajaxCall.done(function(data) {
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
        }, 10);
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
            var role = '';
            if(object["rolename"] !== undefined && object["rolename"] !== null) {
                role = '<p>Rolle: '+ object["rolename"] +'</p>';
            }

            //adds a title to the shift, if one is provided
            var title = '';
            if(object["title"] !== "") {
                title = '<h4 class="pull-left">'+ object.title +'</h4>';
            };

            //adds a button to unbook the shift to the shift, if the option is provided
            var unbookBtn = '';
            if(object["allowdelete"] === true) {
                unbookBtn = '<button class="btn btn-danger pull-right margBotBtn unBookBtn" style="margin-bottom: '+ relativeSize('2vmin', 2) +'; margin-right: '+ relativeSize('-1vmin', -1) +';">Afmeld vagt</button>'; 
                //a listener is added after it has been appended to body
            };
            
            //gives the shift a color type, if it has one
            var shiftColor = '';
            if(object["color"] !== null && object["color"] !== undefined) {
                shiftColor = '<div style="clear: both; margin-left: '+ relativeSize('-10vmin', -10) +'; heigth: 5px; width: '+ relativeSize('150%', 100) +'; background-color:'+ object["color"] +';"><br></div>';
            };
            
            $(body).append('<div id="'+ object["id"] +'" class="container shiftTarget shift" style="overflow: hidden; border: solid black 1px; margin-bottom: '+ relativeSize('5vmin', 5) +';">\
                '+ shiftColor +'\
                <div>\
                    '+ title +'\
                    <button style="margin-bottom: '+ relativeSize('1vmin', 1) +'; margin-right: '+ relativeSize('-1vmin', -1) +'; margin-top: '+ relativeSize('3vmin', 3) +';" type="button" class="btn bookedDetailsBtn btn-default readMoreBtn pull-right">Vis mere</button>\
                    <h4 style="clear:left;" class="pull-left">'+ getWeekday(object["startdate"]) +' '+ getDate(object["startdate"]) +' <!--'+
                        'Kl: '+ object["starttime"].substring(0,5) +' til '+ object["endtime"].substring(0,5)  +'--></h4>\
                </div>\
                <div style="clear: both;">\
                    <p>Kl: '+ object["starttime"].substring(0,5) +' til '+ object["endtime"].substring(0,5) +'</p>\
                    '+ role +'\
                    '+ unbookBtn +'\
                </div>\
            </div>');
        };
        //adds a listener to the readMore button, so that people can open details
        $(".readMoreBtn").on("click", showMyShiftDetails);
        //adds a listener to the readMore button, so that it updates all the JSON while people are busy reading about a shifts details... THIS MEANS SEVERAL AJAX CALLS MAY BE MADE IN A VERY SHORT TIME, ONCE AFTER THE OTHER, IT MIGHT BE PRUDENT TO FIND A SOLUTION FOR THIS
        $(".readMoreBtn").on("click", updateAllListsReadMoreBtnHandler);
        //adds a listener to the unbookShift buttons, so what they can open the modal dialog window, allowing them to unbook the shift
        $(".unBookBtn").on("click", showModalView);
        
        //starts an autoupdate timer for the myShifts JSON.
        if(jsonUpdateMyShiftsObj === false) {
            jsonUpdateMyShiftsObj = autoupdateMyShifts();
        };
    };

    //shows showPossibleShifts
    function showPossibleShifts() {
        $(body).empty();
        setTimeout(function() {
            if(checkConnection()) {
                //actually show possible shifts here shifts here, we need to get the shifts from the server and then create a method that finds out how many shifts are there, what data they contain, then populate.
                //when creating shifts, dynamically add an event listener to every shift here... this is already done further down in the code...
                if(possibleShiftsFirstUpdate === true) { //checks to see if this is the first time we've opened "myShifts" this time we're using the program, if it is, we'll get JSON from the server
                    //sets possibleShiftsFirstUpdate to false, so that we will no longer update from internet whenever we navigate to page...
                    possibleShiftsFirstUpdate = false;
                    //tells us what to POST, strictly speaking not needed, as postAJAXCall automatically adds userid and pswhash...
                    var toPost = {userid:getFromStorage("userId")};
                    //tells us where to POST to
                    var url = "https://"+ getFromStorage("domain") +"/ajax/app_myshiftplan";
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
        }, 10);
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
//                if(object["roles"]!== undefined) { //right now, roles isn't passed to me at all. Speak to Mark about this... Also, maybe it should be a radial input when dealing with possible shifts
//                    roller = '"<p>Roller: '+ object["roles"] +'</p>"';
//                };
                
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
                
                //there is no check on this as the values should/will always be included and we NEED the calculation later on, so not having it isn't an option anyway...
                //calculates how many freeSpaces we have in the shift
                var freeSpaces;
                if(object["rolemaxmembers"] > 0) {
                    freeSpaces = parseInt(object["rolemaxmembers"])-parseInt(object["taken"]);
                }else {
                    freeSpaces = parseInt(object["maxmembers"])-parseInt(object["taken"]);
                };
                
                
                //adds a button to book the shift, to the shift
                var bookBtn = '';
                if(freeSpaces > 0) {
                    bookBtn = '<button class="btn btn-success pull-right margBotBtn bookBtn" style="margin-bottom: '+ relativeSize('2vmin', 2) +'; margin-right: '+ relativeSize('-1vmin', -1) +';">Tag vagt</button>';
                };
                //a listener is added after it has been appended to body
                
                //adds a button to show details for the shift, only do so if there is any notes...
                var readMoreBtn = '';
                if(object["shiftnotes"] !== '' && object["shiftnotes"] !== null && object["shiftnotes"] !== undefined) {
                    readMoreBtn = '<button style="margin-bottom: 1vmin'+ relativeSize('1vmin', 1) +'; margin-right: '+ relativeSize('-1vmin', -1) +'; margin-top: '+ relativeSize('3vmin', 3) +';" type="button" class="btn btn-default readMoreBtn pull-right">Vis mere</button>';
                };
                //a listener is added after it has been appended to body
                
                //if people can remove the shift from their list of shifts, give them a button to do so...
                var allowNoThanks = '';
                if(object["allownothanks"]) {
                    allowNoThanks = '<button type="button" class="btn btn-default margBotBtn noThanksBtn pull-left" style="margin-bottom: '+ relativeSize('2vmin', 2) +'";>Afvis</button>';
                };
                
                //gives the shift a color type, if it has one
                var shiftColor = '';
                if(object["color"] !== null && object["color"] !== undefined) {
                    shiftColor = '<div style="clear: both; margin-left: '+ relativeSize('-10vmin', -10) +'; heigth: 5px; width: 150%; background-color:'+ object["color"] +';"><br></div>';
                };
                
                $(body).append('<div id="'+ object["id"] +'" class="container shiftTarget shift" style="overflow: hidden; border: solid black 1px; margin-bottom: '+ relativeSize('5vmin', 5) +';">\
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
                        '+ allowNoThanks +'\
                        '+ bookBtn +'\
                    </div>\
                </div>');
            };
        };
        
        //adds a listener to the readMore button, so that people can open details
        $(".readMoreBtn").on("click", showPossibleShiftDetails);
        //adds a listener to the readMore button, so that it updates all the JSON while people are busy reading about a shifts details... This is on a X(30) second timer
        $(".readMoreBtn").on("click", updateAllListsReadMoreBtnHandler);
        //adds a listener to all noThanks buttons
        $(".noThanksBtn").on("click", showModalView);
        //adds a listener to the bookShift buttons, so what they can open the modal dialog window, allowing them to book the shift
        $(".bookBtn").on("click", getRolesBookShift);
        
        //starts an autoupdate timer for the possibleShifts JSON.
        if(jsonUpdatePossibleShiftsObj === false) {
            jsonUpdatePossibleShiftsObj = autoupdatePossibleShifts();
        };
    };
    
    //iterates through a collection of shifts, evaluates which one we want and populates a detail window
    function showMyShiftDetails() {
        
        //gets the id from the button, the button's id is equal to the id of the shift in the JSON...
        var theShift = $(this).closest(".container").attr("id");
        
        //has the admin allowed the user to delete the booked shift? if not, the button option to do so wont be shown...
        var allowDelete;
        
        $(body).empty();
        
        var theShifts = $.parseJSON(getFromStorage("savedBookedShifts"));
        
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
            var shiftColor = '';

            //Checks to see if the id of the shift, from the JSON is equal to the id of the shift we want
            if(object["id"] === theShift) {
                //evaluates if the admin has allowed deletion, is needed to know whether it's okay to delete outside the scope of this for loop
                allowDelete = object["allowdelete"];
                
                //the properties we want is: title, day, date, starttime, endtime, roles(form/dropdown/radio), address, city, notes
                if(object["title"] !== undefined && object["title"] !== "" && object["title"] !== null) { //if there is a title and itisn't === "" or null, var title = title from the JSON
                    title = "<p>"+ "Titel" +": "+ object["title"] +"</p>";
                };
                if(object["notes"] !== undefined && object["notes"] !== "" && object["notes"] !== null) { //if notes exist and aren't null or "", var notes = notes from JSON
                    notes = "<label for=\"notesField\">"+ "Noter fra administrator" +":</label> <div id=\"notesField\" class=\"shift\" style=\"padding:"+ relativeSize('2vmin', 2) +"; margin-bottom:"+ relativeSize('3vmin', 3) +"; border:solid black 1px\"><p>"+ object["notes"] +"</p></div>";
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
                if(object["rolename"] !== undefined && object["rolename"] !== "" && object["rolename"] !== null) { //if roles exists, is not null or "", var roles = roles from JSON
                    roles = "<p>"+ "Rolle" +": "+ object["rolename"] +"</p>";
                };
                if(object["address"] !== undefined && object["address"] !== "" && object["address"] !== null) { //if address exists, is not null or "", var address = adress from JSON
                    address = "<p>"+ "Adresse" +": "+ object["address"] +"</p>";
                };
                if(object["city"] !== undefined && object["city"] !== "" && object["city"] !== null) { //if city exists, is not null or "", var city = city from JSON
                    city = "<p>"+ "By" +": "+ object["city"] +"</p>";
                };
                //gives the shift a color & type, if it has one
                if(object["color"] !== undefined && object["color"] !== null && object["label"] !== undefined && object["label"] !== null) {
                    shiftColor = '<p>Vagt type: '+ object["label"] +'</p><div style="clear: both; margin-top: '+ relativeSize('-2vmin', -2) +'; heigth: 5px; width: 100%; border-radius: 5px; background-color:'+ object["color"] +';"><p><br></p></div>';
                };
                
                //appends the title of the shift to the body, that way, the user knows where they are... if the title is ==="" it outputs "vagten" instead...
                if(object["title"] !== "") {
                    $(body).append('<h1 class="page-header">Detaljer for '+ object["title"] +':</h1>');
                }else {
                    $(body).append('<h1 class="page-header">Detaljer for vagten:</h1>');
                };
                
                //creates a bookBtn
                var unBookBtn = '';
                if(allowDelete === true) {
                    unBookBtn = '<button class="btn btn-danger unBookBtn pull-right margBotBtn" style="margin-bottom: '+ relativeSize('2vmin', 2) +'" type="button">Afmeld vagt</button>';
                };
                
                //adds a back button to the page, so that people can easily get back. OBS would be nice to navigate to the shift they were just viewing, but I'm not sure how to do this...
                var backBtn = '<button class="btn btn-default backBtn pull-left margBotBtn" style="margin-bottom: '+ relativeSize('2vmin', 2) +'">Tilbage</button>';
                
                //add the individual parts of the JSON to the append body, so that it can be viewed. Done this way to be easily modifiable...
                $(body).append('<div id="'+ object["id"] +'" class="shiftTarget">'+ shiftColor+title+date+startTime+endTime+city+address+roles+notes+backBtn+unBookBtn +'</div>'); //wrap div .container and gove it object["id"] as id, important for book/unbook to work
                //sets isBooked to true, letting the function know that it's dealing with a bookedShift as opposed to a possibleShift
                //isBooked = true; may not need this anymore
            };
        };
        
        //adds a listener/function to the back button
        $(".backBtn").on("click", function() {
            showMyShifts();
            setTimeout(function() {
                $("html, body").scrollTop($("#"+ theShift).offset().top-5);
            }, 10);
        });
        //if allow delete is true, append an onclick listener, the conditional is there to make sure we only append if there is a btn
        if(allowDelete === true) {
            $(".unBookBtn").on("click", showModalView);
        };
        
    };
    //evaluates what kind of detail to show, then iterates through a collection of shifts and populates a requested detail
    function showPossibleShiftDetails() {
        
        //gets the id from the button, the button's id is equal to the id of the shift in the JSON...
        var theShift = $(this).closest(".container").attr("id");
        
        $(body).empty();
        
        //retrieves the JSON from localStorage
        var theShifts = $.parseJSON(getFromStorage("savedPossibleShifts"));
        
        //iterates through shifts already booked by the user
        for (var i = 0; i < theShifts.length; i++) {
            //assign the current object containing JSON to "var object", so that I only need to write it once
            var object = theShifts[i];
            
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
                if(object["rolemaxmembers"] > 0) {
                    freeSpaces = parseInt(object["rolemaxmembers"])-parseInt(object["taken"]);
                }else {
                    freeSpaces = parseInt(object["maxmembers"])-parseInt(object["taken"]);
                };
                //if there are any free spaces, show how many there are
                if(freeSpaces > 0) {
                    freeSpacesFormatted = "<p>Der er "+ freeSpaces +" ledige pladser på vagten</p>";
                };
                //if notes aren't null or "", var notes = notes from JSON
                if(object["shiftnotes"] !== undefined && object["shiftnotes"] !== "" && object["shiftnotes"] !== null) {
                    notes = "<label for=\"notesField\">"+ "Noter fra den vagtskema anvarlige" +":</label> <div id=\"notesField\" class=\"shift\" style=\"padding:"+ relativeSize('2vmin', 2) +"; margin-bottom:"+ relativeSize('3vmin', 3) +"; border:solid black 1px\"><p>"+ object["shiftnotes"] +"</p></div>";
                };
                //gives the shift a color & type, if it has one
                if(object["color"] !== undefined && object["color"] !== null && object["label"] !== undefined && object["label"] !== null) {
                    shiftColor = '<p>Vagt type: '+ object["label"] +'</p><div style="clear: both; margin-top: '+ relativeSize('-2vmin', -2) +'; heigth: 5px; width: 100%; border-radius: 5px; background-color:'+ object["color"] +';"><p><br></p></div>';
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
                
                //makes sure whether or not you can take the shift, if you can, then show a bookBtn
                var bookBtn = '';
                if(freeSpaces > 0) { //button should also submit info from your choice of roles, if present...
                    bookBtn = '<button class="btn bookBtn btn-success pull-right margBotBtn" type="button" style="margin-bottom: '+ relativeSize('2vmin', 2) +'">Tag vagt</button>';
                };
                
                //if people can remove the shift from their list of shifts, give them a button to do so...
                var allowNoThanks = '';
                if(object["allownothanks"]) {
                    allowNoThanks = '<button style="margin-left:'+ relativeSize('2vmin', 2) +';" type="button" class="btn btn-default noThanksBtn pull-left">Afvis</button>';
                };
                
                //adds a back button to the page, so that people can easily get back. OBS would be nice to navigate to the shift they were just viewing, but I'm not sure how to do this...
                var backBtn = '<button class="btn backBtn btn-default pull-left margBotBtn" style="margin-bottom: '+ relativeSize('2vmin', 2) +'">Tilbage</button>';
                
                //add the individual parts of the JSON to the append body, so that it can be viewed. Done this way to be easily modifiable...
                $(body).append('<div id="'+ object["id"] +'" class="shiftTarget">'+ shiftColor+title+date+shiftStartTime+shiftEndTime+freeSpacesFormatted+notes+backBtn+allowNoThanks+bookBtn +'</div>');
            };
        };
        
        //adds a listener/function to the back button
        $(".backBtn").on("click", function() {
                showPossibleShifts();
                setTimeout(function() {
                $("html, body").scrollTop($("#"+ theShift).offset().top-5);
            }, 10);
        });
        //appends an onClick listener event on the bookBtn
        $(".bookBtn").on("click", getRolesBookShift);
        //adds a listener on the noThanksBtn
        $(".noThanksBtn").on("click", showModalView);
    };
    
    //shows the "Brugerprofil" page
    function showUserProfile() {
        $(body).empty();
        
        setTimeout(function() {
            if(checkConnection()) {
                //the url to POST to, so we can get our UserProfile JSON
                var url = "https://"+ getFromStorage("domain") +"/ajax/app_userprofile";
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
        }, 10);
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
                if(property === "ftype") {
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
                    }else if(object[property] === "TEXT" || object[property] === "DATE" || object[property] === "EMAIL" || object[property] === "PHONE") {
                        profileFields += createTextField(object);
                        
                    };
                };
                //handles SIZE
//                $("#UI_ELEMENT_TEST").append("<p>about to compare property to clothessize</p>"); // TEST
                if(property === "clothessize") {
//                    $("#UI_ELEMENT_TEST").append("<p>property was clothessize</p>"); // TEST
                    //find SIZE (ie. the users chosen size)
                    var sizeObj = '';
//                    $("#UI_ELEMENT_TEST").append("<p>about to iterate through data to find userSize</p>"); // TEST
                    for(var h = 0; h < data.length; h++) {
//                        $("#UI_ELEMENT_TEST").append("<p>about to iterate through data[h] to find userSize</p>"); // TEST
                        for(var prop in data[h]) {
//                            $("#UI_ELEMENT_TEST").append("<p>about to compare prop to ftype</p>"); // TEST
                            if(prop === "ftype") {
//                                $("#UI_ELEMENT_TEST").append("<p>about to compare data[h][ftype] to SIZE</p>"); // TEST
                                if(data[h]["ftype"] === "SIZE") {
                                    sizeObj = data[h];
//                                    $("#UI_ELEMENT_TEST").append("<p>data[h][ftype] === SIZE, sizeObj = data[i]</p>"); // TEST
                                    break;
                                };
                            };
                        };
                        //is done to stop iterating through the outer array once we have found what we were looking for...
                        if(sizeObj !== '') {
                            break;
                        };
                    };
                    var argObj = {sizeArr:object, userSize:sizeObj};
                    //only proceed if there is a property ftype === SIZE, otherwise, the user profile isn't actually using the SIZE field...
                    if(sizeObj !== '') {
//                        $("#UI_ELEMENT_TEST").append("<p>sizeObj wasn't ''</p>"); // TEST
                        profileFields += createSelectList(argObj);
                    };
                };
//                $("#UI_ELEMENT_TEST").append(property +" : "+ object[property] +";<br>"); // TEST
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
        return '<div class="userProfileElement" style="margin-bottom: '+ relativeSize('5vmin', 5) +'"><label for="'+ object["fieldname"] +'">'+ object["showname"] +':</label><input id="'+ object["fieldname"] +'" type="'+ type +'" name="'+ object["fieldname"] +'" class="form-control" value="'+ object["value"] +'"></div>';
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
        return '<div class="userProfileElement" style="margin-bottom: '+ relativeSize('5vmin', 5) +'"><label for="'+ object["fieldname"] +'">'+ object["showname"] +':</label><textarea id="'+ object["fieldname"] +'" name="'+ object["fieldname"] +'" class="form-control" rows="5" >'+ value +'</textarea></div>';
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
        //returns the formatted form.
        return '<div class="checkbox userProfileElement" style="margin-bottom: '+ relativeSize('5vmin', 5) +'"><label hidden><input hidden type="checkbox" '+ checked +' id="'+ object["fieldname"] +'" name="'+ object["fieldname"] +'" value="1">'+ object["showname"] +'</label> '+ toggleBtn +' <label>'+ object["showname"] +'</label></div>';
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
        if(object.hasOwnProperty("ftype")) {
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
            };
            
            //returns the formatted form
            return '<label for="'+ object["fieldname"] +'">'+ object["showname"] +':</label><select class="form-control userProfileElement" style="margin-bottom: '+ relativeSize('5vmin', 5) +'" id="'+ object["fieldname"] +'" name="'+ object["fieldname"] +'">'+ optionString +'</select>';
            
        }else if(object.hasOwnProperty("sizeArr")) {
//            $("#UI_ELEMENT_TEST").append("<p>object had property sizeArr, object[sizeArr].length: "+ object["sizeArr"].length +"</p>"); // TEST
//            $("#UI_ELEMENT_TEST").append("<p>object had property sizeArr, object[sizeArr][clothessize].length: "+ object["sizeArr"]["clothessize"].length +"</p>"); // TEST
            //add a "pick size" option
            optionString += "<option value=\"\">Vælg størrelse</option>";
            //iterate through the options and create options based on them
            for(var g = 0; g < object["sizeArr"]["clothessize"].length; g++) {
//                $("#UI_ELEMENT_TEST").append("<p>iterating through sizeArr[clothessize], g===: "+ g +"</p>"); // TEST
                var selected = "";
                //if the key(property) corresponds to the value of the value attribute (f.eks. 2991), this is the option that should be selected
//                $("#UI_ELEMENT_TEST").append("<p>object[userSize][value]: "+ object["userSize"]["value"] +"</p>"); // TEST
//                $("#UI_ELEMENT_TEST").append("<p>about to iterate through object[sizeArr][clothessiz]</p>"); // TEST
//                for(var property in object["sizeArr"]["clothessize"]) {
//                    $("#UI_ELEMENT_TEST").append("<p>"+ property +": "+ object["sizeArr"]["clothessize"][property] +"</p>"); // TEST
//                };
//                $("#UI_ELEMENT_TEST").append("<p>object[sizeArr][clothessize]["+ i +"][id]: "+ object["sizeArr"]["clothessize"][i]["id"] +"</p>"); // TEST
//                $("#UI_ELEMENT_TEST").append("<p>object[sizeArr][clothessize]["+ i +"][name]: "+ object["sizeArr"]["clothessize"][i]["name"] +"</p>"); // TEST
                if(object["userSize"]["value"] === object["sizeArr"]["clothessize"][g]["id"]) {
                    selected = "selected=\"selected\"";
                };
                //add the option to the optionString, the key/property will be the value of the option and the value(from the key/value pair; f.eks. "medium") will be shown to the user
                optionString += "<option "+ selected +" value=\""+ object["sizeArr"]["clothessize"][g]["id"] +"\">"+ object["sizeArr"]["clothessize"][g]["name"] +"</option>";
            };
            
            //returns the formatted form
            return '<label for="'+ object["userSize"]["fieldname"] +'">'+ object["userSize"]["showname"] +':</label><select class="form-control userProfileElement" style="margin-bottom: '+ relativeSize('5vmin', 5) +'" id="'+ object["userSize"]["fieldname"] +'" name="'+ object["userSize"]["fieldname"] +'">'+ optionString +'</select>';
//            return '';
        };
    };
    
    //a method to evaluate and if necessary notify users if required fields are left empty
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
                    var theHelpText = "";
                    if(object["helptext"] !== "") {
                        theHelpText = "Hjælp til udfyldning:<br>"+ object["helptext"] +"<br>";
                    };
                    //if something that should be filled out isn't, notify user and display helptext (only tells of/displays help for, the first instance of incorrectly filled form element)
                    showModalViewAccept("Manglende udfyldning", "Feltet \""+ object["showname"] +"\" skal være udfyldt.<br>"+ theHelpText +"<br>Felter der skal være udfyldt og ikke er det, er nu highlighted");
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
        //prevention of the default(synchronous) POST, is already done in isRequiredFieldEmpty
        
        //if all required fields are filled and we have an internet connection
        if(canSubmit) {
            if(checkConnection()) {
                //retrieve the domain from localStorage
                var domain = getFromStorage("domain");
                
                //make the form into a string, so I can POST it as such
                var form = $("#userProfileForm").serialize();
                
                //these are used to check for changes in the userProfile...
                var jsonFromStorage = JSON.parse(getFromStorage("savedUserProfile"));
                var checkForm = $("#userProfileForm").serializeArray();
                //a var that we use to tell if there's been a change in the user profile
                var changesMade = false;
                //check for changes, if none are there, set var changesMade to false
                for(var i = 0; i < checkForm.length; i++) {
                    for(var x = 0; x < jsonFromStorage.length; x++) {
                        
                        //Test that can show the key/value pairs and demonstrates that we DO actually break when we find a change...
//                        $("#UI_ELEMENT_TEST").append("<p>fSfn: "+ jsonFromStorage[x]["fieldname"] +"</p>");
//                        $("#UI_ELEMENT_TEST").append("<p>fSv: "+ jsonFromStorage[x]["value"] +"</p>");
//                        $("#UI_ELEMENT_TEST").append("<p>fFn: "+ checkForm[i]["name"] +"</p>");
//                        $("#UI_ELEMENT_TEST").append("<p>fFv"+ checkForm[i]["value"] +"</p>");
                        
                        if(jsonFromStorage[x]["fieldname"] === checkForm[i]["name"] && jsonFromStorage[x]["value"] !== checkForm[i]["value"]) {
                            changesMade = true;
                            break;
                        };
                    };
                    if(changesMade === true) {
                        break;
                    };
                };
                //if a change was made in the form, let the user submit it
                if(changesMade){
                    modalW.empty();
                    setTimeout(function() {
                        var formattedPswHash = getFromStorage("pswHash");

                        var userid = getFromStorage("userId");

                        var ajaxQuery = $.ajax({
                            type: "POST",
                            url: "https://"+ domain + "/ajax/app_saveuserprofile",
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
                                    showModalViewAccept("Fejl", "Bruger Profilen blev ikke opdateret, dette kan være fordi du har forsøgt at gemme den uden at foretage en ændring.");
                                }, 10);
                            };
                        });
                    }, 10);
                }else {
                    
                    //clean up
                    modalW.empty();
                    body.empty();

                    //refresh from storage
                    populateUserProfile(JSON.parse(getFromStorage("savedUserProfile")));
                    
                    setTimeout(function() {
                        showModalViewAccept("Ingen ændring", "Der er ingen ændringer foretaget i din Brugerprofil og der er derfor ingen grund til at opdatere den.");
                    }, 10);
                };
            }else {
                //clean up
                modalW.empty();
                body.empty();

                //refresh from storage
                populateUserProfile(JSON.parse(getFromStorage("savedUserProfile")));
                
                //timeout is there to make sure the previous modal, from ajaxWatch has time to "un-animate", as it seems that if I dont do that, the "remove this modal view when a modal view becomes hidden" triggers from the other window being removed...
                setTimeout(function() {
                    showModalViewAccept("Manglende netværksforbindelse", "Der er ingen netværksforbindelse og det er derfor ikke muligt at opdatere din profil.");
                }, 10);
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
        //$(menu).empty();
        //<img id="menuIcon" src="img/hamburgerMenu.png" style="position:fixed; width:80%; height:auto;" alt="Menu" >
        
        var styling = 'style="margin-left: 7px; padding: 5px; font-size:16px;"';
        //creates a menu we can see in all pages. Add .navbar-fixed-top if menu should stick to top of screen.
        $(menu).append('<div class="dropdown" id="menu">\
        <button class="btn btn-default btn-lg dropdown-toggle" type="button" id="menu" data-toggle="dropdown">\
        <span id="menuIcon" class="glyphicon glyphicon-th-list"></span></button>\
        <ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="menu">\
          <li role="presentation"><a id="myShiftsMenu" '+ styling +' role="menuitem" tabindex="-1" href="#">Mine vagter</a></li>\
          <li role="presentation"><a id="possibleShiftsMenu" '+ styling +' role="menuitem" tabindex="-1" href="#">Ledige vagter</a></li>\
          <li role="presentation" class="divider"></li>\
          <li role="presentation"><a id="userProfileMenu" '+ styling +' role="menuitem" tabindex="-1" href="#">Mine oplysninger</a></li>\
          <li role="presentation" class="divider"></li>\
          <li role="presentation"><a id="updateJSONMenu" '+ styling +' role="menuitem" tabindex="-1" href="#">Opdater alt</a></li>\
          <li role="presentation" class="divider"></li>\
          <!--<li role="presentation"><a id="myOrganisationsMenu" '+ styling +' role="menuitem" tabindex="-1" href="#" >Vis de steder jeg er frivillig</a></li>\
          <li role="presentation"><a id="possibleOrganisationsMenu" '+ styling +' role="menuitem" tabindex="-1" href="#" >Vis de steder jeg kan blive frivillig</a></li>\
          <li role="presentation" class="divider"></li>\-->\
          <li role="presentation"><a id="logOutMenu" '+ styling +' role="menuitem" tabindex="-1" href="#" >Log ud</a></li>\
        </ul>\
      </div>');
        
//        $("#menuIcon").on("focus", function() {
//            $(this).toggleClass("rotated");
//        });
//        $("#menuIcon").on("blur", function() {
//            $(this).toggleClass("unrotated");
//        });
        
        //these methods are needed to assign "click" events to the menu buttons...
        $("#myShiftsMenu").on("click", showMyShifts);
        $("#possibleShiftsMenu").on("click", showPossibleShifts);
        $("#userProfileMenu").on("click", showUserProfile);
        $("#updateJSONMenu").on("click", updateAllListsMenuHandler);
        $("#logOutMenu").on("click", logOut);
        //the next two might not get to be in the first release, if not included, remember to remove them from the menu above too...
        //$("#myOrganisationsMenu").on("click", showMyOrganisations);
        //$("#possibleOrganisationsMenu").on("click", showPossibleOrganisations);
        
    };
    
    //handles/evaluates success/error from ajax calls, if we get the data from the internet it is returned after being saved, if we can't get it, we get it locally and return it
    //if we get the data locally, we notify the user.
    //Requires a string location where we want to save the data, a string telling us where we are and the data from the ajax call.
    function ajaxSuccesEvaluator(saveLocation, whereAreWe, data) {
        if(data !== undefined && data !== "" && data !== null) { //if succcess was reached in the postAJAXCall function, "data" is returned...
            //save the data to local storage, so it can be reused w/o having to make the AJAX call again
            saveToStorage(saveLocation , JSON.stringify(data));
            return data;
        }else { //if no connection/data === undefined or null or ""
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
    
    //updates myShifts, possibleShifts & myInformation from the server, also updates "savedBookedShifts" & "savedPossibleShifts" in localStorage, when "opdater alt" in menu is pressed, then updates the page you were on
    //might be a few discrepancies in the text above and what the method actually does, especially when it comes to userProfile
    //this method is used by both the menu button updaterAll and by bookShift and unBookShift
    function updateAllListsMenuHandler() {
        //tells us what to POST
        var toPost = {userid:getFromStorage("userId")};
        //tells us the domain to post to
        var domain = getFromStorage("domain");
        //keeps track of whether or not the AJAX call is done
        var myShiftsDone = false;
        //keeps track of whether or not the AJAX call is done
        var possibleShiftsDone = false;
        //keeps track of whether or not the AJAX call is done
        var userProfileDone = true;
        
        //looks at the pageHeader, which allows the conditional statement below to know where we are...
        var whereAmI = $(body).find(".page-header").html();
        if(whereAmI.substring(0,11) === "Mine vagter") {
            whereAmI = 1;
        }else if(whereAmI.substring(0,13) === "Ledige vagter") {
            whereAmI = 2;
        }else if(whereAmI === "Mine oplysninger") {
            whereAmI = 3;
            userProfileDone = false;
        };
        
        //tells myShiftsAJAXObj where to POST to
        var urlMyShifts = "https://"+ domain +"/ajax/app_myshifts";
        //update myShifts
        var myShiftsAJAXObj = postAJAXCall(urlMyShifts, toPost);
        myShiftsAJAXObj.done(function(data) {
            saveToStorage("savedBookedShifts", JSON.stringify(data));
        }).done(function() {
            //tells the system that the list has been updated, so that it wont update again when we navigate to the page, if we hadn't been there before
            myShiftsFirstUpdate = false;
            //Looks at the status of the other ajax queries, if they're done or if we were on this page when we started the update, evaluate what to update, then do so.
            if(possibleShiftsDone && userProfileDone || whereAmI === 1) {
                //evaluates what to update, then does so.
                updateAllListsMenuHandlerUpdateEvaluator(whereAmI);
            }else {
                //tells the method that myShifts is done updating
                myShiftsDone = true;
            };
        });
        
        //tells possibleShiftsAJAXObj where to POST to
        var urlPossibleShifts = "https://"+ domain +"/ajax/app_myshiftplan"; //change XXX to the address needed for POST'ing to possibleShifts
        //update possibleShifts
        var possibleShiftsAJAXObj = postAJAXCall(urlPossibleShifts, toPost);
        possibleShiftsAJAXObj.done(function(data) {
            saveToStorage("savedPossibleShifts", JSON.stringify(data));
        }).done(function() {
            //tells the system that the list has been updated, so that it wont update again when we navigate to the page, if we hadn't been there before
            possibleShiftsFirstUpdate = false;
            //Looks at the status of the other ajax queries, if they're done or if we were on this page when we started the update, evaluate what to update, then do so.
            if(myShiftsDone && userProfileDone || whereAmI === 2) {
                updateAllListsMenuHandlerUpdateEvaluator(whereAmI);
            }else {
                //tells the method that possibleShifts is done updating
                possibleShiftsDone = true;
            };
        });
        //this conditionla is only enter if whereAmI === 3, which means the checks to see if the others are done before updating isn't needed.
        if(!userProfileDone) {
//           //tells userProfileAJAXObj where to POST to
//            var urlUserProfile = "https://"+ domain +"/ajax/app_userprofile";
//            //update userProfile
//            var userProfileAJAXObj = postAJAXCall(urlUserProfile, toPost);
//            userProfileAJAXObj.done(function(data) {
//                //saveToStorage("savedUserProfile", JSON.stringify(data));
//            }).done(function(data) {
            //Looks at the status of the other ajax queries, if they're done or if we were on this page when we started the update, evaluate what to update, then do so.
//                if(possibleShiftsDone && myShiftsDone || whereAmI === 3) {
//                    //evaluates what to update, then does so.
                    updateAllListsMenuHandlerUpdateEvaluator(whereAmI);
//                }else {
//                    //tells the method that userProfile is done updating
//                    userProfileDone = true;
//                };
//            });
        };
    };
    //evaluates what to update in the "updateAllListsMenuHandler" function, then updates it.
    function updateAllListsMenuHandlerUpdateEvaluator(whereAmI) {
        switch (whereAmI) {
                    case 1:
                        showMyShifts();
                        break;
                    case 2:
                        showPossibleShifts();
                        break;
                    case 3:
                        showUserProfile();
                        break;
                    default:
                        //do nothing, we're probably on a details page, and want to stay there, for now.
                        break;
                };
    };
    
    //these are used to administrate the AJAX updates called from the readMore button, so that it wont be called too often...
    var updater = false;
    function updateAllListsReadMoreBtnHandler() {
        if(updater === false) {
            updateAllLists(false);
            updater = true;
            setTimeout(function() {
                updater = false;
            }, 30000);
        };
    };
    
    //updates "savedBookedShifts" & "savedPossibleShifts" in localStorage, global is optional, but defines if the AJAX request will notify the user (will notify unless false)
    //should only be called from updateAllListsReadMoreBtnHandler (that is, from the readMore/details buttons) as it is now...
    function updateAllLists(global) {
        
        //tells us what to POST
        var toPost = {userid:getFromStorage("userId")};
        //tells us the domain to post to
        var domain = getFromStorage("domain");
        //keeps track of whether or not the AJAX call is done
        
        //tells myShiftsAJAXObj where to POST to
        var urlMyShifts = "https://"+ domain +"/ajax/app_myshifts";
        //update myShifts
        var myShiftsAJAXObj = postAJAXCall(urlMyShifts, toPost, global);
        myShiftsAJAXObj.done(function(data) {
            saveToStorage("savedBookedShifts", JSON.stringify(data));
        });
        
        //tells possibleShiftsAJAXObj where to POST to
        var urlPossibleShifts = "https://"+ domain +"/ajax/app_myshiftplan";
        //update possibleShifts
        var possibleShiftsAJAXObj = postAJAXCall(urlPossibleShifts, toPost, global);
        possibleShiftsAJAXObj.done(function(data) {
            saveToStorage("savedPossibleShifts", JSON.stringify(data));
        });
    };
    
    //needed so show the NemVagt logo
    function showLogo() {
        //inserts the "NemVagt" logo in top of all pages.
        $("#lCont").append('<img src="img/NemVagt-Logo.png" class="img-responsive" style="margin-top:'+ relativeSize('1vh', 1) +'; width:'+ relativeSize('32vmin', 32) +';" alt="NemVagt" >');
    };
    
    //is passed a date in the YYYY-MM-DD format and returns the abbreviation of the month name in danish
    function getMonth(data) {
        var aMonth = new Date(data).getMonth();
        var months = {
            0: "jan",
            1: "feb",
            2: "mar",
            3: "apr",
            4: "maj",
            5: "jun",
            6: "jul",
            7: "aug",
            8: "sep",
            9: "okt",
            10: "nov",
            11: "dec"
        };
        return months[aMonth];
    };
    //is passed a date in the YYYY-MM-DD format and returns the weekdays name in danish, is needed to show the name of days
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
    //is passed a date in the YYYY-MM-DD format and returns it in format more easily readable by a most people, ie. DD-MM-YYYY
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
        
        infoArr.user = getFromStorage("email");
        
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
            return false;
        }else {
            return true;
        };
    }
    
    //we need this to make sure html5 storage is available, it's essentially a formality in this app
    function supportsLocalStorage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
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
        }else {
            //do nothing or maybe tell user that local storage is unavailable...
        };
    };
    //when testing is done, this method might replace "cleanStorage()", but make sure "cleanStorage" isn't used then...
    //This method is needed to log out, so that people can log in with a different account...
    function logOut() {
        cleanStorage();
        
         //reset variable to true, so the system will correctly update the list of shifts
        myShiftsFirstUpdate = true;
        //reset variable to true, so the system will correctly update the list of shifts
        possibleShiftsFirstUpdate = true;
        //delete the autoupdateObj for possibleShifts
        jsonUpdatePossibleShiftsObj = false;
        //delete the autoupdateObj for myshifts
        jsonUpdateMyShiftsObj = false;
        
        $(menu).empty();
        $(body).empty();
        
        showLogin();
    };
    
    //is used to show the modal window when trying to book/unbook, if booking a shift, the function needs a string containing a form with roles and a shiftuid.
    function showModalView(argObj) {
                
        var shiftId;
        if(argObj["id"] === undefined) {
            //takes the button that opened this window, then looks for it's closest shiftTarget, which is its shift, then gets the shifts id which is equal to its id in the JSON/server
            shiftId = $(this).closest(".shiftTarget").attr("id");
        }else {
            //technically, I don't use this in the current implementation...
            shiftId = argObj["id"];
        };
        
        
        //$("#UI_ELEMENT_TEST").append("<p>shiftId from modal: "+ shiftId +"</p>");
        var title = '';
        var whereAreWe = ''; // 1===unbook; 2===book; 3===reject;
        if($(this).hasClass("unBookBtn")) {
            title = "Afmeld vagt";
            whereAreWe = 1;
        }else if(argObj["id"] !== undefined) {
            //$("#UI_ELEMENT_TEST").append("<p>this had class bookBtn</p>");
            title = "Tilmeld vagt";
            whereAreWe = 2;
        }else if($(this).hasClass("noThanksBtn")) {
            title = "Afvis";
            whereAreWe = 3;
        };
        
        //gets the title of the modal off of the btn
        //var title = $(this).html(); //if we want to use icons instead of text on the buttons, simply use an "if" to check what is written and assign "title" a value based on that...
        
        //if we want to give the user the option of unbooking a shift
        if(whereAreWe === 1) {
            $(modalW).append('<div class="modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
              <div class="modal-dialog">\
                <div class="modal-content">\
                  <div class="modal-header">\
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                    <h4 class="modal-title" id="myModalLabel">'+ title +'</h4>\
                  </div>\
                  <div class="modal-body">\
                    Er du sikker på at du vil afmelde dig vagten?\
                  </div>\
                  <div class="modal-footer">\
                    <button type="button" class="btn btn-default btn-lg" data-dismiss="modal">Nej</button>\
                    <button id="'+ shiftId +'" type="button" class="btn modalYesBtn btn-default btn-lg">Ja</button>\
                  </div>\
                </div>\
              </div>\
            </div>');
        }else if(whereAreWe === 2) { //if we want to give people the option of booking a shift
            $(modalW).append('<div class="modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
              <div class="modal-dialog">\
                <div class="modal-content">\
                  <div class="modal-header">\
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                    <h4 class="modal-title" id="myModalLabel">'+ title +'</h4>\
                  </div>\
                  <div class="modal-body">\
                    <div id="modalAlert" ></div>\
                    <p>'+ argObj["data"]["msg"] +'</p>\
                    '+ argObj["form"] +'\
                    <button type="button" class="btn btn-default btn-lg" data-dismiss="modal">Nej</button>\
                  </div>\
                </div>\
              </div>\
            </div>');
        }else if(whereAreWe === 3) { //if we want to give people the option of saying "noThanks" to a shift
            $(modalW).append('<div class="modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
              <div class="modal-dialog">\
                <div class="modal-content">\
                  <div class="modal-header">\
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                    <h4 class="modal-title" id="myModalLabel">'+ title +'</h4>\
                  </div>\
                  <div class="modal-body">\
                    Vil du afvise denne vagt?\
                  </div>\
                  <div class="modal-footer">\
                    <button type="button" class="btn btn-default btn-lg" data-dismiss="modal">Nej</button>\
                    <button id="'+ shiftId +'" type="button" class="btn modalYesBtn btn-default btn-lg">Ja</button>\
                  </div>\
                </div>\
              </div>\
            </div>');
        };
        
        //defines the setup changes of the modal, show===true so the modal is shown
        var options = {show: true};
        //applies the changes defined in var options
        $("#myModal").modal(options);
        //sets the title of the modal, so people know where they are
        //$(".modal-title").html(title); is done directly in the html
        
        //applies the unbook/book onClick events
        if(title==="Afmeld vagt") {
            $(".modalYesBtn").on("click", unbookShift);
        }else if(title==="Tilmeld vagt") {
            $(".modalYesBtn").on("click", function(event) {
                bookShift(event, this, argObj);
            });
        }else if(title==="Afvis") {
            $(".modalYesBtn").on("click", postNoThanks);
        };
        
        //makes the "yes" button close the modal window, unless whereAreWe === 2, as we then want it to stay open unless
        if(whereAreWe !== 2) {
            $(".modalYesBtn").on("click", function() {
                $("#myModal").modal("hide");
            });
        }
        
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
    //is used to create a notification modal, which is easy to close and doesn't close on its own, people simply press on "ok" or the backdrop
    function showModalViewAccept(title, content) {
        
        var notiModal = $("#notificationModalCont");
        
        $(notiModal).append('<div class="modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
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
                <button id="modalOkayBtn" type="button" class="btn btn-default btn-lg">OK</button>\
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
            notiModal.empty();
        });
    };
    
    //allows a user to remove a shift from their list of possible shifts
    function postNoThanks() {
        //get the shift id, so we can post it, we need to get it now, before we empty the modal...
        //get the id of the button (this), the afmeld vagt btn's id in the modalView, is the id of the shift...
        var theId = $(this).attr("id");
        //this is called to make sure a potential modal window starts closing, the timeouts further down in the code are there to give the different modals opened time to close
        modalW.empty();
        setTimeout(function() {
            if(checkConnection()) {
                //what to post, it's the id of the shift in question
                var infoArr = {shiftid:theId};
                //create the url, to post to
                var url = "https://"+ getFromStorage("domain") +"/ajax/app_rejectshift";
                
//                infoArr.pswhash = getFromStorage("pswHash");
//        
//                infoArr.userid = getFromStorage("userId");
                
                var ajaxCall = postAJAXCall(url, infoArr);
                
//                var ajaxCall = $.ajax({
//                    type: "POST",
//                    url: url,
//                    dataType: "text",
//                    data: infoArr
//                });
//                ajaxCall.fail(function(data) {
//                    $("#UI_ELEMENT_TEST").append("<p>Fail: "+ data +"</p>");
//                });
//                
                ajaxCall.done(function(data) {
//                    $("#UI_ELEMENT_TEST").append("<p>Done: "+ data +"</p>");
//                    try{
//                        JSON.parse(data);
//                    }catch(e){
//                        $("#UI_ELEMENT_TEST").append("<p>Done: trying to JSON.parse data FAILED</p>");
//                    };
//                    for(var prop in data) {
//                        $("#UI_ELEMENT_TEST").append("<p>"+ prop +": "+ data[prop] +"</p>");
//                    };
                    //data will be true/false, as success/failure
                    if(data["succes"]) {
                        setTimeout(function() {
                            showModalViewAccept("Succes", "Vagten er nu afvist");

                            //calls deleteShiftFromLocalStorage, which takes an id(what to delete) and a saveLocation(where to delete it from AND the context of the call, fx unbookShift)
                            deleteShiftFromLocalStorage(theId, "savedPossibleShifts");
                        }, 10);
                    }else { //notify user of failure
                        setTimeout(function() {
                            showModalViewAccept("Fejl", "Det var ikke muligt at afvise vagten.");
                        }, 10);
                    };
                });
            }else {
                //notify user of missing conenction
                setTimeout(function() {
                    showModalViewAccept("Ingen internet forbindelse", "Der er ingen forbindelse til internettet, det er derfor ikke muligt af afvise vagten.<br>Opret forbindelse til internettet og prøv igen.");
                }, 10);
            };
        }, 10);
    };
    
    //unbooks a shift, may be called from the modal windows opened through both Details and showMyShifts
    function unbookShift() {
        //get the shift id, so we can post it, we need to get it now, before we empty the modal...
        //get the id of the button (this), the afmeld vagt btn's id in the modalView, is the id of the shift...
        var theId = $(this).attr("id");
        //this is called to make sure a potential modal window starts closing, the timeouts further down in the code are there to give the different modals opened time to close
        modalW.empty();
        setTimeout(function() {
            if(checkConnection()) {
                //what to post, it's the id of the shift in question
                var infoArr = {shiftid:theId};
                //create the url, to post to
                var url = "https://"+ getFromStorage("domain") +"/ajax/app_dropshift";
                
                var ajaxCall = postAJAXCall(url, infoArr);
                ajaxCall.done(function(data) {
                    //data will be true/false, as success/failure
                    if(data["succes"]) {
                        setTimeout(function() {
                            showModalViewAccept("Succes", "Du er nu afmeldt vagten");

                            //calls deleteShiftFromLocalStorage, which takes an id(what to delete) and a saveLocation(where to delete it from AND the context of the call, fx unbookShift)
                            //deleteShiftFromLocalStorage(theId, "savedBookedShifts");
                            updateAllListsMenuHandler();
                        }, 10);
                    }else { //notify user of failure
                        setTimeout(function() {
                            showModalViewAccept("Fejl", "Det var ikke muligt at afmelde dig vagten.");
                        }, 10);
                    };
                });
            }else {
                //notify user of missing conenction
                setTimeout(function() {
                    showModalViewAccept("Ingen internet forbindelse", "Der er ingen forbindelse til internettet, det er derfor ikke muligt af afmelde dig vagten.<br>Opret forbindelse til internettet og prøv igen.");
                }, 10);
            };
        }, 10);
    };
    
    //makes an ajaxCall that does the actual booking of the shift, may be called from the modal windows opened through both Details and showPossibleShifts
    function bookShift(event, context, argObj) {
        event.preventDefault();
        
        //takes the button that opened this window, then looks for it's closest container, which is its shift, then gets the shifts id which is equal to the one of its ids that we need in the JSON/server (it has two, shiftuid and id)
        //this is actually no longer needed here, as we simply return the object we were sent...
//        var shiftId = $(context).closest(".shiftTarget").attr("id");
//        $("#UI_ELEMENT_TEST").append("<p>shiftId from bookShift: "+ shiftId +"</p>");
        //get the form from the modal window
        var form = $(context).closest(".shiftTarget").serializeArray();
        
        //will be either true of false, is used later in the function, to know if the form was filled correctly and thus how to proceed
        var formFilled = validateRolePickerForm(form);
        //$("#UI_ELEMENT_TEST").append("<p>formFilled.toString: "+ formFilled.toString() +"</p>");
//        var formString = $(context).closest(".shiftTarget").serialize(); // TEST
        //$("#UI_ELEMENT_TEST").append("<p>form from bookShift: "+ form +"</p>");
//        //the name of the shiftTarget/form is the actual unhashed id of the shift, we need it to delete it locally, which we no longer do, we instead update from server
//        var realShiftId = $(context).closest(".shiftTarget").attr("name");
        //$("#UI_ELEMENT_TEST").append("<p>realId from bookShift: "+ realShiftId +"</p>");
        
        if(formFilled) {
            //this is called to make sure a potential modal window starts closing, the timeouts further down in the code are there to give the different modals opened time to close
            modalW.empty();
            setTimeout(function() {
                if(checkConnection()) {

                    var pswHash = getFromStorage("pswHash");
                    var userId = getFromStorage("userId");

                    //connect shiftuid from the form and the role picked...
                    var sobjects = argObj["data"]["shifts"];
    //                $("#UI_ELEMENT_TEST").append('<p>sobjects.length: '+ sobjects.length +'</p>');
                    for(var i = 0; i < sobjects.length; i++) {
    //                    $("#UI_ELEMENT_TEST").append('<p>formToString: '+ formString +'</p>');
    //                    $("#UI_ELEMENT_TEST").append('<p>form[i]: '+ form[i] +'</p>');
    //                    for(var prop in form[i]) {
    //                        $("#UI_ELEMENT_TEST").append('<p>for each in form[i]: '+ prop +': '+ form[i][prop] +'</p>');
    //                    };
                        if(sobjects[i].hasOwnProperty("roles")) {
							$("#UI_ELEMENT_TEST").append('<p>pre-delete sobjects[i][roleid]'+ sobjects[i]["roleid"] +'</p>');
                            delete sobjects[i]["roles"];
                            sobjects[i].roleid = form[i]["value"]; //HER ER FEJLEN MARK SNAKKEDE OM?
							$("#UI_ELEMENT_TEST").append('<p>post-delete sobjects[i][roleid]'+ sobjects[i]["roleid"] +'</p>');
                        };
                        
                    };

                    //what to post, it's the id of the shift in question
                    var toPost = {pswhash:pswHash, userid:userId, shifts:sobjects};
                    
    //                var toPost = "shiftuid="+ shiftId +"&pswhash="+ pswhash+"&userid="+ userid +"&"+ form; //also add the serialized form contained in the var "form"
                    //create the url, to post to
                    var url = "https://"+ getFromStorage("domain") +"/ajax/app_takethatshift";

                    //take a shift
                    var ajaxCall = postAJAXCall(url, toPost);
    //                var ajaxCall = $.ajax({
    //                    type: "POST",
    //                    url: url,
    //                    dataType: "JSON",
    //                    data: toPost,
    //                    success: function(data) {
    //                        return data;
    //                    },
    //                    error: function() {
    //                        $(body).append("<p>Something went wrong in postAJAXCall</p>"+"<p>status: "+ error.status + "; readyState: " + error.readyState +"; statusText: "+ error.statusText +"; responseText:"+ error.responseText +";</p>");
    //                    }
    //                });

                    ajaxCall.done(function(data) {
                        if(data["succes"]) {
                        setTimeout(function() {
                                showModalViewAccept("Succes", "Du er nu tilmeldt vagten");

                                //calls deleteShiftFromLocalStorage, which takes an id(what to delete) and a saveLocation(where to delete it from AND the context of the call, fx unbookShift)
                                //deleteShiftFromLocalStorage(realShiftId, "savedPossibleShifts");
                                updateAllListsMenuHandler();
                            }, 10);
                        }else { //notify user of failure
                        setTimeout(function() {
                                showModalViewAccept("Fejl", "Det var ikke muligt at tilmelde dig vagten.");
                            }, 10);
                        };
                    });
                }else {
                    //notify user of missing connection
                    setTimeout(function() {
                        showModalViewAccept("Ingen internet forbindelse", "Der er ingen forbindelse til internettet, det er derfor ikke muligt af tilmelde dig vagten.<br>Opret forbindelse til internettet og prøv igen.");
                    }, 10);
                };
            }, 10);
        }else { //notify user that form wasn't filled out correctly
            setTimeout(function() {
                $("#modalAlert").html('<p class="text-danger">Husk at vælge rolle</p>');
            }, 10);
        };
    };
    //validate if a correct role is picked, essentially we will check that the value of "roleid" !== 0, takes an array/object
    function validateRolePickerForm(form) {
        for(var i = 0; i < form.length; i++) {
            var object = form[i];
            //the form will have properties that aren't called value, so to make sure it wont fail, only check value ===, if the property value is present and only where it is value...
            if(object.hasOwnProperty("value")) {
                if(object["value"] === "0") {
                    //a role wasn't picked correctly, so return false, so that the validater in the calling class knows.
                    return false;
                };
            };
        };
        //if everything was filled out correctly, we will parse the loop w/o entering the innermost conditional and simply return true here.
        return true;
    };
    //a function which is called when people try to book a shift
    function getRolesBookShift() {
        //takes the button that opened this window, then looks for it's closest container, which is its shift, then gets the shifts id which is equal to its id in the JSON/server
        var shiftId = $(this).closest(".shiftTarget").attr("id");
        
        //this is called to make sure a potential modal window starts closing, the timeouts further down in the code are there to give the different modals opened time to close
        modalW.empty();
        setTimeout(function() {
            if(checkConnection()) {
                //what to post, it's the id of the shift in question
                var infoArr = {shiftid:shiftId};
                //create the url, to post to
                var url = "https://"+ getFromStorage("domain") +"/ajax/app_shiftdetails";
                
//                infoArr.pswhash = getFromStorage("pswHash");
//                infoArr.userid = getFromStorage("userId");
                
                //get the roles which we can pick(if any) and freeSpaces
                var ajaxCall = postAJAXCall(url, infoArr);
//                var ajaxCall = $.ajax({ // TEST START
//                    type: "POST",
//                    url: url,
//                    dataType: "TEXT",
//                    data: infoArr}); // TEST END
                
                //iterate through the data we got with roles then make a string containing a form and open a modal and parse it the string
                ajaxCall.done(function(data) {
                    //in these functions we open the modal with the form in it... when okay is pressed in that window: submit;
//                    $("#UI_ELEMENT_TEST").append('<p>ajaxDataAsString: '+ data +'</p>'); // TEST
//                    $("#UI_ELEMENT_TEST").append('<p>done reached...</p>');
                    if(data["succes"]) {
//                        $("#UI_ELEMENT_TEST").append('<p>succes reached...</p>');
                        //only really used to pass to the argObj, to pass on and let the modal know that we're trying to book a shift...
                        var shiftuid = data["shifts"][0]["shiftuid"];
//                        $("#UI_ELEMENT_TEST").append('<p>data[shifts][0][shiftuid]: '+ shiftuid +'</p>');
                        //create the start of the form, we do it before we enter the for loop, that iterates through all the shifts and adds them to the form.
                        var rolePickForm = '<form id="'+ data["shifts"][0]["shiftuid"] +'" name="'+ shiftId +'" class="form-group shiftTarget" role="form" method="post" action="">';
//                        $("#UI_ELEMENT_TEST").append('<p>first add to the form: '+ rolePickForm +'</p>');
                        //iterate through all the shifts you're about to take
//                        $("#UI_ELEMENT_TEST").append('<p>data[shifts].length: '+ data["shifts"].length +'</p>');
                        for(var i = 0; i < data["shifts"].length; i++) {
//                            $("#UI_ELEMENT_TEST").append('<p>iterate thorugh the shifts</p>');
                            var sdata = data["shifts"][i];
//                            $("#UI_ELEMENT_TEST").append('<p>sdata set to data[shifts][i], trying to for each sdata</p>');
//                            for(var prop in sdata) {
//                                $("#UI_ELEMENT_TEST").append('<p>'+ prop +': '+ sdata[prop] +'</p>');
//                            };
                            //create a var which contains the rolePickForm, which we'll submit regardless of whether or not there are roles
                            var dataVar = '<div><label for="'+ sdata["shiftuid"] +'">Dato:</label><input readonly="readonly" id="'+sdata["shiftuid"]+ '" type="TEXTFIELD" name="'+ sdata["shiftuid"] +'" class="userProfileElement form-control" style="margin-bottom: '+ relativeSize('5vmin', 5) +'" value="'+ getWeekday(sdata["startdate"]) +' '+ parseInt(getDate(sdata["startdate"]).substring(0,2), 10) +'. '+ getMonth(sdata["startdate"]) +' '+ getDate(sdata["startdate"]).substring(6, 10) +', fra kl: '+ sdata["starttime"].substring(0,5) +' - '+ sdata["endtime"].substring(0,5) +'"></div>';
                            //create the form string we'll be submitting
                            //if there are roles, make an appropriate select input
                            if(sdata.hasOwnProperty("roles")) {
//                                $("#UI_ELEMENT_TEST").append('<p>sdata[roles].length: '+ sdata["roles"].length +'</p>');
//                                $("#UI_ELEMENT_TEST").append("<p>roles was bigger than 0</p>");
                                var optionsString = '';
                                var object = sdata["roles"];
                                //create the options for the select
//                                $("#UI_ELEMENT_TEST").append("<p>create optionsSting</p>");
                                if(object.length === 1) {
                                    for(var i = 0; i < object.length; i++) {
                                        optionsString += "<option selected=\"selected\" name="+ object[i]["roleid"] +" value="+ object[i]["roleid"] +">"+ object[i]["rolename"] +"</option>";
										$("#UI_ELEMENT_TEST").append("<p>"+ object[i]["roleid"] +"</p>"); //FEJLEN MARK SNAKKEDE OM?
                                    };
                                }else {
                                    optionsString += "<option selected=\"selected\" name=\"standard\" value=\"0\">Vælg en rolle</option>";
                                    for(var i = 0; i < object.length; i++) {
                                        optionsString += "<option name="+ object[i]["roleid"] +" value="+ object[i]["roleid"] +">"+ object[i]["rolename"] +"</option>";
										$("#UI_ELEMENT_TEST").append("<p>"+ object[i]["roleid"] +"</p>"); //FEJLEN MARK SNAKKEDE OM?
                                    };
                                };
//                                $("#UI_ELEMENT_TEST").append("<p>optionsString created</p>");
                                
                                //add a label for the shift, telling us when the shift is held
                                //rolePickForm += '<p>Dato: '+ getDate(sdata["startdate"]) +' '+ sdata["starttime"].substring(0,5) +' - '+ sdata["endtime"].substring(0,5) +'</p>';
                                rolePickForm += dataVar;
//                                $("#UI_ELEMENT_TEST").append("<p>date p was added</p>");
                                //create the select, with the created options
                                rolePickForm += '<select class="form-control userProfileElement" style="margin-bottom: '+ relativeSize('5vmin', 5) +'" name="roleid">'+ optionsString +'</select>';
                                
//                                $("#UI_ELEMENT_TEST").append("<p>optionsString and select added to rolePickForm var</p>");
                                
                            //if there are no roles property in the shift
                            }else {
//                                $("#UI_ELEMENT_TEST").append("<p>roles was 0 or less</p>");
                                //rolePickForm += '<p>Dato: '+ getDate(sdata["startdate"]) +' '+ sdata["starttime"].substring(0,5) +' - '+ sdata["endtime"].substring(0,5) +'</p>';
                                rolePickForm += dataVar;
//                                $("#UI_ELEMENT_TEST").append('<p>no roles, dato add: '+ rolePickForm +'</p>');
                            };
                        };
                        //make it so the submitBtn reflects whether or not there are one or more shifts
                        var submitBtnText;
                        if(data["shifts"].length > 1) {
                            submitBtnText = "Tag vagter";
                        }else {
                            submitBtnText = "Tag vagt";
                        };
                        
                        //append a submit btn to the form and close it
                        rolePickForm += '<button type="submit" class="btn modalYesBtn btn-success btn-lg pull-right bookBtn" id="submitRolePickerForm">'+ submitBtnText +'</button> </form>';
//                        $("#UI_ELEMENT_TEST").append("<p>button added to rolePickForm and form closed</p>");
//                        $("#UI_ELEMENT_TEST").append("<p>"+ rolePickForm +"</p>");
                        
                        //what to pass on to the next function (ie. the modal that allows you to pick roles and accept the shift).
                        var argObj = {form:rolePickForm, id:shiftuid, data:data};
                        
                        //opens the modal and parses it the string with the form and the shiftuid...
                        setTimeout(function() {
//                            $("#UI_ELEMENT_TEST").append("<p>trying to open showModalView</p>");
                            showModalView(argObj);
                        }, 10);
                        
                    }else { //if succes isn't true, it should be false and if so, there are no more free slots/spaces for the shift
                        //notify user that last slot was just filled... display data["MSG"] in content of modal
                        //$("#UI_ELEMENT_TEST").append("<p>fail</p>");
                        setTimeout(function() {
                            showModalViewAccept("Fejl ved tilmeldings check", data["msg"]);
                        }, 10);
                    };
                });
            }else {
                //notify user of missing connection
                setTimeout(function() {
                    showModalViewAccept("Ingen internet forbindelse", "Der er ingen forbindelse til internettet, det er derfor ikke muligt af tilmelde dig vagten.<br>Opret forbindelse til internettet og prøv igen.");
                }, 10);
            };
        }, 10);
        
    };
    
    //a function which is called from unbookShift and bookShift, it deletes a shift from appropriate list in localStorage and calls the appropriate "populate" method with the new data
    function deleteShiftFromLocalStorage(id, saveLocation) {
        var storedJSON = JSON.parse(getFromStorage(saveLocation));
        
        storedJSON = $.grep(storedJSON, function(object) {
            return object["id"] !== id;
        });
        saveToStorage(saveLocation, JSON.stringify(storedJSON));
        if(saveLocation === "savedBookedShifts") {
            body.empty();
            populateMyShifts(storedJSON);
        }else if(saveLocation === "savedPossibleShifts") {
            body.empty();
            populatePossibleShifts(storedJSON);
        };
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
            
            //grabs the nearest checkbox and add/remove the checked prop...
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