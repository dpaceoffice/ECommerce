import { Strategy } from "passport-local";
import passport from "passport";
import Customer from "../models/Customer.js";
import bcrypt from "bcrypt";

async function authenticateUser(email, password, done) {
  const user = await Customer.findOne({ email: email });
  if (user == undefined) {
    return done(null, false, { message: "Are you tring to register? Try and register below." });
  }
  if (await bcrypt.compare(password, user.password)) {
    return done(null, user, { message: "user authenticated" });
  } else {
    return done(null, false, { message: "The password entered was incorrect. If you forgot your passord. You are unfortunately doomed." });
  }
}

async function setupPassport() {
  const formNames = { usernameField: 'email', passwordField: 'password' };
  const localStrategy = new Strategy(formNames, authenticateUser);
  passport.use(localStrategy);
  passport.serializeUser((user, done) => done(null, user['_id']));
  passport.deserializeUser(async (id, done) => done(null, await Customer.findOne({ _id: id })));
}
await setupPassport();
export default passport;
