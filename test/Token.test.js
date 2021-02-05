// test/Box.test.js
// Load dependencies
const { expect } = require('chai');

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

// Load compiled artifacts
const token = artifacts.require('GLDToken');

// Start test block
contract('Box', function ([ owner, other ]) {

    // Use large integers ('big numbers')
    const value = new BN('42');
})