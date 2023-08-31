# ePhone - iframe a site onto a phone model

Built with `@react-three/fiber`.

`url` query parameter can be used to specify the site to iframe. Drag to rotate the phone model.

![Wikipedia iframed onto a phone model](example.png)

In the future, I want to make this a more involved 3D environment built around an iframe, but satisfied for a very quick hack and my first dabble with Three.js.

Shout out Sam Osborne for the [tutorial](https://www.youtube.com/watch?v=SQRqU3N3ehs). As of initial spike, the only additive things I had to do were figure out the positioning values for the model I wanted to use and add occlusion.

**TODO**
- [ ] Add some info/help context
- [ ] Add more of an environment. interactive?
- [ ] Support landscape mode
- [ ] Manage link clicks inside iframe. Many sites will be blocked
