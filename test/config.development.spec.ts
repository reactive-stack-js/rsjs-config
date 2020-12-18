#!/usr/bin/env node
'use strict';

import * as path from 'path';
import {expect} from 'chai';
import RsConfig from '../src/config';

const secret = {
	file: path.join(__dirname, '.env.local'),
	word: 'test'
};

const developmentNoSecret = {
	environment: 'development',
	bla: {boo: 'development_boo', banana: {fruit: 'development_yes'}},
	blah: {booh: 'booh', melon: {fruit: true}},
	connections: {jwt: {something: 'development_yes'}, ldap: {user: 'development_ldap_user'}}
};

const developmentSecret = {
	environment: 'development',
	port: 3000,
	bla: {
		boo: 'secret_bla_boo',
		banana: {fruit: 'development_yes', weight: 'secret_bla_banana_weight'}
	},
	blah: {
		booh: 'booh',
		melon: {fruit: true}
	},
	connections: {
		jwt: {something: 'development_yes', secret: 'secret_connections_jwt_secret'},
		ldap: {
			user: 'development_ldap_user',
			password: 'secret_connections_ldap_password'
		}
	}
};

describe("RsConfig tests - development", () => {
	describe("development / no secret", () => {
		it("config should deep equal to 'developmentNoSecret'", () => {
			delete process.env.PORT;
			process.env.NODE_ENV = 'development';
			RsConfig.init(path.join(__dirname, 'config'));
			expect(RsConfig.get('port')).to.not.exist;
			expect(RsConfig.get('environment')).to.equal('development');
			expect(RsConfig.config).to.deep.equal(developmentNoSecret);
		});
	});

	describe("development / with secret", () => {
		it("config should deep equal to 'developmentSecret'", () => {
			delete process.env.PORT;
			process.env.NODE_ENV = 'development';
			RsConfig.init(path.join(__dirname, 'config'), secret);
			expect(RsConfig.get('port')).to.equal(3000);
			expect(RsConfig.get('environment')).to.equal('development');
			expect(RsConfig.config).to.deep.equal(developmentSecret);
		});
	});
});