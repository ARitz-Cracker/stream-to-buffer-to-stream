/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-magic-numbers */
const chai = require("chai");
chai.use(require("chai-as-promised"));
const expect = chai.expect;

const {BufferToStream, StreamToBuffer} = require("../index");
const {PassThrough} = require("stream");
describe("Stream-Buffer transverter", function(){
	it("turns a buffer into a stream and back into a buffer", async function(){
		const testBuffer = Buffer.from("Hello, world! ".repeat(1337));
		const b2s = new BufferToStream(testBuffer);
		const ps = new PassThrough();
		const s2b = new StreamToBuffer();
		b2s.pipe(ps);
		ps.pipe(s2b);
		const resultBuffer = await s2b.result();
		expect(resultBuffer).to.deep.equal(testBuffer);
		const resultBufferAgain = await s2b.result();
		expect(resultBufferAgain).to.deep.equal(testBuffer);
	});
});
