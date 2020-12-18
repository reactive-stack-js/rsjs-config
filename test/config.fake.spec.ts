#!/usr/bin/env node
'use strict';

import * as path from 'path';
import {expect} from 'chai';
import RsConfig from '../src/config';

const fakeNoSecret = {
	environment: 'fake',
	bla: {boo: 'boo', banana: {fruit: true}},
	blah: {booh: 'booh', melon: {fruit: true}},
	connections: {jwt: {something: 'yes'}, ldap: {user: 'ldap_user'}}
};

describe("RsConfig tests - fake", () => {
	describe("fake / no secret", () => {
		it("config should deep equal to 'fakeNoSecret'", () => {
			delete process.env.PORT;
			process.env.NODE_ENV = 'fake';
			RsConfig.init(path.join(__dirname, 'config'));
			expect(RsConfig.get('port')).to.not.exist;
			expect(RsConfig.get('environment')).to.equal('fake');
			expect(RsConfig.config).to.deep.equal(fakeNoSecret);
		});
	});
});