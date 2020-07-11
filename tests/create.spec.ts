import { PathModel } from '../src';

const Model = new PathModel({
    modelName: 'db_create',
    routeName: '@pathdb',
});

describe('Model', () => {
    test('Basic', async () => {
        await Model.model();
        const created = await Model.created();
        expect(created).toBe(true);
    });

    test('Read', async () => {
        const content = await Model.read();
        expect(typeof content === 'object').toBe(true);
    });
});
