#!/usr/bin/env node
'use strict';

import * as path from 'path';
import {expect} from 'chai';
import RsConfig from '../src/config';

const secret = {
	file: path.join(__dirname, '.env.local'),
	word: 'test'
};

const stageNoSecret = {
	environment: 'stage',
	bla: {boo: 'stage_boo', banana: {fruit: 'stage_yes'}},
	connections: {jwt: {something: 'stage_yes'}, ldap: {user: 'stage_ldap_user'}}
};

const stageSecret = {
	environment: 'stage',
	port: 3000,
	bla: {
		boo: 'secret_bla_boo',
		banana: {fruit: 'stage_yes', weight: 'secret_bla_banana_weight'}
	},
	connections: {
		jwt: {something: 'stage_yes', secret: 'secret_connections_jwt_secret'},
		ldap: {
			user: 'stage_ldap_user',
			password: 'secret_connections_ldap_password'
		}
	}
};

describe("RsConfig tests - stage", () => {
	describe("stage / no secret", () => {
		it("config should deep equal to 'stageNoSecret'", () => {
			delete process.env.PORT;
			process.env.NODE_ENV = 'stage';
			RsConfig.init(path.join(__dirname, 'config'));
			expect(RsConfig.get('port')).to.not.exist;
			expect(RsConfig.get('environment')).to.equal('stage');
			expect(RsConfig.config).to.deep.equal(stageNoSecret);
		});
	});

	describe("stage / with secret", () => {
		it("config should deep equal to 'stageSecret'", () => {
			delete process.env.PORT;
			process.env.NODE_ENV = 'stage';
			RsConfig.init(path.join(__dirname, 'config'), secret);
			expect(RsConfig.get('port')).to.equal(3000);
			expect(RsConfig.get('environment')).to.equal('stage');
			expect(RsConfig.config).to.deep.equal(stageSecret);
		});
	});
});