import assert from 'node:assert/strict';
import { build } from 'vite';

const consumer = '\0formcontrol-consumer';
async function bundle(expression) {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    plugins: [
      {
        name: 'formcontrol-consumer',
        resolveId: (id) => (id.endsWith(consumer) ? consumer : undefined),
        load: (id) =>
          id === consumer
            ? `import { ${expression.split('.')[0]} } from '@minneapolisstartribune/design-system/web'; export const Control = ${expression};`
            : undefined,
      },
    ],
    build: {
      write: false,
      lib: { entry: consumer, formats: ['es'] },
      rollupOptions: { external: (id) => /^(react|react-dom)(\/|$)/.test(id) },
    },
  });
  const output = (Array.isArray(result) ? result[0] : result).output.filter(
    (item) => item.type === 'chunk'
  );
  const modules = output.flatMap((chunk) =>
    Object.entries(chunk.modules)
      .filter(([, module]) => module.renderedLength > 0)
      .map(([id]) => id)
  );
  assert.ok(
    !modules.some((id) => /@tanstack\/(react-form|form-core)/.test(id)),
    `${expression} retained TanStack Form`
  );
  return {
    bytes: output.reduce((size, chunk) => size + Buffer.byteLength(chunk.code), 0),
    modules,
  };
}
for (const control of ['TextInput', 'NumberInput', 'Select']) {
  const direct = await bundle(control);
  const compound = await bundle(`FormControl.${control}`);
  for (const [name, result] of [
    [control, direct],
    [`FormControl.${control}`, compound],
  ]) {
    assert.ok(
      !result.modules.some((id) => /\/Datepicker\//.test(id)),
      `${name} retained calendar code`
    );
    console.log(`${name}: ${result.bytes} bytes, no datepicker or TanStack code`);
  }
  assert.ok(compound.bytes <= direct.bytes + 100, `${control} namespace added unrelated code`);
}
for (const expression of ['FormControlDatepicker', 'FormControl.Datepicker']) {
  const result = await bundle(expression);
  assert.ok(
    result.modules.some((id) => /\/Datepicker\/web\/Calendar\.es\.js$/.test(id)),
    `${expression} omitted the calendar`
  );
  console.log(`${expression}: ${result.bytes} bytes, calendar included`);
}
