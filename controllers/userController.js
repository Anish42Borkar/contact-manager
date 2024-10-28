import expressAsyncHandler from "express-async-handler";
import { constants } from "../constant.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// @desc register user
// @route POST /api/register
// @access public
const registerUser = expressAsyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("all fields are required");
  }

  try {
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("User Already registered!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    res.status(201).json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(constants.VALIDATION_ERROR);
      const err = new Error(error.message);
      err.details = error.errors;
      throw err;
    } else {
      res.status(500);
      const err = new Error(error.message);
      err.details = error.errors;
      throw err;
    }
  }
});

// @desc login user
// @route POST /api/login
// @access public
const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("All field are required");
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            username: user.username,
            email: user.email,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );
      res.status(200).json({ accessToken });
    } else {
      res.status(constants.UNAUTHORIZED);
      throw new Error("Email or password does not match!");
    }
  } catch (error) {
    res.status(500);
    throw new Error("server error");
  }
});

// @desc current user
// @route GET /api/current
// @access public
const currentUser = expressAsyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

export { registerUser, loginUser, currentUser };
