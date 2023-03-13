import { Text } from "./text.js";

test('chunks of 2 of "example" are ["ex", "am", "pl", "e"]', function () {
    const text = new Text("example", 2);

    expect([...text.chunked()]).toStrictEqual(["ex", "am", "pl", "e"]);
});
