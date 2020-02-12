import 'reflect-metadata';
import { AppRouter } from '../../AppRouter';
import { Methods } from '../decorators/Methods';
import { MetadataKeys } from '../decorators/MetadataKeys';
import { Request, Response, RequestHandler, NextFunction } from 'express';

function bodyValidators(keys: string): RequestHandler {
	return function(req: Request, res: Response, next: NextFunction) {
		if(!req.body) {
			res.status(422).send('Invalid request');
			return;
		}
		for (let key of keys) {
			if (!req.body[key]) {
				res.status(422).send(`Missing property: ${key}`);
				return;
			}
		}
		next();
	}
}

export function controller(routePrefix: string) {
	return function(target: Function) {
		const router = AppRouter.getInstance();
		for (let key in target.prototype) {
			const routeHandler = target.prototype[key];
			const path = Reflect.getMetadata(MetadataKeys.path, target.prototype, key);
			const method: Methods = Reflect.getMetadata(MetadataKeys.method, target.prototype, key);
			const middlwares = Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) || [];
			const requiredBodyProps = Reflect.getMetadata(MetadataKeys.validator, target.prototype, key) || [];
			const validator = bodyValidators(requiredBodyProps)
			if (path) {
				router[method](`${routePrefix}${path}`, ...middlwares, validator, routeHandler);
			}
		}
	}
}