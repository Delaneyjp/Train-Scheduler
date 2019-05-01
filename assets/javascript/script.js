$(document).ready(function () {

    // initialize Firebase -->

    var config = {
        apiKey: "AIzaSyD0FXQi87dYgRctXJLV5ZVzLQ6uNydMFwc",
        authDomain: "del-station-train-scheduler.firebaseapp.com",
        databaseURL: "https://del-station-train-scheduler.firebaseio.com",
        projectId: "del-station-train-scheduler",
        storageBucket: "del-station-train-scheduler.appspot.com",
        messagingSenderId: "526843781579"
    };
    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();


    // Add train to Firebase

    $("#submitButton").on("click", function () {
        // Grabs train input
        var trainName = $("#trainNameInput").val().trim();
        var destination = $("#destinationInput").val().trim();
        var arrivalTime = $("#arrivalTimeInput").val().trim();
        var frequency = $("#frequencyInput").val().trim();
        var update = "";

        console.log(trainName);
        console.log(destination);
        console.log(arrivalTime);
        console.log(frequency);

        // TESTING FUNCTION SO FAR
        // $("#train-column").text(snapshot.val().trainName);
        // $("#train-destination").text(snapshot.val().destination);
        // $("#train-arrival").text(snapshot.val().arrivalTime);
        // $("#train-freq").text(snapshot.val().frequency);

        // database.ref().push({
        //     trainName: trainName,
        //     destination: destination,
        //     arrivalTime: arrivalTime,
        //     frequency: frequency,
        // });

        // temporary object to holding train data
        var newTrain = {
            trainName: trainName,
            destination: destination,
            arrivalTime: arrivalTime,
            frequency: frequency,
        }

        // Upload train data to Firebase
        // database.push
        database.ref().push(newTrain);
    });


    // When a firebase event is detected, add a row for the new train
    database.ref().on("child_added", function (childSnapshot) {

        // Store everything into a variable.
        var trainName = childSnapshot.val().trainName;
        var destination = childSnapshot.val().destination;
        var startTime = childSnapshot.val().arrivalTime;
        var frequency = childSnapshot.val().frequency;


        // Calculate mins to next train
        var currentTime = moment();
        startTime = moment(startTime, "HH mm");


        var minutesUntilNextTrain;
        var nextArrival;
        var maxMoment = moment.max(moment(), startTime);

        if (maxMoment === startTime) {
            //start time is in future
            minutesUntilNextTrain = startTime.diff(moment(), 'minutes');
            nextArrival = startTime;
        }
        else {
            //start time is in past
            minutesUntilNextTrain = frequency - moment().diff(startTime, 'minutes') % frequency;
            nextArrival = moment().add(minutesUntilNextTrain, 'minutes');
        }
        console.log(nextArrival.format('hh:mm'));



        // Add each train's data into the table 
        $("#trainTable > tbody").append("<tr><th>" + trainName + "</th><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival.format('hh:mm A') + "</td><td>" + minutesUntilNextTrain + "</td></tr>");
    });

    // Start Clock With Current Time
    function StartClockNow() {
        clockInterval = setInterval(function () {
            $("#currentTime").html(moment().format("hh:mm:ss A"));

        }, 1000);
    }

    StartClockNow()
});
