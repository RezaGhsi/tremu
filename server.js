const mongoose = require("mongoose");

const app = require("./app");

(async () => {
  try {
    await mongoose.connect(process.env.MCString);
    console.log("Connected to DB successfully");
  } catch (err) {
    if (err) throw err;
    process.exit(0);
  }
})();

const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Running On Port ${port}`);
});
