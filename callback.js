const sum = (a, b) => {
  const c = a + b;
};

const sumWithCallback = (a, b, cb) => {
  const c = a + b;
  cb(c);
};


// Run sum
sum(1, 2);

// Run sumWithCallback
sumWithCallback(1, 2, (c) => {
  console.log(c);
});
