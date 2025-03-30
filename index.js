import { app } from "./app.js";
import mongooseConnection from "./src/db/mongoConnection.db.js";
import "dotenv/config";

mongooseConnection()
  .then(
    app.listen(process.env.PORT || 500, () => {
      console.log(`Server runing at http://localhost:${process.env.PORT}`);
    })
  )
  .catch((error) => {
    console.log(`Error while Creating App!${error.message}`);
  });
