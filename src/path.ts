/*
:--------------------------------------------------------------------------
: Requires
:--------------------------------------------------------------------------
*/

import { PathRoute } from '@vorlefan/path';
import os from 'os';

/*
:--------------------------------------------------------------------------
: Path
:--------------------------------------------------------------------------
: Default PathRoute
*/

const DefaultRoutePath: PathRoute = new PathRoute();

DefaultRoutePath.set('@pathdb', DefaultRoutePath.resolve(__dirname, '..'));
DefaultRoutePath.set('main', DefaultRoutePath.back('@pathdb', 3));
DefaultRoutePath.set('@tmpdir', os.tmpdir());

// DefaultRoutePath.set(
//     'main',
//     DefaultRoutePath.resolve(__dirname, '..', '..', '..', '..')
// );

/*
:--------------------------------------------------------------------------
: [export]
:--------------------------------------------------------------------------
*/

export { DefaultRoutePath };
