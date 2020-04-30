const cryptoHash = require('./crypto-hash');
describe('cryptoHash()',()=>{

	it('generates a SHA-256 output',()=>{
		expect(cryptoHash('skr')).toEqual('cc109fc229d29f0df48923e30d66481983edde9f3c34f86de6f4cab7134bc2df');
	});

	it('produces same hash with same argument',()=>{
		expect(cryptoHash('one','two','three')).toEqual(cryptoHash('two','three','one'));
	});

	it('produces different hash as the property of object changes',()=>{
		const foo={};
		const originalHash=cryptoHash(foo);
		foo['a']='a';
		expect(cryptoHash(foo)).not.toEqual(originalHash);
	});
});