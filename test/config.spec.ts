#!/usr/bin/env node
'use strict';

import * as path from 'path';
import {expect} from 'chai';
import RsConfig from '../src/config';

const secret = {
	file: path.join(__dirname, '.env.local'),
	word: 'test'
};

const noSecret = {
	bla: {boo: 'boo', banana: {fruit: true}},
	blah: {booh: 'booh', melon: {fruit: true}},
	connections: {jwt: {something: 'yes'}, ldap: {user: 'ldap_user'}}
};

const withSecret = {
	port: 3000,
	bla: {
		boo: 'secret_bla_boo',
		banana: {fruit: true, weight: 'secret_bla_banana_weight'}
	},
	blah: {
		booh: 'booh',
		melon: {fruit: true}
	},
	connections: {
		jwt: {something: 'yes', secret: 'secret_connections_jwt_secret'},
		ldap: {user: 'ldap_user', password: 'secret_connections_ldap_password'}
	}
};

describe("RsConfig tests - no environment", () => {
	it("RsConfig should exist", () => {
		expect(RsConfig).to.exist;
	});

	describe("no environment / no secret", () => {
		it("config should deep equal to 'noSecret'", () => {
			delete process.env.PORT;
			delete process.env.NODE_ENV;
			RsConfig.init(path.join(__dirname, 'config'));
			expect(RsConfig.get('port')).to.not.exist;
			expect(RsConfig.get('environment')).to.not.exist;
			expect(RsConfig.config).to.deep.equal(noSecret);
		});
	});

	describe("no environment / with secret", () => {
		it("config should deep equal to 'withSecret'", () => {
			delete process.env.PORT;
			delete process.env.NODE_ENV;
			RsConfig.init(path.join(__dirname, 'config'), secret);
			expect(RsConfig.get('port')).to.equal(3000);
			expect(RsConfig.get('environment')).to.not.exist;
			expect(RsConfig.config).to.deep.equal(withSecret);
		});
	});

});