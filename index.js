const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const app = express()
const mongoose = require("mongoose")
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/passkey").then(function () {
    console.log("connected to DB successfully")
}).catch(function () {
    console.log("not connected to db")
})

const credential = mongoose.model("credential", {}, "bulkmail")







app.post("/sendmail", function (req, res) {
    var msg = req.body.msg
    var emailList = req.body.emailList

    credential.find().then(function (data) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            },
        });
        new Promise(async function (resolve, reject) {
            try {
                for (var i = 0; i < emailList.length; i++) {
                    await transporter.sendMail(
                        {
                            from: "ramh75379@gmail.com",
                            to: emailList[i],
                            subject: "A message from bulk mail app",
                            text: msg
                        }
                    )
                    console.log("Email send to" + emailList[i])
                }
                resolve("Success")
            }
            catch (error) {
                reject("failed")
            }
        }).then(function () {
            res.send(true)
        }).catch(function () {
            res.send(false)
        })


    }).catch(function (error) {
        console.log(error)
    })


})

app.listen(5000, function () {
    console.log("server started...")
})