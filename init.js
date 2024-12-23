const mongoose = require("mongoose");
const Chat = require("./models/chat.js");


main().then(() => { console.log("connection successfull"); })
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

let allChats = [
    {
        from: "Priya",
        to: "Neha",
        msg: "Send me ur exam sheets",
        created_at: new Date(),
    },
    {
        from: "Saniya",
        to: "Saif",
        msg: "Hello my Cute Little Brother",
        created_at: new Date(),
    },
    {
        from: "abc",
        to: "def",
        msg: "abcdefghijk",
        created_at: new Date(),
    },
    {
        from: "pqr",
        to: "stu",
        msg: "pqrstuvwxyz",
        created_at: new Date(),
    },
];

Chat.insertMany(allChats);

