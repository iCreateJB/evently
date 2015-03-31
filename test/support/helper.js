process.env.NODE_ENV = 'test'

global.expect = require("chai").expect;
global.assert = require("assert");
global.should = require("should");
global.request= require('supertest');
global.sinon  = require('sinon');
global.uuid   = require('node-uuid');
global.async  = require('async');
global.redis  = require('../../lib/db.js');
