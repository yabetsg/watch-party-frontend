import express from "express";
import { create_user, login_user } from "../controllers/userController";
const router = express.Router()


router.post("/login",login_user)
router.post("/signup",create_user)

export default router