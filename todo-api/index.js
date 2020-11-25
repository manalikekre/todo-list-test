const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
//connection to db
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.connect(
  process.env.CONNECTIONSTRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) {
      console.log(err);
    }
    module.exports = client;
    const app = require("./app");
    app.listen(process.env.PORT, () => console.log("Server Up and running"));
  }
);
