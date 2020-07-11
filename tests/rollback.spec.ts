import { PathModel } from '../src';

const Model = new PathModel({
    modelName: 'db_docs',
    routeName: '@pathdb',
});

describe('Rollback', () => {
    test('Create', async () => {
        await Model.model();
        const created = await Model.created();
        expect(created).toBe(true);
    });

    test('Get', async () => {
        const doc = await Model.load();
        const rollback = await doc.rollback(false, (a, b) => a - b);
        await Model.route()
            .json()
            .set('@pathdb')
            .store({ filename: 'rollback.json', data: doc.content() });
        expect(rollback).toBe(true);
    });
});
