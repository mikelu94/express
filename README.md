# Express

Some express projects that I wrote.

## Dependencies:

- docker

## How to Set Up

For any of these projects, just run:

```bash
$ docker-compose up
```

and

```bash
$ docker-compose down
```

For `passport`, you need to add an additional `passport/config.js`:

```javascript
module.exports = {
  oauth: {
    google: {
      clientID: "GOOGLE CLIENT ID HERE",
      clientSecret: "GOOGLE CLIENT SECRET HERE",
      serviceName: "Google"
    },
    facebook: {
      clientID: "FACEBOOK CLIENT ID HERE",
      clientSecret: "FACEBOOK CLIENT SECRET HERE",
      serviceName: "Facebook"
    }
  },
  cookieSessionKeys: ['express/passport cookie session key']
}
```
