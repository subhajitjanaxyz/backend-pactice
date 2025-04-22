import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
const router =Router();
router.post("/b",registerUser)
// router.route("/b").post(registerUser)


export default router 