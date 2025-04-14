import { app } from "./app.js";
import mongooseConnection from "./src/db/mongoConnection.db.js";
import "dotenv/config";

mongooseConnection()
  .then(
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Server running at http://localhost:${process.env.PORT || 5000}`
      );
    })
  )
  .catch((error) => {
    console.log(`Error while Creating App!${error.message}`);
  });
