# PathDB

**WORK IN PROGRESS**

Easy and small database created around the JSON structure

[![https://badgen.net/bundlephobia/minzip/@vorlefan/pathdb](https://badgen.net/bundlephobia/minzip/@vorlefan/pathdb)](https://bundlephobia.com/result?p=@vorlefan/pathdb)

With [npm](https://npmjs.org) do:

```
npm install @vorlefan/pathdb
```

With [yarn](https://yarnpkg.com/en/) do:

```
yarn add  @vorlefan/pathdb
```

<hr>

### Documentation

You can access on the folder 'docs' of this repository
A better documentation will be made at the near future.

<hr>

### Highlight

-   Create Models
-   Valid Models
-   Simple Query from Models
-   Easy to use and setup
-   Cache can be done with localStorage
-   Save temp files as a alternative backup

<hr>

### Example

Please, take a look at the 'example' folder of this repository

```ts
// model.ts

import { PathModel } from '../src';

const Model = new PathModel({
    modelName: 'db_create',
    routeName: 'main',
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
```
