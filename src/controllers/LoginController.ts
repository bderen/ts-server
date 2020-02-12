import { Request, Response, RequestHandler, NextFunction } from 'express';
import { use, get, post, controller, bodyValidator } from './decorators';

function logger(req: Request, res: Response, next: NextFunction) {
	console.log('request')
	next();
}

@controller('')
class LoginController {
	@get('/login')
	@use(logger)
	getLogin(req: Request, res: Response) {
		res.send(`
			<form method="post">
				<div>
					<label>Email</label>
					<input name="email" />
				</div>
				<div>
					<label>Password</label>
					<input name="password" type="password" />
				</div>
				<button>Submit</button>
			</form>
		`);
	};

	@post('/login')
	@bodyValidator('email', 'password')
	postLogin(req: Request, res: Response) {
		const { email, password } = req.body;
	
		if (email === 'hi@hi.com' && password === 'password') {
			req.session = { loggedIn: true }
			res.redirect('/')
		} else {
			res.send('invalid email or password')
		}
	};

	@get('/logout')
	getLogout(req: Request, res: Response) {
		req.session = undefined;
		res.redirect('/')
	};
}
