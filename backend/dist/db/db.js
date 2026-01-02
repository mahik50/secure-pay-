import { client } from "../utility/client.js";
export const connectDB = async () => {
    await client.$connect()
        .then(() => {
        console.log("Connected to DB");
    })
        .catch((err) => {
        console.log("Error in Connecting to DB", err);
    });
};
//# sourceMappingURL=db.js.map