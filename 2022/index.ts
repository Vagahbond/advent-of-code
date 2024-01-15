const day = process.argv[2];
const chall = process.argv[3];
const input = process.argv[4] ?? "input.txt";

import(`./${day}/chall_${chall}.ts`).then((a) => {
  console.log(a.run(`./${day}/${input}`));
});
