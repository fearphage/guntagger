guntagger
==========
> based and expanded upon Labelmaker by Jesse Gibson aka PsychoLama

Organize your data by tags

> guntagger is made for [gunDB](https://github.com/amark/gun/)

## What it is
If you need to organize your data with tags/labels this might be usefull. guntagger enables you to tag and untag nodes to custom tags/labels

> **Note:** you cannot tag primitives. For that, use `.key`.

## How to use it
**Node.js**

```bash
npm install guntagger
```
to install it, then you can require it from your app:
```javascript
var guntagger = require('./lib/guntagger')
```

guntagger works with gun version `0.3`, and makes use of the chaining system provided by Gun

```javascript
var Gun = require('gun')
guntagger(Gun)
// You now have tag support!
```

**Browser**

For the browser, it's much simpler, since your version of gun is exported as a global. Just include it as a script tag, and labelmaker takes care of the rest.

```html
<script src="node_modules/guntagger/guntagger.min.js"></script>
<!-- all done! -->
```
or install only the browser version with Bower
```
bower install guntagger
```
### API
Three methods are exposed for your gun instances:

 - `.tag`
 - `.untag`
 - `.tagged`

#### gun.tag(name[, name...])
You can pass `.tag` multiple names to index a node under. When called, it will try to read out your current context, index it under each tag, and then place each tag under a master list of every tag ever used.
@tag  can be a list ('one','two','three',...)  
an Array (['one','two','three']) 
or a single String ('one')

```javascript
gun.put({
  name: 'Bob',
  profession: 'developer'
}).tag(
  'members',
  'javascript developers',
  'gunDB developers',
  'examples'
)
```
#### gun.untag(name[, name...])
You can pass `.untag` multiple names to untag a node. When called, it will try to read out your current context, and untag each tag.
@untag  can be a list ('one','two','three',...)  
an Array (['one','two','three']) 
or a single String ('one')

```javascript
gun.get(<key>).untag(
  'members',
  'javascript developers')
```

#### gun.tagged()
When no arguments are provided you get the full tag list
```javascript
gun.tagged().val(cb)
```

#### gun.tagged(<tagname>,cb)
Provide a tagname and a callback to get all valid members of that tag.
The callback will also return all tags for that tagmember
```javascript
gun.tagged('gunDb').val(function(tagmember,tags){
    console.log(tagmember,tags)
})
```

#### gun.tagged(<tagname>,cb,showUntagged)
@showUntagged Boolean returns also the members who where tagged to this tag before

```javascript
gun.tagged('gunDb').val(function(tagmember,tags){
    console.log(tagmember,tags)
},true)
```

### credits
Thanks to Mark Nadal and Jesse Gibson for helping out.

 
Contributions are welcome!
