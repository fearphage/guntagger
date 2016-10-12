/**
 * based on 'labelmaker' by Jesse Gibson aka PsychoLama 
 * (https://github.com/PsychoLlama/labelmaker)
 *
 * With guntagger you can;
 * - tag and untag nodes
 * - get only tagged members from a tag
 * - get tagged and untagged members from a tag
 *
 * gun.tagged()  							   // returns all tags
 * gun.tagged('members',cb) 	   // returns all 'members' if there own tag 'member==1'
 * gun.tagged('members',cb,true) // returns all 'members' including the untagged members
 */

var scope = 'guntagger/';

/** check compatibility */
function invalid(value) {
  if (typeof value !== 'object') {
    console.warn('Only objects can be tagged');
    return true;
  }
};

/**
  Keep a master collection
  of every tag used.
*/
function pushTag(gun, tag) {
   // the tag(eg:'members') is updated with a new member
   // so we have to get them all...
  gun.get(scope  + tag).val(function (group) {
  	// ...and register that updated group under the master list again
    gun.get(scope +  'TAGS').init().path(tag).put(group);
  });
};

/**
  Take a list of tags and send
  them through tag() or untag(), one at a time.
  @method String 'tag' or 'untag'
*/
function serialize(gun, args,method) {
  // turn them into an array
  args = Array.prototype.slice.call(args);
  args.forEach(function (tag) {
    gun[method](tag);
  });

  return gun;
};
/* i want to return just an array of valid tags */
function tagsToArray(tags) {
	var a_tags = []
  Object.keys(tags).forEach(function(tag){
    if(tags[tag] ==1) {a_tags.push(tag)}
  })
  return a_tags;
}
module.exports = function guntagger(Gun) {
Gun.chain.tag = function (tag) {
    // if the arguments is a list we 
    // serialize them and send them 
    // through this function one by one
    if (arguments.length !== 1) {
      return serialize(this, arguments,'tag');
    }
		// if we got here we have a single tag
    return this.val(function (obj) {
      // filter non-objects
      if (invalid(obj)) {
      	console.log('%s is not an object',obj)
        return this;
      }
      this.get(scope +  tag).init()
				  	.path(obj._['#']).put(obj);
				     // place that tag under a master list of tags
	     pushTag(this, tag);
     
        var t ={}
        t[tag] = 1
	      //update the tag under 'tags' in 'Bob'
	      this.path('tags').put(t)
    });
  };

  	Gun.chain.untag = function (tag) {
	    if (arguments.length !== 1) {
	      return serialize(this, arguments,'untag');
	    } 
	    return this.val(function (obj) {
	      if (invalid(obj)) { 
	      	return this; 
	      }
	      this.path('tags').path(tag).put(0);
    	});
  	};

    Gun.chain.tagged = function (name, cb,showUntagged) {
    	// no arguments returns all tags
	    if (arguments.length === 0) {
	      return this.get(scope + 'TAGS');
	    }
	    // invalid! no tag provided
	    if (!name && typeof name !== 'string') {
	      return this;
	    }
   
	     // have to filter out items where tag=0
	     gun.get(scope+name).map().val(function(tagmember,key) {
	    	// i'm in the tagmember so v.tags is the soul of my tags
	    	 gun.get(tagmember.tags).val(function(tags) {
	    	 	delete tags._
	    	 	// remove tags before returning
		    	delete tagmember.tags

	    	 	if(!showUntagged) {
		    		if (tags[name] == 1) {
		    			// call the callback
		    			cb(tagmember,tagsToArray(tags))
		    		}
		    	} else {
		    		// user wants untagged included
		    		cb(tagmember,tagsToArray(tags))
		    	}
	    	 })
			  });
 		};
  }
