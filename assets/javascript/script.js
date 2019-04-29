$(document).ready(function () {

    //initialize Firebase

    var config = {
        apiKey: "AIzaSyD0FXQi87dYgRctXJLV5ZVzLQ6uNydMFwc",
        authDomain: "del-station-train-scheduler.firebaseapp.com",
        databaseURL: "https://del-station-train-scheduler.firebaseio.com",
        projectId: "del-station-train-scheduler",
        storageBucket: "del-station-train-scheduler.appspot.com",
        messagingSenderId: "526843781579"
    };
    firebase.initializeApp(config);

    var database = new Firebase("https://del-station-train-scheduler.firebaseio.com/");

    // Add train to Firebase

    $("#sumbitNewTrain").on("click", function () {
        // Grabs train input
        var trainName = $("#trainNameInput").val().trim();
        var destination = $("#destinationInput").val().trim();
        var arrivalTime = $("#arrivalTimeInput").val().trim();
        var frequency = $("#frequencyInput").val().trim();
        var update = "";

        // temporary object to holding train data
        var newTrain = {
            trainName: trainName,
            destination: destination,
            arrivalTime: arrivalTime,
            frequency: frequency,
        }

        // Upload train data to Firebase
        database.push(newTrain);

        // Clears all of the text-boxes
        $("#trainNameInput").val("");
        $("#destinationInput").val("");
        $("#arrivalTimeInput").val("");
        $("#frequencyInput").val("");
    });

    // When a firebase event is detected, add a row for the new train
    database.on("child_added", function (childSnapshot, prevChildKey) {

        // Store everything into a variable.
        var trainName = childSnapshot.val().trainName;
        var destination = childSnapshot.val().destination;
        var arrivalTime = childSnapshot.val().arrivalTime;
        var frequency = childSnapshot.val().frequency;

        // Calculate mins to next train
        var currentTime = moment();
        arrivalTime = moment(arrivalTime, "HH mm");

        if (currentTime < arrivalTime) {
            var arrivalTime = moment(arrivalTime).format("HH:mm");
            var nextTrain = moment.duration(arrivalTime.diff(currentTime));
            var nextTrain = Math.round(nextTrain.asMinutes());
        } else {
            var nextTrain = moment.duration(currentTime.diff(arrivalTime));
            var nextTrain = Math.round(nextTrain.asMinutes());
            var nextTrain = frequency - (nextTrain % frequency);
            var arrivalTime = moment().add(nextTrain, "minutes").format("HH:mm");
        }

        // Add each train's data into the table 
        $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + arrivalTime + "</td><td>" + nextTrain + "</td></tr>");
    });

    // Start Clock With Current Time
    function StartClockNow() {
        clockInterval = setInterval(function () {
            //Display clock
            $("#currentTime").html(moment().format("H:mm"));

            //update the screen every minute
            $("#trainEntries").empty();
            database.once("value", function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    var key = childSnapshot.key();
                    var childData = childSnapshot.val();
                    // Store everything into a variable.
                    var trainName = childSnapshot.val().trainName;
                    var destination = childSnapshot.val().destination;
                    var arrivalTime = childSnapshot.val().arrivalTime;
                    var frequency = childSnapshot.val().frequency;

                    // Calculate mins to next train
                    var currentTime = moment();
                    arrivalTime = moment(arrivalTime, "HH mm");

                    if (currentTime < arrivalTime) {
                        var arrivalTime = moment(arrivalTime).format("HH:mm");
                        var nextTrain = moment.duration(arrivalTime.diff(currentTime));
                        var nextTrain = Math.round(nextTrain.asMinutes());
                    } else {
                        var nextTrain = moment.duration(currentTime.diff(arrivalTime));
                        var nextTrain = Math.round(nextTrain.asMinutes());
                        var nextTrain = frequency - (nextTrain % frequency);
                        var arrivalTime = moment().add(nextTrain, "minutes").format("HH:mm");
                    }

                    // Add each train's data into the table 
                    $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + arrivalTime + "</td><td>" + nextTrain + "</td></tr>");
                });

            });

        }, 1000 * 60);
    }

    $("#currentTime").html(moment().format("H:mm"));
    StartClockNow()

});