import { Config } from "../models";


export async function create(data: any) {
  const config = await Config.create(data);
  return config;
}