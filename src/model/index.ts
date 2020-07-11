/*
:--------------------------------------------------------------------------
: Requires
:--------------------------------------------------------------------------
*/

import { PathRoute } from '@vorlefan/path';
import { DefaultRoutePath } from '../path';
import { I_PathModel_Args, I_PathModel_Data } from './types';
import { PathDocs } from './docs';

/*
:--------------------------------------------------------------------------
: Model
:--------------------------------------------------------------------------
: Core class structure of the PathDatabase
*/

class PathModel {
    _route: PathRoute;
    _modelName: string;
    _routeName: string;
    _docs: PathDocs;
    _backup: boolean;
    _schema?: Function | null;

    constructor({
        pathRoute = DefaultRoutePath,
        modelName = 'db.json',
        routeName = 'main',
        backup = true,
        schema = null,
    }: I_PathModel_Args) {
        this._route = pathRoute;
        this._modelName = PathModel.sanitizeFilename(modelName);
        this._routeName = routeName;
        this._backup = backup;
        this._schema = schema;
        this._docs = new PathDocs(this);
        return this;
    }

    /**
     * @description Returns the PathRoute instance
     */

    route(): PathRoute {
        return this._route;
    }

    /**
     * @description Returns the schema validator
     */

    async schema(data: object): Promise<Boolean> {
        if (!this._schema || typeof this._schema !== 'function') return true;
        const validator = await this._schema({ data });
        return !!validator;
    }

    /**
     * @description get the filename of the database in json
     */

    filename(): string {
        return `${this._modelName}.json`;
    }

    /**
     * @description Create the file of the model
     * @param {Object} [data]
     * @param {Boolean} [force] If it is true, then if the file already exists
     * it will overwrite it
     */

    async model(force = false) {
        if (!force) {
            const exists = await this.route()
                .io()
                .accessFile(
                    this.route().plug(this._routeName, this.filename())
                );

            if (!!exists) {
                return this;
            }
        }
        await this.create();
        return this;
    }

    /**
     * @description create the model file
     */

    async create() {
        await this.route().json().store({
            routeName: this._routeName,
            filename: this.filename(),
            data: PathModel.initData(),
            force: true,
        });
        return this;
    }

    /**
     * @description Checkout if the model file has been created
     */

    async created(): Promise<Boolean> {
        const exists = await this.route()
            .io()
            .accessFile(this.route().plug(this._routeName, this.filename()));
        return exists;
    }

    /**
     * @description Delete the database file
     */

    async unlink() {
        const exists = await this.created();
        if (!exists) return this;
        await this.route()
            .json()
            .remove({ routeName: this._routeName, filename: this.filename() });
        return this;
    }

    /**
     * @description read the database file
     */

    async read(): Promise<I_PathModel_Data | undefined> {
        const exists = await this.created();
        if (!exists) return undefined;
        const content: any = await this.route()
            .json()
            .read({ routeName: this._routeName, filename: this.filename() });
        return content;
    }

    /**
     * @description save the database file
     */

    async save(): Promise<Boolean> {
        const content = await this.read();
        if (!content) return false;

        content.updatedAt = Date.now();
        content.docs = this._docs._content;

        await this.route().json().store({
            routeName: this._routeName,
            filename: this.filename(),
            data: content,
            force: true,
        });

        return true;
    }

    /**
     * @description load and access the PathDocs
     * @returns {PathDocs}
     */

    async load(): Promise<PathDocs> {
        await this._docs.load();
        return this._docs;
    }

    /**
     * @description return the inital data from the database file
     */

    static initData(): I_PathModel_Data {
        return {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            docs: [],
        };
    }

    /**
     * @description sanitize the filename of the database
     */

    static sanitizeFilename(filename: string): string {
        const value = filename.replace(/(\.(\w+))$/gi, '');
        return `${value}`;
    }
}

/*
:--------------------------------------------------------------------------
: [export]
:--------------------------------------------------------------------------
*/

export { PathModel };
