#!/usr/bin/env node
'use strict';

import * as path from 'path';
import {expect} from 'chai';
import RsConfig from '../src/config';

const secret = {
	file: path.join(__dirname, '.env.local'),
	word: 'test'
};

const productionNoSecret = {
	environment: 'production',
	bla: {boo: 'production_boo', banana: {fruit: 'production_yes'}},
	connections: {jwt: {something: 'production_yes'}, ldap: {user: 'production_ldap_user'}}
};

const productionSecret = {
	environment: 'production',
	port: 3000,
	bla: {
		boo: 'secret_bla_boo',
		banana: {fruit: 'production_yes', weight: 'secret_bla_banana_weight'}
	},
	connections: {
		jwt: {something: 'production_yes', secret: 'secret_connections_jwt_secret'},
		ldap: {
			user: 'production_ldap_user',
			password: 'secret_connections_ldap_password'
		}
	}
};

describe("RsConfig tests - production", () => {
	describe("production / no secret", () => {
		it("config should deep equal to 'productionNoSecret'", () => {
			delete process.env.PORT;
			process.env.NODE_ENV = 'production';
			RsConfig.init(path.join(__dirname, 'config'));
			expect(RsConfig.get('port')).to.not.exist;
			expect(RsConfig.get('environment')).to.equal('production');
			expect(RsConfig.config).to.deep.equal(productionNoSecret);
		});
	});

	describe("production / with secret", () => {
		it("config should deep equal to 'productionSecret'", () => {
			delete process.env.PORT;
			process.env.NODE_ENV = 'production';
			RsConfig.init(path.join(__dirname, 'config'), secret);
			expect(RsConfig.get('port')).to.equal(3000);
			expect(RsConfig.get('environment')).to.equal('production');
			expect(RsConfig.config).to.deep.equal(productionSecret);
		});
	});
});