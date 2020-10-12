var http = require('http');

http.createServer(function(req, res){
	var cookie = parseCookie(req.headers.cookie);
	if(!cookie.isVisit){
		res.setHeader('Set-Cookie', serializeCookie('isVisit', 1));
		res.writeHead(200);
		res.end('Welcome your first visit.\n');
	}else{
		res.writeHead(200);
		res.end('Welcome back.\n');
	}
}).listen(3080, '127.0.0.1');

console.log('create server on port: 3080');

function parseCookie(cookie){
	var cookies = {};
	if(!cookie){
		return cookies
	}

	var list = cookie.split(';');

	for(var i =0, len = list.length; i<len;i++){
		var pair = list[i].split('=');
		cookies[pair[0].trim()] = pair[1];
	}

	return cookies;
}

function serializeCookie(name, value, option){
	var pair = [name+'='+encodeURI(value)];
	option = option || {};

	if(option.maxAge) pair.push('Max-Age='+option.maxAge);
	if(option.domain) pair.push('Domain='+option.domain);
	if(option.path) pair.push('Path='+option.path);
	if(option.expires) pair.push('Expires='+option.expires.toUTCString());
	if(option.httpOnly) pair.push('HttpOnly');
	if(option.secure) pair.push('Secure');

	return pair.join('; ');
}