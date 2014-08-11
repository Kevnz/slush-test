var chai = require("chai");
var should = require('chai').should();
var assert = require('power-assert');

chai.should();

describe('Module test', function () {
	beforeEach(function (done) {
		//setup

		done();
	});
	afterEach(function (done) {
		//teardown

		done();
	});
	describe('#function to test', function() {
		it('should fail', function(done) {
			assert(true === false, "The things should equal");
			done();
		});
	});
});

module.exports = this;