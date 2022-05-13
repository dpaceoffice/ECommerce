import { Strategy } from "passport-local";
import passport from "passport";
import Store from "../models/Store.js";

async function authenticateUser(email, password, done) {
  const user = await Store.findUser("email", email);
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
  passport.deserializeUser((id, done) => done(null, Store.serializeCustomer(id)));
}
setupPassport();
export default passport;
