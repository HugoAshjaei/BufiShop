import { Config } from "../models";
import _ from "lodash";
import { loadConfig } from "../loaders/config.loader";
import localDict from "../helpers/dict";


export async function create(data: any) {
  data = _.pick(data, ["name" ,"description" ,"email" ,"phone" ,"address" ,"terms" ,"isEmailVerificationRequired" ,"smtp", "currencyCode", "type"]);
  const config = await new Config(data);
  // TODO if email exists, send welcome email
  return config;
}

export async function update(data: any) {
  data = _.pick(data, ["name" ,"description" ,"email" ,"phone" ,"address" ,"terms" ,"isEmailVerificationRequired" ,"smtp"]);
  data.updatedAt = new Date();
  const config = await Config.findOneAndUpdate({}, data, { new: true }).sort({updatedAt: -1});
  if (!config) {
    await loadConfig();
    throw new Error(localDict.fa.errors.configNotFound);
  }
  await loadConfig();
  return config;
}

export async function get() {
  const config = global.CONFIG.website;
  return config;
}