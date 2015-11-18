// file is transformed by babel
// if it has extension "es", or "es6",
// or if it contains /* babel */

let p = process;
Object.keys(p).some((key) => {
  console.log(key);
});
