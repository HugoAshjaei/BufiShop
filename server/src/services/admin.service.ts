import { Admin } from "../models";
import localDict from "../helpers/dict";

export async function create(data: any) {
  if (await Admin.isEmailOrPhoneTaken(data.email, data.phone)) {
    throw new Error(localDict.fa.errors.emailOrPhoneExist);
  }
  const admin = await new Admin(data).save();
  // send verification or welcome email
  return admin;
}

export async function login(username: string, password: string) {
  const admin = await Admin.findOne({
    $or: [{ email: username }, { phone: username }],
  });
  if (!admin) {
    throw new Error(localDict.fa.errors.invalidCredentials);
  }
  if (await admin.isPasswordMatch(password)) {
    throw new Error(localDict.fa.errors.invalidCredentials);
  }
  const token = await admin.generateAuthToken();
  return { admin, token };
}

export async function logout(token: string) {
  // block token in redis
}

export async function block(id: string) {
  const admin = await Admin.findById(id);
  if (!admin) {
    throw new Error(localDict.fa.errors.notFound);
  }
  admin.isBlocked = true;
  await admin.save();
  // add id to redis block list
  return true;
}

export async function unblock(id: string) {
  const admin = await Admin.findById(id);
  if (!admin) {
    throw new Error(localDict.fa.errors.notFound);
  }
  admin.isBlocked = false;
  await admin.save();
  // remove id from redis block list
  return true;
}
