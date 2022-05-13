// @ts-check


import { log } from 'utils.mjs';

{
  // Loading .mjs files synchronously work.

  log("This works.");
  log("Expect an error:", 1234); // expect error
  //                      ^^^^
  //                      Expected 1 arguments, but got 2.ts(2554)
}

{
  // Typing example 1, fully typed lazy loading with bad ergonomics.

  /** @type {any} */
  const _any = {};

  /**
   * @type {{
   *  module: import("./utils.mjs")
   * }}
   */
  const lazyModules = _any;
  ChromeUtils.defineModuleGetters(lazyModules, {
    module: `utils.mjs`,
  });

  lazyModules.module.add(1, 2);
  lazyModules.module.add(1, "3"); // expect error.
  //                        ^^^
  //                        Argument of type 'string' is not assignable to parameter of
  //                        type 'number'.ts(2345)
}

{
  // Typing example 2. A small improvement on example 1 by changing the function
  // signature.

  /**
   * @type {{
   *  module: import("./utils.mjs")
   * }}
   */
  const lazyModules = ChromeUtils.defineModuleGetters2({
    module: `utils.mjs`,
  });

  lazyModules.module.add(1, 2);
  lazyModules.module.add(1, "3"); // expect error.
  //                        ^^^
  //                        Argument of type 'string' is not assignable to parameter of
  //                        type 'number'.ts(2345)

}

{
  // Typing example 3 - This is broken
  const lazyModules = ChromeUtils.defineModuleGetters3({
    module: `resource://utils.mjs`,
  });

  lazyModules.module.add(1, 2);
  //          ^^^^^^
  //          (property) module: any

  lazyModules.module.add(1, "3"); // Should error, but does not.
  //          ^^^^^^
  //          (property) module: any
}

{
  // Typing example 4 - This is the fully working example, with a modified API.
  const lazyModules = ChromeUtils.defineModulesGetters4({
    module: `resource://utils.mjs`,
  });

  lazyModules.module.add(1, 2);
  //          ^^^^^^
  //          (property) module: typeof import("/path/to/gecko-ts/src/utils")

  lazyModules.module.add(1, "3"); // expect error
  //                        ^^^
  //                        Argument of type 'string' is not assignable to parameter of
  //                        type 'number'.ts(2345)
}
