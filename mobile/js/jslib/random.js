/* 
 jsCrypto
 
 * random.js -- cryptographic random number generator
 * Mike Hamburg, 2008.  Public domain.
 *
 * This generator uses a modified version of Fortuna.  Fortuna has
 * excellent resilience to compromise, relies on a state file, and is
 * intended to run for a long time.  As such, it does not need an
 * entropy estimator.  Unfortunately, Fortuna's startup in low-entropy
 * conditions leaves much to be desired.
 *
 * This generator features the following modifications.  First, the
 * generator does not create the n-th entropy pool until it exhausts
 * the n-1-st.  This means that entropy doesn't get "stuck" in pools
 * 10-31, which will never be used on a typical webpage.  It also
 * means that the entropy will all go into a single pool until the
 * generator is seeded.
 *
 * Second, there is a very crude entropy estimator.  The primary goal
 * of this estimator is to prevent the generator from being used in
 * low-entropy situations.  Corresponding to this entropy estimator,
 * there is a "paranoia control".  This controls how many bits of
 * estimated entropy must be present before the generator is used.
 * The generator cannot have more than 256 bits of actual entropy in
 * the main pool; rather, the paranoia control is designed to deal
 * with the fact that the entropy estimator is probably horrible.
 *
 * Third, the "statefile" is optional and stored in a cookie.  As
 * such, it is not protected from multiple simultaneous usage, and so
 * is treated conservatively.
 */

