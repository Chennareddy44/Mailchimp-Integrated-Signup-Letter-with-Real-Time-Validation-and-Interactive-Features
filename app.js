const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function (req, res) {
    const lastName = req.body.lname;
    const email = req.body.email;
    const firstName = req.body.fname;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: { // corrected typo in merge_fields
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data); // corrected to pass in data instead of "data"

    const url = "https://us21.api.mailchimp.com/3.0/lists/30f829b8c8"; // corrected typo in URL

    const options = { // corrected typo in variable name and added missing closing brace
        method: "POST",
        auth: "chenna44:495f8bdc156044e279cb1fff11778fa7-us21"
    };

    const request = https.request(url, options, function (response) { // corrected to use options variable instead of Options

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});


app.post("/failure.html", function (req, res) {
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("server is running on port : 3000");
});
