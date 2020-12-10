const {Writable, Readable} = require("stream");
/**
 * Turns a stream into a buffer
 * @emits StreamToBuffer#result
 */
class StreamToBuffer extends Writable {
	constructor(){
		super();
		this._buffer = Buffer.alloc(0);
	}
	_write(chunk, encoding, callback){
		this._buffer = Buffer.concat([this._buffer, chunk], this._buffer.length + chunk.length);
		callback();
	}
	_final(callback){
		this.finished = true;
		/**
		 * Emits when the stream is finished
		 *
		 * @event StreamToBuffer#result
		 * @param {Buffer}
		 */
		this.emit("result", this._buffer);
		callback();
	}
	/**
	 * @async
	 * returns the result when the stream is fully consumed
	 * @returns {Promise<Buffer>}
	 */
	result(){
		if(this.finished){
			return Promise.resolve(this._buffer);
		}
		return new Promise((resolve, reject) => {
			this.once("result", resolve);
			this.once("error", reject);
		});
	}
}

/**
 * Turns a buffer into a stream
 */
class BufferToStream extends Readable {
	/**
	 * @param {Buffer} buffer buffer to feed the stream from
	 */
	constructor(buffer){
		super();
		/* istanbul ignore else */
		if(Buffer.isBuffer(buffer)){
			this._buffer = buffer;
		}else{
			throw new TypeError("buffer must be a Buffer or Uint8Array");
		}
	}
	_read(size){
		if(size >= this._buffer.length){
			this.push(this._buffer);
			this.push(null);
		}else{
			this.push(this._buffer.slice(0, size));
			this._buffer = this._buffer.slice(size);
		}
	}
}
module.exports = {BufferToStream, StreamToBuffer};
