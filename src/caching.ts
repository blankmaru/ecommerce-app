import { NextFunction, Request } from 'express';
import cache from 'memory-cache';

let memCache = new cache.Cache();
export let cacheMiddleware = (duration: number) => {
        return (req: Request, res: any, next: NextFunction) => {
            let key =  '__express__' + req.originalUrl || req.url
            let cacheContent = memCache.get(key);
            if(cacheContent){
                res.send( cacheContent );
                return
            }else{
                res.sendResponse = res.send
                res.send = (body: any) => {
                    memCache.put(key,body,duration*1000);
                    res.sendResponse(body)
                }
                next()
            }
        }
}