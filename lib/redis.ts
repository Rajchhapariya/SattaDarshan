import { Redis } from "@upstash/redis";
export const redis = new Redis({ url:process.env.UPSTASH_REDIS_REST_URL!, token:process.env.UPSTASH_REDIS_REST_TOKEN! });
export async function getCached<T>(key:string):Promise<T|null> { try{return await redis.get<T>(key);}catch{return null;} }
export async function setCached<T>(key:string,val:T,ex=900) { try{await redis.set(key,val,{ex});}catch{} }
