type SuccessCb<ResultType> = (result: ResultType) => void;

type ErrCb<ErrorType> = (err: ErrorType) => void;

class PromisePolyFill<ResultType = any, ErrorType = any> {
    private _res?: ResultType;
    private _err?: ErrorType;
    private _isFulfilled = false;
    private _isRejected = false;
    private _isResolved = false;
    private _successCb: null | SuccessCb<ResultType> = null;
    private _errCb: null | ErrCb<ErrorType> = null;
    constructor(func?: Function) {
        if (!func) {
            return;
        }
        try {
            func(this._resolve.bind(this), this._reject.bind(this));
        } catch (error: unknown) {
            PromisePolyFill.reject(error as ErrorType);
        }
    }

    public static resolve<ResultType = any>(result?: ResultType): PromisePolyFill {
        let instance = new PromisePolyFill();
        instance._resolve(result as ResultType);
        return instance;
    }

    private _resolve(result?: ResultType): void {
        this._res = result;
        this._isFulfilled = true;
        this._isResolved = true;
        this._safeFnCall(this._successCb, result);
    }

    public static reject<ErrorType = any>(error?: ErrorType): PromisePolyFill {
        let instance = new PromisePolyFill();
        instance._reject(error as ErrorType);
        return instance;
    }

    private _reject(error: ErrorType): void {
        this._err = error;
        this._isFulfilled = true;
        this._isRejected = true;
        this._safeCbFnCall(this._errCb, error);
    }

    private _safeCbFnCall(cbFunc: null | SuccessCb<ResultType> | ErrCb<ErrorType>, output?: ResultType | ErrorType): void {
        if (!cbFunc || !this._isFulfilled ) {
            return;
        }

        this._safeFnCall(cbFunc, output);
    }

    private _safeFnCall(cbFunc: null | SuccessCb<ResultType> | ErrCb<ErrorType>, output?: ResultType | ErrorType): void {
        if (!cbFunc) {
            return;
        }

        try {
            cbFunc(output as ResultType & ErrorType);
        } catch (error: unknown) {
            this._errCb?.(error as ErrorType);
        }
    }

    public then(successCb: SuccessCb<ResultType>): PromisePolyFill {
        this._successCb = successCb;
        if (this._isRejected) {
            return this;
        }
        this._safeCbFnCall((result?: ResultType) => {
            const revisedResult = successCb(result as ResultType);
            console.log('revisedResult', typeof revisedResult);
            if (typeof revisedResult !== undefined) {
                this._res = revisedResult as ResultType;
            }
        }, this._res);
        return this;
    }

    public catch(errCb: ErrCb<ErrorType>): PromisePolyFill {
        this._errCb = errCb;
        if (this._isResolved) {
            return this;
        }
        this._safeCbFnCall(errCb, this._err);
        return this;
    }
}

async function main() {
    new PromisePolyFill((resolve: SuccessCb<string>) => {
        setTimeout(() => resolve('resolvedPromiseDelayed'), 1000)
    }).catch(err => {
        console.log('resolvedPromiseDelayed catch', err);
    }).then(res => {
        console.log('resolvedPromiseDelayed then', res);
    });
    new PromisePolyFill((_resolve: SuccessCb<string>, reject: ErrCb<string>) => {
        setTimeout(() => reject('rejectedPromiseDelayed'), 1000)
    }).then(res => {
        console.log('rejectedPromiseDelayed then', res);
    }).catch(err => {
        console.log('rejectedPromiseDelayed catch', err);
    });
    const resolvedPromise = PromisePolyFill.resolve('resolvedPromise');
    console.log('inlineResolvedPromise',  await resolvedPromise);
    resolvedPromise.then(res => {
        console.log('resolvedPromise then', res);
    });
    // const rejectedPromise = PromisePolyFill.reject('rejectedPromise');
    // const inlineRejectedPromise = await rejectedPromise;
    // console.log({ resolvedPromise, rejectedPromise, inlineResolvedPromise, inlineRejectedPromise });
    // rejectedPromise.catch(err => {
    //     console.log('rejectedPromise catch', err);
    // });
}

main();
