import { Strategy } from "passport-local";
import passport from "passport";
import Customer from "../models/Customer.js";

async function authenticateUser(email, password, done) {
  const user = await Customer.findOne({ email: email });
  if (user === undefined) {
    console.log("No user with that email");
    return done(null, false);
  }
  if (password === user.password) {
    console.log("User Authenticated");
    return done(null, user);
  } else {
    console.log("Password incorrect");
    return done(null, false);
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
