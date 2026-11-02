import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { UnauthorizedError } from "../exceptions/AppError.js";

const TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || randomBytes(32).toString("hex");
const TOKEN_DURATION_SECONDS = 60 * 60 * 8;
const TOKEN_HEADER = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");

function sign(content){
    return createHmac("sha256", TOKEN_SECRET).update(content).digest("base64url");
}

export function createAuthToken(userId){
    const payload = Buffer.from(JSON.stringify({
        sub: userId,
        exp: Math.floor(Date.now() / 1000) + TOKEN_DURATION_SECONDS
    })).toString("base64url");
    const content = `${TOKEN_HEADER}.${payload}`;

    return `${content}.${sign(content)}`;
}

export function verifyAuthToken(token){
    try{
        const [header, payload, signature, extra] = token.split(".");
        if(!header || !payload || !signature || extra !== undefined) throw new Error();

        const parsedHeader = JSON.parse(Buffer.from(header, "base64url").toString("utf8"));
        if(parsedHeader.alg !== "HS256" || parsedHeader.typ !== "JWT") throw new Error();

        const content = `${header}.${payload}`;
        const expected = Buffer.from(sign(content));
        const received = Buffer.from(signature);
        if(expected.length !== received.length || !timingSafeEqual(expected, received)) throw new Error();

        const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        if(!Number.isInteger(claims.sub) || !Number.isInteger(claims.exp) || claims.exp <= Date.now() / 1000){
            throw new Error();
        }

        return claims;
    }catch{
        throw new UnauthorizedError("La sesión no es válida o expiró.");
    }
}