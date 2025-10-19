import { describe, expect, it } from "vitest";
import { pk, sk } from "./index";

describe("key helpers", () => {
  it("builds post keys", () => {
    expect(pk.post("123")).toBe("POST#123");
    expect(sk.post()).toBe("POST");
    expect(sk.comment("c-1")).toBe("COMMENT#c-1");
  });
});
