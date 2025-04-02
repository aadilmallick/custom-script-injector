import { expect, test } from "vitest";
import { URLMatcherModel } from "../src/popup/URLMatcherModel";

test("matching urls", () => {
  // expect(sum(1, 2)).toBe(3)
  const url = `https://learning.edx.org/course/course-v1:UCSanDiegoX+CSE167x+2T2018/block-v1:UCSanDiegoX+CSE167x+2T2018+type@sequential+block@L1/block-v1:UCSanDiegoX+CSE167x+2T2018+type@vertical+block@vertical_8693e8570c5b`;
  const pattern = "https://learning.edx.org/*";
  expect(URLMatcherModel.matches(url, pattern)).toBe(true);
});