random = {
	/* public */
	NOT_READY: 0,
	READY: 1,
	REQUIRES_RESEED: 2,
	

		/* generate one random word */
	randomWord : function(paranoia) {
		return this.random_words(1, paranoia)[0];
	},

	/* generate nwords random words, and return them in an array */
	randomWords : function(nwords, paranoia) {
		var out = [], i, readiness = this.isReady(paranoia);

		if (readiness & this.NOT_READY)
			throw ("random: generator isn't seeded!");
		else if (readiness & this.REQUIRES_RESEED)
			this._reseedFromPools(!(readiness & this.READY));

		for (i = 0; i < nwords; i += 4) {
			if ((i + 1) % this._max_words_per_burst == 0)
				this._gate();

			var g = this._gen_4_words();
			out.push(g[0], g[1], g[2], g[3]);
		}
		this._gate();

		return out.slice(0, nwords);
	},

	setDefaultParanoia : function(paranoia) {
		this._default_paranoia = paranoia;
	},
	
	/* Add entropy to the pools.  Pass data as an array, number or
	 * string.  Pass estimated_entropy in bits.  Pass the source as a
	 * number or string.
	 */
	addEntropy : function(data, estimated_entropy, source) {
		source = source || "user";

		var id = this._collector_ids[source]
				|| (this._collector_ids[source] = this._collector_id_next++);

		var i, ty = 0;
		var t = (new Date()).valueOf();

		var robin = this._robins[source];
		if (robin == undefined) {
			robin = this._robins[source] = 0;
		}
		this._robins[source] = (this._robins[source] + 1) % this._pools.length;

		switch (typeof (data)) {

		case "number":
			data = [ data ];
			ty = 1;
			break;

		case "object":
			if (!estimated_entropy) {
				/* horrible entropy estimator */
				estimated_entropy = 0;
				for (i = 0; i < data.length; i++) {
					var x = data[i];
					while (x > 0) {
						estimated_entropy++;
						x = x >>> 1;
					}
				}
			}
			this._pools[robin].update_words_big_endian([ id, this._event_id++,
					ty || 2, estimated_entropy, t, data.length ].concat(data));
			break;

		case "string":
			if (!estimated_entropy) {
				/*
				 * English text has just over 1 bit per character of entropy.
				 * But this might be HTML or something, and have far less
				 * entropy than English... Oh well, let's just say one bit.
				 */
				estimated_entropy = data.length;
			}
			this._pools[robin].update_words_big_endian([ id, this._event_id++,
					3, estimated_entropy, t, data.length ]);
			this._pools[robin].update_string(data);
			break;

		default:
			throw new cjct.error("invalid argument");
		}
	
		var old_ready = this.isReady();

		/* record the new strength */
		this._pool_entropy[robin] += estimated_entropy;
		this._pool_strength += estimated_entropy;

		/* fire off events */
		if (old_ready == this.NOT_READY && this.isReady() != this.NOT_READY)
			this._fireEvent("seeded", Math.max(this._strength,
					this._pool_strength));

		if (old_ready == this.NOT_READY)
			this._fireEvent("progress", this.getProgress());
	},
	
	/* is the generator ready? */
	isReady : function(paranoia) {
		var entropy_required = this._PARANOIA_LEVELS[paranoia ? paranoia : this._default_paranoia];
		var result;

		if (this._strength && this._strength >= entropy_required) {
			result = (this._pool_entropy[0] > this._BITS_PER_RESEED && (new Date())
					.valueOf() > this._next_reseed) ? this.REQUIRES_RESEED
					| this.READY : this.READY;
		} else {
			result = (this._pool_strength > entropy_required) ? this.REQUIRES_RESEED
					| this.NOT_READY
					: this.NOT_READY;
		}

		return result;
	},
	
	/* how close to ready is it? */
	getProgress : function(paranoia) {
		var entropy_required = this._PARANOIA_LEVELS[paranoia ? paranoia : this._default_paranoia];

		if (this._strength >= entropy_required) {
			return 1.0;
		} else {
			return (this._pool_strength > entropy_required) ? 1.0
					: this._pool_strength / entropy_required;
		}
	},
	
	/* start the built-in entropy collectors */
	startCollectors : function() {
		if (this._collectors_started)
			return;

		if (window.addEventListener) {
			window.addEventListener("load", this._loadTimeCollector, false);
			window.addEventListener("mousemove", this._mouseCollector, false);
		} else if (document.attachEvent) {
			document.attachEvent("onload", this._loadTimeCollector);
			document.attachEvent("onmousemove", this._mouseCollector);
		} else
			throw ("can't attach event");

		this._collectors_started = true;
	},
	
	/* stop the built-in entropy collectors */
	stopCollectors : function() {
		if (!this._collectors_started)
			return;

		if (window.removeEventListener) {
			window.removeEventListener("load", this._loadTimeCollector);
			window.removeEventListener("mousemove", this._mouseCollector);
		} else if (window.detachEvent) {
			window.detachEvent("onload", this._loadTimeCollector);
			window.detachEvent("onmousemove", this._mouseCollector);
		}
		this._collectors_started = false;
	},
	
	/* add an event listener for progress or seeded-ness */
	addEventListener : function(name, callback) {
		this._callbacks[name][this._callback_i++] = callback;
	},
	
	/* remove an event listener for progress or seeded-ness */
	removeEventListener : function(name, cb) {
		var i, j, cbs = this._callbacks[name], js_temp = [];

		/*
		 * I'm not sure if this is necessary; in C++, iterating over a
		 * collection and modifying it at the same time is a no-no.
		 */
		for (j in cbs)
			if (cbs.hasOwnProperty[j] && cbs[j] === cb)
				js_temp.push(j);

		for (i = 0; i < js_temp.length; i++) {
			j = js[i];
			delete cbs[j];
		}
	},
	
	/* private */
	_pools                   : [new sha256()],
	_pool_entropy            : [0],
	_reseed_count            : 0,
	_robins                  : {},
	_event_id                : 0,
	
	_collector_ids           : {},
	_collector_id_next       : 0,
	
	_strength                : 0,
	_pool_strength           : 0,
	_next_reseed             : 0,
	_key                     : [0,0,0,0,0,0,0,0],
	_counter                 : [0,0,0,0],
	_cipher                  : undefined,
	_default_paranoia        : 6,
	
	/* event listener stuff */
	_collectors_started      : false,
	_callbacks               : {progress: {}, seeded: {}},
	_callback_i              : 0,
	
	/* constants */
	_MAX_WORDS_PER_BURST     : 65536,
	_PARANOIA_LEVELS         : [0,48,64,96,128,192,256,384,512,768,1024],
	_MILLISECONDS_PER_RESEED : 100,
	_BITS_PER_RESEED         : 80,
	
	/* generate 4 random words, no reseed, no gate */
	_gen_4_words : function() {
		var words = [];
		for ( var i = 0; i < 3; i++)
			if (++this._counter[i])
				break;
		this._cipher.encrypt(this._counter, words);
		return words;
	},
	
	/* rekey the AES instance with itself after a request, or every _MAX_WORDS_PER_BURST words */
	_gate : function() {
		this._key = this._gen_4_words().concat(this._gen_4_words());
		this._cipher = new aes(this._key);
	},

	/* reseed the generator with the given words */
	_reseed : function(seedWords) {
		this._key = sha256.hash_words_big_endian(this._key.concat(seedWords));
		this._cipher = new aes(this._key);
		for ( var i = 0; i < 3; i++)
			if (++this._counter[i])
				break;
	},
	
	/* reseed the data from the entropy pools */
	_reseedFromPools : function(full) {
		var reseed_data = [], strength = 0;

		this._next_reseed = (new Date()).valueOf()
				+ this._MILLISECONDS_PER_RESEED;

		for (var i = 0; i < this._pools.length; i++) {
			reseed_data = reseed_data.concat(this._pools[i].finalize());
			strength += this._pool_entropy[i];
			this._pool_entropy[i] = 0;

			if (!full && (this._reseed_count & (1 << i)))
				break;
		}

		/* if we used the last pool, push a new one onto the stack */
		if (this._reseed_count >= 1 << this._pools.length) {
			this._pools.push(new sha256());
			this._pool_entropy.push(0);
		}

		/* how strong was this reseed? */
		this._pool_strength -= strength;
		if (strength > this._strength)
			this._strength = strength;

		this._reseed_count++;
		this._reseed(reseed_data);
	},

	_mouseCollector : function(ev) {
		var x = ev.x || ev.clientX || ev.offsetX;
		var y = ev.y || ev.clientY || ev.offsetY;
		random.addEntropy([ x, y ], 2, "mouse");
	},

	_loadTimeCollector : function(ev) {
		var d = new Date();
		random.addEntropy(d, 2, "loadtime");
	},

	_fireEvent : function(name, arg) {
		var j, cbs = random._callbacks[name], cbs_temp = [];

		/* I'm not sure if this is necessary; in C++, iterating over a
		 * collection and modifying it at the same time is a no-no.
		 */
		for (j in cbs) {
			if (cbs.hasOwnProperty(j)) {
				cbs_temp.push(cbs[j]);
			}
		}

		for (j = 0; j < cbs_temp.length; j++) {
			cbs_temp[j](arg);
		}
	}
};
