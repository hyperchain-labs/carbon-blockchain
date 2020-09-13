/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Carbon } from './carbon';

@Info({title: 'CarbonContract', description: 'My Smart Contract' })
export class CarbonContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async carbonExists(ctx: Context, carbonId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(carbonId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createCarbon(ctx: Context, carbonId: string, value: string): Promise<void> {
        const exists = await this.carbonExists(ctx, carbonId);
        if (exists) {
            throw new Error(`The carbon ${carbonId} already exists`);
        }
        const carbon = new Carbon();
        carbon.value = value;
        const buffer = Buffer.from(JSON.stringify(carbon));
        await ctx.stub.putState(carbonId, buffer);
    }

    @Transaction(false)
    @Returns('Carbon')
    public async readCarbon(ctx: Context, carbonId: string): Promise<Carbon> {
        const exists = await this.carbonExists(ctx, carbonId);
        if (!exists) {
            throw new Error(`The carbon ${carbonId} does not exist`);
        }
        const buffer = await ctx.stub.getState(carbonId);
        const carbon = JSON.parse(buffer.toString()) as Carbon;
        return carbon;
    }

    @Transaction()
    public async updateCarbon(ctx: Context, carbonId: string, newValue: string): Promise<void> {
        const exists = await this.carbonExists(ctx, carbonId);
        if (!exists) {
            throw new Error(`The carbon ${carbonId} does not exist`);
        }
        const carbon = new Carbon();
        carbon.value = newValue;
        const buffer = Buffer.from(JSON.stringify(carbon));
        await ctx.stub.putState(carbonId, buffer);
    }

    @Transaction()
    public async deleteCarbon(ctx: Context, carbonId: string): Promise<void> {
        const exists = await this.carbonExists(ctx, carbonId);
        if (!exists) {
            throw new Error(`The carbon ${carbonId} does not exist`);
        }
        await ctx.stub.deleteState(carbonId);
    }

}
