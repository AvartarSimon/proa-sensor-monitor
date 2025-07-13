function randomList() {
  return new Array(~~(Math.random() * 10 + 3)).fill(0).map((_, index) => {
    return {
      year: 2000 + index,
      v1: ~~(Math.random() * 1000 + 10),
      v2: ~~(Math.random() * 1000 + 10),
      v3: ~~(Math.random() * 50000 + 100),
    };
  });
}

export function requestLeftBlock1() {
  return Promise.resolve({ data: randomList() });
}

export function requestLeftBlock2() {
  return Promise.resolve({ data: randomList() });
}

export function requestLeftBlock3() {
  return Promise.resolve({ data: randomList() });
}
