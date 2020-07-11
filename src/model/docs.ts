/*
:--------------------------------------------------------------------------
: Requires
:--------------------------------------------------------------------------
*/

import { PathModel } from '.';
// import { I_PathModel_Data } from './types';

/*
:--------------------------------------------------------------------------
: PathDocs
:--------------------------------------------------------------------------
*/

class PathDocs {
    _model: PathModel;
    _content: Array<any>;

    constructor(model: PathModel) {
        this._model = model;
        this._content = [];
    }

    /**
     * @description get the content
     */

    get() {
        return this._content;
    }

    content(): Array<any> {
        return Array.isArray(this._content)
            ? this._content
            : (this._content = []);
    }

    /**
     * @description load the content of Model
     */

    async load() {
        const content = await this._model.read();
        if (!content) {
            await this._model.model();
            this._content = [];
        } else {
            this._content = content.docs;
        }
        return this;
    }

    /**
     * @description create a new doc
     * @param {Object} data
     */

    async create(data: object) {
        const newDoc: any = { ...data };
        newDoc._id = PathDocs.id();
        const recent = Date.now();
        newDoc.createdAt = recent;
        newDoc.updateAt = recent;
        this.content().push(newDoc);
        await this.backup();
        return this;
    }

    /**
     * @description find a doc by his ID
     */

    findById(id: string) {
        if (!this._content) return undefined;
        return this._content.find((docs) => docs._id === id);
    }

    /**
     * @description find a doc by his ID and then update his values
     */

    async findByIdAndUpdate(id: string, data: object): Promise<Boolean> {
        const docs = this.findById(id);
        if (!docs) return false;
        const newDocs: any = Object.assign(docs, data);
        newDocs.createdAt = docs.createdAt;
        newDocs.updateAt = Date.now();
        newDocs._id = docs._id;
        return true;
    }

    /**
     * @description Find a doc by his ID and then delete it
     */

    async findByIdAndDelete(id): Promise<Boolean> {
        this._content = this._content.filter((doc) => doc._id !== id);
        return true;
    }

    /**
     * @description saves the docs
     */

    async save(): Promise<Boolean> {
        await this.backup();
        await this._model.save();
        return true;
    }

    /**
     * @description generate a backup
     */

    async backup(): Promise<Boolean> {
        if (!this._model._backup) return false;
        if (!this._model.route().has('@tmpdir')) return false;
        const content = { ...this.content() };
        await this._model
            .route()
            .json()
            .store({
                routeName: '@tmpdir',
                filename: `${
                    this._model._modelName
                }/${Date.now()}_${this._model.filename()}`,
                data: content,
            });
        this._model.route().remove('@rollback');
        this._model
            .route()
            .set(
                '@rollback',
                this._model.route().plug('@tmpdir', this._model._modelName)
            );
        return true;
    }

    /**
     * @description get the last backup data and turns it on the current
     */

    async rollback(save = true, customSort?: Function): Promise<Boolean> {
        if (!this._model.route().has('@tmpdir')) return false;
        if (!this._model.route().has('@rollback')) {
            this._model
                .route()
                .set(
                    '@rollback',
                    this._model.route().plug('@tmpdir', this._model._modelName)
                );
        }

        try {
            let files = this._model
                .route()
                .io()
                .files({ routeName: '@rollback', extension: 'json' })
                .sort((a, b) => {
                    const dateB = +b.name.replace(/\D/g, '');
                    const dateA = +a.name.replace(/\D/g, '');
                    return typeof customSort === 'function'
                        ? customSort(dateA, dateB)
                        : dateB - dateA;
                });

            const lastBackup: any = files.shift();

            const content = await this._model.route().json().read({
                routeName: '@rollback',
                filename: lastBackup.filename,
            });

            if (!!content) {
                const oldDoc = Object.values(content);
                this._content = [...oldDoc];
                if (!!save) await this.save();
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * @description generates a new id
     */

    static id(): string {
        return Date.now().toString(16);
    }
}

/*
:--------------------------------------------------------------------------
: Export
:--------------------------------------------------------------------------
*/

export { PathDocs };
