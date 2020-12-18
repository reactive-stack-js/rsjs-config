#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import * as path from 'path';

import * as _ from 'lodash';
import * as dotenv from 'dotenv';

let CONFIGS = {};

export type ConfigSecretOptionsType = {
	file: string;
	word: string;
};

export default class RsConfig {
	public static init(folder: string, secret?: ConfigSecretOptionsType) {
		RsConfig._instance = new RsConfig(folder, secret);
		return this._instance;
	}

	public static get config(): any {
		return RsConfig._config;
	}

	public static get(attributePath: string): any {
		return _.get(RsConfig._config, attributePath);
	}

	private static _config: any;
	private static _instance: RsConfig;

	private constructor(folder: string, secret?: ConfigSecretOptionsType) {
		CONFIGS = {};
		RsConfig._config = {};

		if (secret) dotenv.config({path: secret.file}); // .env.local
		_processSpecialSystemVariable(RsConfig._config, 'NODE_ENV', 'environment');
		_processSpecialSystemVariable(RsConfig._config, 'PORT', 'port');
		if (_.has(RsConfig._config, 'port')) _.set(RsConfig._config, 'port', parseInt(_.get(RsConfig._config, 'port'), 10));

		_processFolder(folder);
		RsConfig._config = _.merge(RsConfig._config, CONFIGS);
		CONFIGS = null;

		if (process.env.NODE_ENV) {
			const env = _getEnvContent(path.join(folder, 'env/'));
			if (!_.isEmpty(env)) {
				const keys = _.keys(env);
				_.each(keys, (key) => {
					if (_.has(RsConfig._config, key)) {
						_.set(RsConfig._config, key, _.merge(_.get(RsConfig._config, key), _.get(env, key)));
					}
				});
			}
		}

		if (secret) _overrideWithSecrets(RsConfig._config, secret.word);
	}
}

const _getEnvContent = (envFolder: string) => {
	const fileNames = fs.readdirSync(envFolder);
	const files = _.filter(fileNames, (name) => !fs.lstatSync(path.join(envFolder, name)).isDirectory());
	const envFile = _.find(files, function(file) {
		const ext = path.extname(file);
		const name = path.basename(file, ext);
		return _.toLower(name) === process.env.NODE_ENV;
	});
	if (envFile) return require(path.join(envFolder, envFile));
	return null;
};

const _processFolder = (folder: string) => {
	const fileNames = fs.readdirSync(folder);
	const files = _.filter(fileNames, (name) => !fs.lstatSync(path.join(folder, name)).isDirectory());
	_.each(files, (file) => {
		const ext = path.extname(file);
		if (ext !== '.ts' && ext !== '.js' && ext !== '.json') return;

		const filename = path.basename(file, ext);
		const absoluteFilePath = path.join(folder, file);

		const config = require(absoluteFilePath);
		_.set(CONFIGS, filename, config);
	});
};

const _processSecret = (config: any, word: string, value: string, key: string): string => {
	let trimmed = _.replace(key, word, '');
	let parts = _.words(trimmed);

	let path = _.toLower(trimmed);
	let rev = _.reverse(_.range(parts.length));
	_.each(rev, (i) => {
		let checkPath = _.toLower(_.join(_.slice(parts, 0, i + 1), '.'));
		let checkValue = _.get(config, checkPath);
		if (_.isPlainObject(checkValue)) {
			path = checkPath + '.' + _.toLower(_.join(_.slice(parts, i + 1), '_'));
			return false;
		}
	});
	return path;
};

const _overrideWithSecrets = (config: any, word: string): void => {
	let privates = _.keys(process.env);
	privates = _.filter(privates, (c) => _.startsWith(c, word));
	let privateConfigs = _.pick(process.env, privates);
	_.each(privateConfigs, (value, key) => {
		let path = _processSecret(config, word, value, key);
		_.set(config, path, value);
	});
};

const _processSpecialSystemVariable = (config: any, source: string, target: string): void => {
	if (_.has(process.env, source)) _.set(config, target, _.get(process.env, source));
};
