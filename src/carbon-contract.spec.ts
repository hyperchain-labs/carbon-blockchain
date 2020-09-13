/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { CarbonContract } from '.';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('CarbonContract', () => {

    let contract: CarbonContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new CarbonContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"carbon 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"carbon 1002 value"}'));
    });

    describe('#carbonExists', () => {

        it('should return true for a carbon', async () => {
            await contract.carbonExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a carbon that does not exist', async () => {
            await contract.carbonExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createCarbon', () => {

        it('should create a carbon', async () => {
            await contract.createCarbon(ctx, '1003', 'carbon 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"carbon 1003 value"}'));
        });

        it('should throw an error for a carbon that already exists', async () => {
            await contract.createCarbon(ctx, '1001', 'myvalue').should.be.rejectedWith(/The carbon 1001 already exists/);
        });

    });

    describe('#readCarbon', () => {

        it('should return a carbon', async () => {
            await contract.readCarbon(ctx, '1001').should.eventually.deep.equal({ value: 'carbon 1001 value' });
        });

        it('should throw an error for a carbon that does not exist', async () => {
            await contract.readCarbon(ctx, '1003').should.be.rejectedWith(/The carbon 1003 does not exist/);
        });

    });

    describe('#updateCarbon', () => {

        it('should update a carbon', async () => {
            await contract.updateCarbon(ctx, '1001', 'carbon 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"carbon 1001 new value"}'));
        });

        it('should throw an error for a carbon that does not exist', async () => {
            await contract.updateCarbon(ctx, '1003', 'carbon 1003 new value').should.be.rejectedWith(/The carbon 1003 does not exist/);
        });

    });

    describe('#deleteCarbon', () => {

        it('should delete a carbon', async () => {
            await contract.deleteCarbon(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a carbon that does not exist', async () => {
            await contract.deleteCarbon(ctx, '1003').should.be.rejectedWith(/The carbon 1003 does not exist/);
        });

    });

});
