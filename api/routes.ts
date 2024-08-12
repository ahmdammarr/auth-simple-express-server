import { Router } from "express";
import bcrypt from "bcryptjs";
import {
  getUsers,
  saveUsers,
  generateAccountNumber,
  generateBalance,
} from "./utils";
import { User, AuthenticatedRequest } from "./types";
import { generateAccessToken, authenticateToken } from "./middleware";

const router = Router();

router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;

  const { prefferedlang, country } = req?.headers as {
    country: string;
    prefferedlang: string;
  };

  if (!email || !username || !password || !country || !prefferedlang) {
    return res.status(400).send("ALL_FIELDS_REQUIRED");
  }

  console.log(`Signup request received: ${JSON.stringify(req.body)}`);

  const users = await getUsers(country as string);

  console.log(`Users loaded: ${JSON.stringify(users)}`);

  if (users.some((user) => user.email === email)) {
    return res.status(400).send("ALREADY_EXISITED");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      email,
      username,
      password: hashedPassword,
      country,
      details: {
        accountNumber: generateAccountNumber(),
        balance: generateBalance(),
      },
    };

    users.push(newUser);
    await saveUsers(country, users);

    const accessToken = generateAccessToken({ email });

    res.status(201).json({ accessToken });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("SERVER_ERROR");
  }
});

router.post("/signin", async (req, res) => {
  const { email, password, username } = req.body;
  const { prefferedlang, country } = req?.headers as {
    country: string;
    prefferedlang: string;
  };

  if (!(email || username) || !password || !country || !prefferedlang) {
    return res.status(400).send("ALL_FIELDS_REQUIRED");
  }

  const users = await getUsers(country);
  const user =
    users.find((user) => user.email === email) ||
    users.find((user) => user.username === username);

  if (!user) {
    return res.status(400).send("NOT_FOUND");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).send("INVALID_PASSWORD");
  }

  const accessToken = generateAccessToken({ email });

  res.status(200).json({ accessToken });
});

router.get("/validate-token", authenticateToken, (req, res) => {
  res
    .status(200)
    .json({ message: "VALID", user: (req as AuthenticatedRequest).user });
});

router.get("/account", authenticateToken, async (req, res) => {
  const { email } = (req as any).user;
  const { country } = req?.headers as {
    country: string;
  };
  if (!country) {
    return res.status(400).send("COUNTRY_IS_REQUIRED");
  }

  const users = await getUsers(country);
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(404).send("NOT_FOUND");
  }

  res.status(200).json({ details: user.details });
});

export default router;
