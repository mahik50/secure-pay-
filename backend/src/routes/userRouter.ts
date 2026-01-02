import { Router } from "express";
import { createAccount, searchUser, sendMoneyTo, showHistory, userLogin, userLogout, userSignup } from "../controllers/userControllers.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

export const router = Router();

router.route("/signup").post(userSignup);
router.route("/login").post(userLogin);
router.route("/logout").post(verifyJWT, userLogout)
router.route("/create-account").post(createAccount)
router.route("/search-user").post(searchUser);
router.route("/send-money-to/:to").post(sendMoneyTo)
router.route("/show-history").post(showHistory);