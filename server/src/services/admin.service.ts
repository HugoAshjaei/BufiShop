import { Admin } from "../models";
import localDict from "../helpers/dict";
import _ from "lodash";

export async function create(data: any) {
  if (await Admin.isEmailOrPhoneTaken(data.email, data.phone)) {
    throw new Error(localDict.fa.errors.emailOrPhoneExist);
  }
  const admin = await new Admin(data).save();

  // TODO send verification or welcome email
  return _.pick(admin, ["_id", "firstName", "lastName", "email", "phone", "emailVerified", "phoneVerified", "isBlocked", "role", "image"]);
}


export async function login(username: string, password: string) {
  const admin = await Admin.findOne({
    $or: [{ email: username }, { phone: username }],
  });
  if (!admin) {
    throw new Error(localDict.fa.errors.invalidCredentials);
  }
  if (global.CONFIG.website.isEmailVerificationRequired) {
    if (admin.email == username && admin.email && admin.emailVerified === false) {
      throw new Error(localDict.fa.errors.emailNotVerified);
    }
  }
  if (await admin.isPasswordMatch(password)) {
    throw new Error(localDict.fa.errors.invalidCredentials);
  }
  const token = await admin.generateAuthToken();
  return { admin: _.pick(admin, ["_id", "firstName", "lastName", "email", "phone", "emailVerified", "phoneVerified", "isBlocked", "role", "image"]), token };
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
  // TODO add id to redis block list
  // TODO  send email or sms

  return true;
}

export async function unblock(id: string) {
  const admin = await Admin.findById(id);
  if (!admin) {
    throw new Error(localDict.fa.errors.notFound);
  }
  admin.isBlocked = false;
  await admin.save();
  // TODO remove id from redis block list
  // TODO  send email or sms
  return true;
}

export async function list(search: string, { page, limit }: { page: number, limit: number }) {
  const admins = await Admin.find({
    $or: [{ firstName: { $regex: search, $options: "i" } }, { lastName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }, { phone: { $regex: search, $options: "i" } }],
  }).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }).select("_id firstName lastName email phone emailVerified phoneVerified isBlocked role image");
  return { admins, pagination: { page, limit, total: await Admin.countDocuments({ $or: [{ firstName: { $regex: search, $options: "i" } }, { lastName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }, { phone: { $regex: search, $options: "i" } }] }) } };
}

export async function one(id: string) {
  const admin = await Admin.findById(id).select("_id firstName lastName email phone emailVerified phoneVerified isBlocked role image");
  return {admin};
}

export async function update(id: string, data: any) {
  const admin = await Admin.findById(id);
  if (!admin) {
    throw new Error(localDict.fa.errors.notFound);
  }
  if (data.email || data.phone) {
    if (await Admin.isEmailOrPhoneTaken(data.email, data.phone, id)) {
      throw new Error(localDict.fa.errors.emailOrPhoneExist);
    }
  }
  admin.set(data);
  await admin.save();
  return _.pick(admin, ["_id", "firstName", "lastName", "email", "phone", "emailVerified", "phoneVerified", "isBlocked", "role", "image"]);
}