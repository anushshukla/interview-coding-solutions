import express from 'express';
import RedisClient from 'ioredis';

export class CachedOrderedSet {
    private _client: RedisClient;
    private _setName: string;
    constructor(client: RedisClient, setName: string) {
        this._client = client;
        this._setName = setName;
    }

    public add(score: number, memberName: string): Promise<number> {
        return this._client.zadd(this._setName, score, memberName);
    }

    public removeByScore(min: number, max: number): Promise<number> {
        return this._client.zremrangebyscore(this._setName, min + 1, max + 1);
    }

    public removeScoresLt(score: number): Promise<number> {
        return this.removeByScore(-Infinity, score + 1);
    }

    public removeScoresLtEq(score: number): Promise<number> {
        return this.removeByScore(-Infinity, score);
    }

    public removeScoresGt(score: number): Promise<number> {
        return this.removeByScore(score + 1, Infinity);
    }

    public removeScoresGtEq(score: number): Promise<number> {
        return this.removeByScore(score, Infinity);
    }

    public getSize(): Promise<number> {
        return this._client.zcard(this._setName);
    }
}

export class RateLimiting {
    private _cachedOrderedSet: CachedOrderedSet;
    private _limit: number;
    private _windowMs: number;
    constructor(keyName: string, limit: number, windowMs: number) {
        this._cachedOrderedSet = new CachedOrderedSet(new ioredis(), keyName);
        this._limit = limit;
        this._windowMs = windowMs;
    }

    public async isViolated(): Promise<boolean> {
        const currentTs = Date.now();
        await this._cachedOrderedSet.removeScoresLt(currentTs - this._windowMs);
        const hits = await this._cachedOrderedSet.getSize();
        if (hits === this._limit) {
            return true;
        }
        this._cachedOrderedSet.add(currentTs, currentTs.toString());
        return false;
    }
    
}

export default async function middlewareRateLimiter(request: express.Request, response: express.Response, next: express.Next): Promise<number> {
    const rateLimit = new RateLimiting(`rate-limit:${request.session.userId}`, request.config.rateLimitCount, request.config.rateLimitWindowMs);
    if (await rateLimit.isViolated()) {
        return response.status(429);
    }

    return next();
}
