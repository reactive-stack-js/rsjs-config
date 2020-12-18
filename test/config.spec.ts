import {expect} from 'chai';
import Config from '../src/config';

describe("Config tests", () => {
	it("Config should exist", () => {
		expect(Config).to.exist;
	});

	// describe("Config constructor tests", () => {
	// 	const p1 = {username: "p1", rating: 1152, score: -238};
	// 	const p2 = {username: "p2", rating: 1074, score: 112};
	// 	const p3 = {username: "p3", rating: 986, score: 126};
	// 	it("contructor should create object", () => {
	// 		expect(() => new PrefRating(p1, p2, p3, 60)).to.not.throw();
	// 		expect(new PrefRating(p1, p2, p3, 60)).to.be.a("object");
	// 	});
	// });

});