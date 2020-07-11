import { PathModel } from '../src';

const Model = new PathModel({
    modelName: 'db_docs',
    routeName: '@pathdb',
});

describe('Docs', () => {
    test('Create', async () => {
        await Model.model();
        const created = await Model.created();
        expect(created).toBe(true);
    });

    test('New Doc', async () => {
        const doc = await Model.load();
        await doc.create({
            name: 'Michael',
            surname: 'Willian',
            email: 'dax-soft@live.com',
        });
        await doc.create({
            name: 'Michael',
            surname: 'Willian',
            email: 'dax-soft@live.com',
        });
        const saved = await doc.save();
        expect(saved).toBe(true);
    });

    test('FindByID', async () => {
        const doc = await Model.load();
        const content = doc.content();
        const id = content[0]._id;
        const find = doc.findById(id);
        expect(find.name).toBe('Michael');
    });

    test('Update', async () => {
        const doc = await Model.load();
        const content = doc.content();
        const id = content[0]._id;
        await doc.findByIdAndUpdate(id, {
            username: 'vorlefan',
        });
        const saved = await doc.save();
        expect(saved).toBe(true);
    });

    test('Backup', async () => {
        const doc = await Model.load();
        const hasDoneBackup = await doc.backup();
        expect(hasDoneBackup).toBe(true);
    });
});
