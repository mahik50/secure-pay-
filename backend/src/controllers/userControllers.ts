import { Prisma } from "@prisma/client";
import { client } from "../utility/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateAccessToken = function (userId: number): string {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is missing");
  }
  return jwt.sign(
    {
      id: userId,
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

const generateRefreshToken = function (userId: number) {
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  if (!REFRESH_TOKEN_SECRET) {
    throw new Error("REFESH_TOKEN_SECRET is missing");
  }
  return jwt.sign(
    {
      id: userId,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

export const userSignup = async (req: any, res: any) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(302).json({
      message: "All fields are required",
    });
  }

  const existingUser = await client.user.findFirst({
    where: { email },
  });
  if (existingUser) {
    return res.status(302).json({
      message: "User already exists",
    });
  }

  // encrypt password before inserting into db
  const encryPass = await bcrypt.hash(password, 10);
  const newUser = await client.user.create({
    data: {
      email,
      username,
      password: encryPass,
      account: {
        create: {
          balance: new Prisma.Decimal(500),
        },
      },
    },
    include: {
      account: true,
    },
  });

  const createdUser = await client.user.findFirst({
    where: { id: newUser.id },
    select: {
      email: true,
      username: true,
    },
  });
  if (!createdUser) {
    return res.status(302).json({
      message: "Error in Creating the User",
    });
  }

  return res.status(200).json({
    message: "Signup Successful",
    createdUser,
  });
};

export const userLogin = async (req: any, res: any) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const existingUser = await client.user.findUnique({
    where: { username: username },
  });
  if (!existingUser) {
    return res.status(404).json({
      message: "User does not exists",
    });
  }
  console.log(existingUser);

  // password validation
  const isValidPassword = await bcrypt.compare(password, existingUser.password);

  if (!isValidPassword) {
    return res.status(401).json({
      messgae: "Invalid Password",
    });
  }

  const accessToken: string = generateAccessToken(existingUser.id);
  const refreshToken: string = generateRefreshToken(existingUser.id);

  const options = {
    httpOnly: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      message: "Login Successful",
      accessToken,
      refreshToken,
    });
};

export const userLogout = async (req: any, res: any) => {
  const { username } = req.user;

  if (username === null) {
    return res.status(400).json({
      message: "Username is null, Required",
    });
  }

  const user = await client.user.findUnique({
    where: { username },
  });

  if (user === null) {
    return res.status(400).json({
      message: "User does not exists",
    });
  }
  console.log("User logged out successfully");

  const options = {
    httpOnly: true,
  };
  return res
    .status(200)
    .cookie("accessToken", null, options)
    .cookie("refreshToken", null, options)
    .json({
      message: "User logged out successfully",
    });
};

export const createAccount = async (req: any, res: any) => {
  const { userId, balance } = req.body;

  if (!userId || !balance) {
    return res.status(302).json({
      message: "All fields required",
    });
  }

  const userAccount = await client.account.findFirst({
    where: { userId: userId },
  });

  if (userAccount) {
    return res.status(302).json({
      message: "User account already exists",
      currBalance: userAccount.balance,
    });
  }

  const newAccount = await client.account.create({
    data: {
      balance: new Prisma.Decimal(balance),
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  const createdAcc = await client.account.findFirst({
    where: { id: newAccount.id },
  });
  if (!createdAcc) {
    return res.status(302).json({
      message: "Error occured in creating account",
    });
  }

  return res.status(200).json({
    message: "Account created successfully",
    createdAcc,
  });
};

export const searchUser = async (req: any, res: any) => {
  const { searchedUser } = req.body;

  if (!searchedUser) {
    return res.status(302).json({
      message: "Username required",
    });
  }

  const existingUsers = await client.user.findMany({
    where: {
      username: {
        startsWith: searchedUser,
        mode: "insensitive", // Default value: default
      },
    },
    select: {
      id: true,
      username: true,
    },
  });
  if (existingUsers.length === 0) {
    return res.status(404).json({
      message: "No users found",
    });
  }

  const mp = new Map();
  existingUsers.forEach((eachUser) => {
    if (!mp.has(searchedUser)) {
      mp.set(searchedUser, []);
    }
    mp.get(searchedUser).push(eachUser.username);
  });
  console.log(mp.get(searchedUser));

  res.status(200).json({
    message: "Send money to user",
    usersList: mp.get(searchedUser),
  });
};

export const sendMoneyTo = async (req: any, res: any) => {
  console.log("Requested");

  const { to } = req.params;
  const { from, amount, txType } = req.body;

  // const existingTx = await client.history.findFirst({
  //   where: { txId }
  // });

  // if (existingTx) {
  //   return res.status(200).json({ message: "Already processed" });
  // }

  if (to === undefined) {
    return res.status(404).json({
      message: "Receiver name is undefined",
    });
  }
  if (from === null) {
    return res.status(404).json({
      message: "Sender name is null",
    });
  }
  if (txType === "") {
    return res.status(302).json({
      message: "Payment Category Required",
    });
  }

  // check for both sender and receiver account existence
  const sender = await client.user.findFirst({
    where: { username: from },
  });
  if (!sender) {
    return res.status(302).json({
      message: `User ${from} does not exists`,
    });
  }
  const senderAccount = await client.account.findFirst({
    where: { userId: sender.id },
  });
  if (!senderAccount) {
    return res.status(302).json({
      message: `Sender ${sender.username} has no account`,
    });
  }

  const receiver = await client.user.findFirst({
    where: { username: to },
  });
  if (!receiver) {
    return res.status(302).json({
      message: `Receiver ${to} does not exists`,
    });
  }
  const receiverAccount = await client.account.findFirst({
    where: { userId: receiver.id },
  });
  if (!receiverAccount) {
    return res.status(302).json({
      message: `Receiver ${receiver.username} has no account`,
    });
  }
  // begin transaction
  try {
    await client.$transaction(async (tx) => {
      //3. check sender balance
      if (senderAccount.balance < amount) {
        throw new Error("Insufficient Balance");
      }

      //4. decrement sender account
      const senderAcc = await tx.account.update({
        data: {
          balance: {
            decrement: amount,
          },
        },
        where: {
          userId: senderAccount.userId,
        },
      });

      //5. increment receiver account
      const recepient = await tx.account.update({
        data: {
          balance: {
            increment: amount,
          },
        },
        where: {
          userId: receiverAccount.userId,
        },
      });

      //store sender history
      const senderHis = await tx.history.create({
        data :{
          accId: senderAcc.id,
          sender: from,
          receiver: to,
          amount: amount,
        }
      })
      

      //store receiver history
      const receiverHis = await tx.history.create({
        data :{
          accId: receiverAccount.id,
          sender: from,
          receiver: to,
          amount: amount,
        }
      })
    });

    return res.status(200).json({
      message: "Transfer Successful",
      to: to,
      from: from,
      flag: true,
      time: new Date(Date.now()).toLocaleString("en-US", {
        timeStyle: "short",
      }),
    });

  } catch (err: any) {
    console.log(err.message);
    return res.status(302).json({
      message: err.message || "Transaction Failed",
    });
  }
};

export const showHistory = async (req: any, res: any) => {
  const { loggedInUser} = req.body;

  if(!loggedInUser) {
    return res.status(404).json({
      message: "No logged in user found to fetch history"
    })
  }

  const user = await client.user.findUnique({
    where: {
      username: loggedInUser
    }
  })
  if(!user){
    return res.status(404).json({
      message: "user not found to fetch history"
    })
  }

  const userAcc = await client.account.findUnique({
    where: {userId: user.id}
  })
  if(!userAcc){
    return res.status(404).json({
      message: "user account not found to fetch history"
    })
  }

  const userHistory = await client.history.findMany({
    where: {accId: userAcc.id}
  })

  if(!userHistory){
    return res.status(404).json({
      message: "No Transaction history found"
    })
  }


  return res.status(200).json({
    message: "history fetched successfully",
    userHistory
  })

}