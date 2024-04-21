import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOption {
  expiresIn: string | number;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: "1d",
};

// function for signing jwt token or encrypting payload
export function signJwt(
  payload: JwtPayload,
  option: SignOption = DEFAULT_SIGN_OPTION
) {
  const secretKey = process.env.JWT_USER_ID_SECRET_KEY!;
  const token = jwt.sign(payload, secretKey, option);
  return token;
}

// function for verifying and decoding jwt token
export function verifyJwt(token: string) {
  try {
    const secretKey = process.env.JWT_USER_ID_SECRET_KEY!;
    const decoded = jwt.verify(token, secretKey);
    return decoded as JwtPayload;
  } catch (error) {
    console.log(error);
    // return new Error("Invalid or expired jwt token");
    return null;
  }
}
