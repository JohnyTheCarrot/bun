import { run, bench, group } from "mitata";
import { ptr, dlopen, CString } from "bun:ffi";
const { napiNoop, napiHash, napiString } = require("./src/ffi_napi_bench.node");

const {
  symbols: {
    ffi_noop: { native: ffi_noop },
    ffi_hash: { native: ffi_hash },
    ffi_string: { native: ffi_string },
  },
} = dlopen("./src/ffi_napi_bench.node", {
  ffi_noop: { args: [], returns: "void" },
  ffi_string: { args: [], returns: "ptr" },
  ffi_hash: { args: ["ptr", "usize"], returns: "u32" },
});

const bytes = new Uint8Array(64);

group("bun:ffi", () => {
  bench("noop", () => ffi_noop());
  bench("hash", () => ffi_hash(ptr(bytes), bytes.byteLength));

  bench("c string", () => new CString(ffi_string()));
});

group("bun:napi", () => {
  bench("noop", () => napiNoop());
  bench("hash", () => napiHash(bytes));

  bench("string", () => napiString());
});

await run();
